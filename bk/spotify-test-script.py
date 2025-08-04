"""
Extended Spotify API test script
This script tests various Spotify API endpoints relevant to ChordSync functionality
"""

import os
import sys
import json
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

load_dotenv()

def test_spotify_api():
    """Test all relevant Spotify API functionality"""
    
    # Get credentials from .env
    client_id = os.getenv("SPOTIFY_CLIENT_ID_LOCAL")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET_LOCAL")
    redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI_LOCAL")
    
    if not all([client_id, client_secret, redirect_uri]):
        print("ERROR: Missing Spotify credentials in .env file")
        return False
    
    print(f"Using client_id: {client_id}")
    print(f"Using redirect_uri: {redirect_uri}")
    
    # Set up authentication
    scope = 'user-read-playback-state user-modify-playback-state'
    sp_oauth = SpotifyOAuth(
        client_id=client_id, 
        client_secret=client_secret, 
        redirect_uri=redirect_uri, 
        scope=scope,
        show_dialog=True,
        cache_path=".spotify_cache"
    )
    
    # Check for existing token
    token_info = sp_oauth.get_cached_token()
    
    if not token_info:
        # Get new token
        auth_url = sp_oauth.get_authorize_url()
        print(f"Please visit this URL to authorize access: {auth_url}")
        response = input("Enter the URL you were redirected to: ")
        code = sp_oauth.parse_response_code(response)
        token_info = sp_oauth.get_access_token(code)
    
    # Check if token needs refresh
    if sp_oauth.is_token_expired(token_info):
        print("Token expired, refreshing...")
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
    
    # Create Spotify client
    print("Creating Spotify client...")
    spotify = spotipy.Spotify(auth=token_info['access_token'])
    
    # Test user profile
    try:
        print("\n--- Testing User Profile ---")
        current_user = spotify.current_user()
        print(f"Successfully authenticated as: {current_user['display_name']}")
    except Exception as e:
        print(f"ERROR getting user profile: {e}")
        return False
    
    # Test playback
    try:
        print("\n--- Testing Current Playback ---")
        current_playback = spotify.current_playback()
        
        if current_playback:
            print("Current playback found!")
            print(f"Track: {current_playback['item']['name']}")
            print(f"Artist: {current_playback['item']['artists'][0]['name']}")
            print(f"Track ID: {current_playback['item']['id']}")
            print(f"Duration: {current_playback['item']['duration_ms']} ms")
            print(f"Progress: {current_playback['progress_ms']} ms")
            print(f"Is playing: {current_playback['is_playing']}")
            
            # Test track analysis
            track_id = current_playback['item']['id']
            
            # Get audio features (BPM, key, etc.)
            print("\n--- Testing Audio Features ---")
            try:
                audio_features = spotify.audio_features([track_id])
                if audio_features and audio_features[0]:
                    print(f"BPM (Tempo): {audio_features[0]['tempo']}")
                    print(f"Key: {audio_features[0]['key']}")
                    print(f"Mode: {audio_features[0]['mode']} (0=minor, 1=major)")
                else:
                    print("No audio features found")
            except Exception as e:
                print(f"ERROR getting audio features: {e}")
            
            # Try to get devices
            print("\n--- Testing Available Devices ---")
            try:
                devices = spotify.devices()
                if devices and devices['devices']:
                    print("Available devices:")
                    for device in devices['devices']:
                        print(f"- {device['name']} ({device['type']}), Active: {device['is_active']}")
                else:
                    print("No devices found")
            except Exception as e:
                print(f"ERROR getting devices: {e}")
                
        else:
            print("No active playback found. Please start playing a track in Spotify.")
            return False
            
    except Exception as e:
        print(f"ERROR getting current playback: {e}")
        return False
    
    print("\nAll tests completed successfully!")
    return True

if __name__ == "__main__":
    print("Starting Spotify API Test")
    test_spotify_api()