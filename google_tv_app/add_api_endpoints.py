#!/usr/bin/env python3
"""
ChordSync API Endpoints for Google TV App

This script adds API endpoints to the main ChordSync app to support the Google TV app.
Run this script after starting the main ChordSync app to add the necessary endpoints.

Usage:
    python add_api_endpoints.py

Note: This script does not modify any existing files. It creates a new Flask app
that proxies requests to the main ChordSync app and adds the necessary API endpoints.
"""

import os
import sys
import json
import requests
from flask import Flask, jsonify, request
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
CHORDSYNC_URL = os.getenv("CHORDSYNC_URL", "http://localhost:5000")
API_PORT = int(os.getenv("API_PORT", 5002))

# Create Flask app
app = Flask(__name__)

@app.route('/api/track-data')
def api_track_data():
    """API endpoint for track data"""
    try:
        # Get track ID, name, and artist from query parameters
        track_id = request.args.get('track_id')
        track_name = request.args.get('track_name')
        artist_name = request.args.get('artist_name')
        
        # If no track ID is provided, proxy the request to the main ChordSync app
        if not track_id:
            response = requests.get(f"{CHORDSYNC_URL}/api/track-data")
            return response.text, response.status_code, {'Content-Type': 'application/json'}
        
        # Get track data from main ChordSync app
        response = requests.get(f"{CHORDSYNC_URL}/api/track-data")
        
        if response.status_code != 200:
            return jsonify({
                'error': f"Failed to get track data: {response.text}",
                'track_name': track_name,
                'artist_name': artist_name
            })
        
        # Return the track data
        return response.text, response.status_code, {'Content-Type': 'application/json'}
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'track_name': track_name if track_name else 'Unknown',
            'artist_name': artist_name if artist_name else 'Unknown'
        })

@app.route('/api/chord-data')
def api_chord_data():
    """API endpoint for chord data"""
    try:
        # Get track ID, name, and artist from query parameters
        track_id = request.args.get('track_id')
        track_name = request.args.get('track_name')
        artist_name = request.args.get('artist_name')
        
        if not track_id or not track_name or not artist_name:
            return jsonify({
                'error': 'Missing required parameters: track_id, track_name, artist_name',
                'main_chords_body': 'Error: Missing required parameters'
            })
        
        # This is a simplified version that would need to be expanded
        # to actually fetch chord data from the main ChordSync app
        # For now, we'll just return a placeholder
        
        return jsonify({
            'track_id': track_id,
            'track_name': track_name,
            'artist_name': artist_name,
            'main_chords_body': f"Chord data for {track_name} by {artist_name}",
            'guitar_tuning': 'E A D G B E',
            'guitar_capo': '0',
            'track_key': 'C',
            'musixmatch_lyrics_is_linesynced': 0
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'main_chords_body': f"Error: {str(e)}"
        })

def main():
    """Main function"""
    print(f"Starting ChordSync API server on port {API_PORT}...")
    print(f"Main ChordSync app URL: {CHORDSYNC_URL}")
    print("Press Ctrl+C to stop the server.")
    
    app.run(host='0.0.0.0', port=API_PORT, debug=True)

if __name__ == '__main__':
    main()