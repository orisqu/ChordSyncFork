#!/usr/bin/env python3
"""
Standalone test script for LLM lyrics functionality.
This script doesn't rely on Flask's session and can be run directly.
"""

import os
import json
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
from llm_lyrics import LLMLyrics

def test_llm_lyrics():
    """
    Test function for LLM lyrics - gets current Spotify track and fetches lyrics
    """
    load_dotenv()
    print("\n===== LLM Lyrics Test =====\n")
    
    # Initialize LLM lyrics provider
    try:
        llm_provider = LLMLyrics()
        print("✅ Successfully initialized LLM lyrics provider")
    except Exception as e:
        print(f"❌ Failed to initialize LLM lyrics provider: {e}")
        return
    
    # Set up Spotify OAuth
    try:
        # Get credentials from .env
        if os.getenv("DEV_OR_PROD") == "PRODUCTION":
            client_id = os.getenv("SPOTIFY_CLIENT_ID")
            client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
            redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI")
        else:
            client_id = os.getenv("SPOTIFY_CLIENT_ID_LOCAL")
            client_secret = os.getenv("SPOTIFY_CLIENT_SECRET_LOCAL")
            redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI_LOCAL")
        
        scope = 'user-read-playback-state'
        
        # Create SpotifyOAuth instance
        sp_oauth = SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope=scope,
            cache_path=".test_spotify_cache"
        )
        
        print("✅ Set up Spotify OAuth")
    except Exception as e:
        print(f"❌ Failed to set up Spotify OAuth: {e}")
        return
    
    # Get or refresh token
    try:
        token_info = sp_oauth.get_cached_token()
        
        if not token_info:
            auth_url = sp_oauth.get_authorize_url()
            print(f"\nPlease visit this URL to authorize access: {auth_url}")
            response = input("Enter the URL you were redirected to: ")
            code = sp_oauth.parse_response_code(response)
            token_info = sp_oauth.get_access_token(code)
        
        if sp_oauth.is_token_expired(token_info):
            token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
        
        print("✅ Successfully authenticated with Spotify")
    except Exception as e:
        print(f"❌ Failed to authenticate with Spotify: {e}")
        return
    
    # Create Spotify client
    spotify = spotipy.Spotify(auth=token_info['access_token'])
    
    # Get current track
    try:
        current_playback = spotify.current_playback()
        
        if not current_playback or 'item' not in current_playback or not current_playback['item']:
            # Try alternative method
            current_track = spotify.current_user_playing_track()
            if not current_track or 'item' not in current_track or not current_track['item']:
                print("❌ No track currently playing on Spotify")
                return
            current_playback = current_track
        
        track_id = current_playback['item']['id']
        track_name = current_playback['item']['name']
        artist_name = current_playback['item']['artists'][0]['name']
        track_duration_ms = current_playback['item'].get('duration_ms', 0)
        
        print(f"✅ Found currently playing track: '{track_name}' by {artist_name}")
        print(f"  Track ID: {track_id}")
        print(f"  Duration: {track_duration_ms}ms")
    except Exception as e:
        print(f"❌ Failed to get current track: {e}")
        return
    
    # Get lyrics using LLM
    print(f"\nFetching lyrics using LLM...")
    try:
        lyrics_result = llm_provider.get_lyrics(track_id, artist_name, track_name)
        print(lyrics_result)

        if "lyrics" not in lyrics_result or "lines" not in lyrics_result["lyrics"]:
            print("❌ Failed to get lyrics - invalid response format")
            return
            
        lines = lyrics_result["lyrics"]["lines"]
        sync_type = lyrics_result["lyrics"]["syncType"]
        print(lines)
        print(f"✅ Successfully fetched lyrics with sync type: {sync_type}")
        print(f"✅ Number of lyrics lines: {len(lines)}")
        
        # Print sample of lyrics lines (not the full lyrics)
        if lines:
            print("\nSample of lyrics data structure (first 3 lines):")
            sample_lines = lines[:min(3, len(lines))]
            for i, line in enumerate(sample_lines):
                # Just print data structure without the full lyrics content
                start_time = line.get("startTimeMs", "N/A")
                words_preview = line.get("words", "")[:10] + "..." if line.get("words", "") else "N/A"
                print(f"  Line {i+1}: Time: {start_time}ms, Preview: {words_preview}")
        
        # Test timestamp adjustment
        if track_duration_ms > 0:
            print("\nTesting timestamp adjustment...")
            adjusted_lyrics = llm_provider.adjust_timestamps(lyrics_result, track_duration_ms)
            print(f"✅ Successfully adjusted timestamps to match track duration: {track_duration_ms}ms")
            
            # Print example of original vs adjusted timestamp
            if lines and len(lines) > 0:
                original_time = lines[-1].get("startTimeMs", "N/A")
                adjusted_time = adjusted_lyrics["lyrics"]["lines"][-1].get("startTimeMs", "N/A")
                print(f"  Last line original timestamp: {original_time}ms")
                print(f"  Last line adjusted timestamp: {adjusted_time}ms")
        
    except Exception as e:
        print(f"❌ Error fetching lyrics: {e}")
        return
    
    print("\n===== Test Completed =====")

# If running as a script
if __name__ == "__main__":
    test_llm_lyrics()