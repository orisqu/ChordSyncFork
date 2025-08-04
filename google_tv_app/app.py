"""
ChordSync Google TV App

This is a view-only interface for Google TV that displays the current song
information from the main ChordSync app. It uses Spotify's Device Code Flow
for authentication and does not require any interaction on the TV itself.
"""

import os
import json
import time
import requests
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY") or os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Spotify API credentials
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

# Main ChordSync app URL (default to localhost if not specified)
CHORDSYNC_URL = os.getenv("CHORDSYNC_URL", "http://localhost:5000")

# Spotify API endpoints
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_DEVICE_AUTH_URL = "https://accounts.spotify.com/api/device"
SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"

# Routes
@app.route('/')
def index():
    """Main page - displays the current song information or auth screen"""
    if 'access_token' in session and not is_token_expired():
        return render_template('tv_view.html')
    else:
        return render_template('auth.html')

@app.route('/auth/device')
def device_auth():
    """Initiates the Device Code Flow authentication process"""
    # Clear any existing session data
    session.pop('access_token', None)
    session.pop('refresh_token', None)
    session.pop('expires_at', None)
    session.pop('device_code', None)
    
    # Request device code from Spotify
    response = requests.post(
        SPOTIFY_DEVICE_AUTH_URL,
        data={
            'client_id': SPOTIFY_CLIENT_ID,
            'scope': 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        },
        headers={
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    )
    
    if response.status_code != 200:
        logger.error(f"Failed to get device code: {response.text}")
        return render_template('error.html', error="Failed to get device code from Spotify")
    
    auth_data = response.json()
    
    # Store device code in session
    session['device_code'] = auth_data['device_code']
    session['user_code'] = auth_data['user_code']
    session['verification_uri'] = auth_data['verification_uri']
    session['expires_in'] = auth_data['expires_in']
    session['interval'] = auth_data['interval']
    
    # Render the auth page with the code to enter
    return render_template(
        'device_auth.html',
        user_code=auth_data['user_code'],
        verification_uri=auth_data['verification_uri']
    )

@app.route('/auth/poll')
def poll_auth():
    """Polls Spotify to check if the user has authorized the app"""
    if 'device_code' not in session:
        return jsonify({'status': 'error', 'message': 'No device code in session'})
    
    # Request access token using device code
    response = requests.post(
        SPOTIFY_AUTH_URL,
        data={
            'client_id': SPOTIFY_CLIENT_ID,
            'client_secret': SPOTIFY_CLIENT_SECRET,
            'grant_type': 'device_code',
            'device_code': session['device_code']
        },
        headers={
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    )
    
    # If authorization is pending, return status
    if response.status_code == 400 and 'authorization_pending' in response.text:
        return jsonify({'status': 'pending'})
    
    # If successful, store tokens and redirect
    if response.status_code == 200:
        token_data = response.json()
        
        # Store tokens in session
        session['access_token'] = token_data['access_token']
        session['refresh_token'] = token_data['refresh_token']
        session['expires_at'] = datetime.now().timestamp() + token_data['expires_in']
        
        # Clear device code
        session.pop('device_code', None)
        session.pop('user_code', None)
        session.pop('verification_uri', None)
        session.pop('expires_in', None)
        session.pop('interval', None)
        
        return jsonify({'status': 'success', 'redirect': url_for('index')})
    
    # If error, return error message
    return jsonify({'status': 'error', 'message': response.text})

@app.route('/api/current_track')
def current_track():
    """Returns the current track information from Spotify"""
    if 'access_token' not in session:
        return jsonify({'error': 'Not authenticated'})
    
    # Refresh token if expired
    if is_token_expired():
        if not refresh_token():
            return jsonify({'error': 'Failed to refresh token'})
    
    # Get current track from Spotify
    response = requests.get(
        f"{SPOTIFY_API_BASE_URL}/me/player/currently-playing",
        headers={
            'Authorization': f"Bearer {session['access_token']}"
        }
    )
    
    if response.status_code == 204:
        return jsonify({'error': 'No track currently playing'})
    
    if response.status_code != 200:
        return jsonify({'error': f"Failed to get current track: {response.text}"})
    
    track_data = response.json()
    
    # Get chord data from main ChordSync app
    chord_data = get_chord_data(
        track_data['item']['id'],
        track_data['item']['name'],
        track_data['item']['artists'][0]['name']
    )
    
    # Combine data
    result = {
        'track': {
            'id': track_data['item']['id'],
            'name': track_data['item']['name'],
            'artist': track_data['item']['artists'][0]['name'],
            'album': track_data['item']['album']['name'],
            'album_cover': track_data['item']['album']['images'][0]['url'] if track_data['item']['album']['images'] else None,
            'duration_ms': track_data['item']['duration_ms'],
            'progress_ms': track_data['progress_ms'],
            'is_playing': track_data['is_playing']
        },
        'chords': chord_data
    }
    
    return jsonify(result)

@app.route('/api/playback_state')
def playback_state():
    """Returns the current playback state from Spotify"""
    if 'access_token' not in session:
        return jsonify({'error': 'Not authenticated'})
    
    # Refresh token if expired
    if is_token_expired():
        if not refresh_token():
            return jsonify({'error': 'Failed to refresh token'})
    
    # Get current playback state from Spotify
    response = requests.get(
        f"{SPOTIFY_API_BASE_URL}/me/player",
        headers={
            'Authorization': f"Bearer {session['access_token']}"
        }
    )
    
    if response.status_code == 204:
        return jsonify({'error': 'No active device'})
    
    if response.status_code != 200:
        return jsonify({'error': f"Failed to get playback state: {response.text}"})
    
    playback_data = response.json()
    
    result = {
        'is_playing': playback_data.get('is_playing', False),
        'progress_ms': playback_data.get('progress_ms', 0),
        'shuffle_state': playback_data.get('shuffle_state', False),
        'repeat_state': playback_data.get('repeat_state', 'off'),
        'volume_percent': playback_data.get('device', {}).get('volume_percent', 50)
    }
    
    return jsonify(result)

# Helper functions
def is_token_expired():
    """Check if the access token is expired"""
    if 'expires_at' not in session:
        return True
    
    return datetime.now().timestamp() > session['expires_at']

def refresh_token():
    """Refresh the access token using the refresh token"""
    if 'refresh_token' not in session:
        return False
    
    response = requests.post(
        SPOTIFY_AUTH_URL,
        data={
            'client_id': SPOTIFY_CLIENT_ID,
            'client_secret': SPOTIFY_CLIENT_SECRET,
            'grant_type': 'refresh_token',
            'refresh_token': session['refresh_token']
        },
        headers={
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    )
    
    if response.status_code != 200:
        logger.error(f"Failed to refresh token: {response.text}")
        return False
    
    token_data = response.json()
    
    # Update tokens in session
    session['access_token'] = token_data['access_token']
    if 'refresh_token' in token_data:
        session['refresh_token'] = token_data['refresh_token']
    session['expires_at'] = datetime.now().timestamp() + token_data['expires_in']
    
    return True

def get_chord_data(track_id, track_name, artist_name):
    """Get chord data from the main ChordSync app"""
    try:
        # Try to get data from main ChordSync app's API
        response = requests.get(
            f"{CHORDSYNC_URL}/api/track-data",
            params={
                'track_id': track_id,
                'track_name': track_name,
                'artist_name': artist_name
            }
        )
        
        if response.status_code != 200:
            logger.error(f"Failed to get chord data: {response.text}")
            return {
                'error': 'Failed to get chord data',
                'main_chords_body': f"Could not retrieve chord data for {track_name} by {artist_name}"
            }
        
        return response.json()
    except Exception as e:
        logger.error(f"Error getting chord data: {str(e)}")
        return {
            'error': str(e),
            'main_chords_body': f"Error retrieving chord data: {str(e)}"
        }

if __name__ == '__main__':
    # Run the app on all interfaces on port 5001 (to avoid conflict with main ChordSync)
    app.run(host='0.0.0.0', port=5001, debug=True)