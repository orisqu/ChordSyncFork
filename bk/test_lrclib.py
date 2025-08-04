#!/usr/bin/env python3



'''
Example output:

===== LRCLIB Lyrics Test =====

✅ Successfully initialized LRCLIB lyrics provider
✅ Set up Spotify OAuth
✅ Successfully authenticated with Spotify
✅ Found currently playing track: 'We Didn't Start the Fire' by Billy Joel
  Track ID: 3Cx4yrFaX8CeHwBMReOWXI
  Album: Storm Front
  Duration: 287733ms

Fetching lyrics using LRCLIB...
✅ Successfully fetched lyrics with sync type: LINE_SYNCED
✅ Number of lyrics lines: 71
  Line 1: Time: 32170ms, Harry Truman, Doris Day, Red China, Johnnie Ray
  Line 2: Time: 35980ms, South Pacific, Walter Winchell, Joe DiMaggio
  Line 3: Time: 38800ms, Joe McCarthy, Richard Nixon, Studebaker, television
  Line 4: Time: 42540ms, North Korea, South Korea, Marilyn Monroe
  Line 5: Time: 52400ms, Rosenbergs, H-bomb, Sugar Ray, Panmunjom
  Line 6: Time: 55970ms, Brando, "The King and I", and "The Catcher in the Rye"
  Line 7: Time: 59160ms, Eisenhower, Vaccine, England's got a new queen
  Line 8: Time: 62170ms, Marciano, Liberace, Santayana, goodbye
  Line 9: Time: 65380ms, We didn't start the fire
  Line 10: Time: 68230ms, It was always burning, since the world's been turning
  Line 11: Time: 72000ms, We didn't start the fire
  Line 12: Time: 76330ms, No, we didn't light it, but we tried to fight it
  Line 13: Time: 78900ms, Joseph Stalin, Malenkov, Nasser and Prokofiev
  Line 14: Time: 82420ms, Rockefeller, Campanella, Communist Bloc
  Line 15: Time: 85930ms, Roy Cohn, Juan Peron, Toscanini, Dacron
  Line 16: Time: 89140ms, Dien Bien Phu falls, "Rock Around the Clock"
  Line 17: Time: 92340ms, Einstein, James Dean, Brooklyn's got a winning team
  Line 18: Time: 95810ms, Davy Crockett, Peter Pan, Elvis Presley, Disneyland
  Line 19: Time: 99060ms, Bardot, Budapest, Alabama, Krushchev
  Line 20: Time: 102280ms, Princess Grace, Peyton Place, Trouble in the Suez
  Line 21: Time: 105160ms, We didn't start the fire
  Line 22: Time: 108390ms, It was always burning, since the world's been turning
  Line 23: Time: 112470ms, We didn't start the fire
  Line 24: Time: 115650ms, No, we didn't light it, but we tried to fight it
  Line 25: Time: 119380ms, Little Rock, Pasternak, Mickey Mantle, Kerouac
  Line 26: Time: 122540ms, Sputnik, Chou En-Lai, "Bridge on the River Kwai"
  Line 27: Time: 125520ms, Lebanon, Charles de Gaulle, California baseball
  Line 28: Time: 128420ms, Starkweather homicide, children of thalidomide
  Line 29: Time: 135690ms, Buddy Holly, Ben Hur, space monkey, mafia
  Line 30: Time: 138670ms, Hula hoops, Castro, Edsel is a no-go
  Line 31: Time: 142340ms, U2, Syngman Rhee, Payola and Kennedy
  Line 32: Time: 145060ms, Chubby Checker, Psycho, Belgians in the Congo
  Line 33: Time: 148750ms, We didn't start the fire
  Line 34: Time: 151750ms, It was always burning, since the world's been turning
  Line 35: Time: 156000ms, We didn't start the fire
  Line 36: Time: 159260ms, No, we didn't light it, but we tried to fight it
  Line 37: Time: 161820ms, Hemingway, Eichmann, "Stranger in a Strange Land"
  Line 38: Time: 165370ms, Dylan, Berlin, Bay of Pigs invasion
  Line 39: Time: 168330ms, "Lawrence of Arabia", British Beatlemania
  Line 40: Time: 171280ms, Ole Miss, John Glenn, Liston beats Patterson
  Line 41: Time: 175510ms, Pope Paul, Malcolm X, British politician sex
  Line 42: Time: 178440ms, JFK – blown away, what else do I have to say?
  Line 43: Time: 182220ms, We didn't start the fire
  Line 44: Time: 185410ms, It was always burning, since the world's been turning
  Line 45: Time: 187860ms, We didn't start the fire
  Line 46: Time: 191060ms, No, we didn't light it, but we tried to fight it
  Line 47: Time: 195050ms, Birth control, Ho Chi Minh, Richard Nixon back again
  Line 48: Time: 198510ms, Moonshot, Woodstock, Watergate, punk rock
  Line 49: Time: 201770ms, Begin, Reagan, Palestine, terror on the airline
  Line 50: Time: 204920ms, Ayatollah's in Iran, Russians in Afghanistan
  Line 51: Time: 207990ms, "Wheel of Fortune", Sally Ride, heavy metal suicide
  Line 52: Time: 211330ms, Foreign debts, homeless vets, AIDS, crack, Bernie Goetz
  Line 53: Time: 215120ms, Hypodermics on the shore, China's under martial law
  Line 54: Time: 218370ms, Rock and roller, cola wars, I can't take it anymore
  Line 55: Time: 221590ms, We didn't start the fire
  Line 56: Time: 224700ms, It was always burning, since the world's been turning
  Line 57: Time: 228210ms, We didn't start the fire
  Line 58: Time: 231420ms, But when we are gone
  Line 59: Time: 233020ms, It will still burn on, and on, and on, and on, and on, and on, and on, and on
  Line 60: Time: 241800ms, We didn't start the fire
  Line 61: Time: 243790ms, It was always burning, since the world's been turning
  Line 62: Time: 248060ms, We didn't start the fire
  Line 63: Time: 251560ms, No, we didn't light it, but we tried to fight it
  Line 64: Time: 254740ms, We didn't start the fire
  Line 65: Time: 258110ms, It was always burning, since the world's been turning
  Line 66: Time: 261670ms, We didn't start the fire
  Line 67: Time: 264810ms, No, we didn't light it, but we tried to fight it
  Line 68: Time: 268330ms, We didn't start the fire
  Line 69: Time: 271540ms, It was always burning, since the world's been turning
  Line 70: Time: 275040ms, We didn't start the fire
  Line 71: Time: 277710ms, No, we didn't light it, but we tried to fight it

Testing timestamp adjustment...
✅ Successfully adjusted timestamps to match track duration: 287733ms
  Last line original timestamp: 273346ms
  Last line adjusted timestamp: 273346ms

===== Test Completed =====
'''

import os
import json
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
from lrclib_lyrics import LRCLIBLyrics

def test_lrclib_lyrics():
    """
    Test function for LRCLIB lyrics - gets current Spotify track and fetches lyrics
    """
    load_dotenv()
    print("\n===== LRCLIB Lyrics Test =====\n")
    
    # Initialize LRCLIB lyrics provider
    try:
        lrclib_provider = LRCLIBLyrics()
        print("✅ Successfully initialized LRCLIB lyrics provider")
    except Exception as e:
        print(f"❌ Failed to initialize LRCLIB lyrics provider: {e}")
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
        
        # Get album info if available
        album_name = None
        if 'album' in current_playback['item'] and current_playback['item']['album']:
            album_name = current_playback['item']['album'].get('name')
        
        print(f"✅ Found currently playing track: '{track_name}' by {artist_name}")
        print(f"  Track ID: {track_id}")
        print(f"  Album: {album_name or 'N/A'}")
        print(f"  Duration: {track_duration_ms}ms")
    except Exception as e:
        print(f"❌ Failed to get current track: {e}")
        return
    
    # Get lyrics using LRCLIB
    print(f"\nFetching lyrics using LRCLIB...")
    try:
        lyrics_result = lrclib_provider.get_lyrics(track_id, artist_name, track_name, album_name, track_duration_ms)
        
        if "lyrics" not in lyrics_result or "lines" not in lyrics_result["lyrics"]:
            print("❌ Failed to get lyrics - invalid response format")
            return
            
        lines = lyrics_result["lyrics"]["lines"]
        sync_type = lyrics_result["lyrics"]["syncType"]
        
        print(f"✅ Successfully fetched lyrics with sync type: {sync_type}")
        print(f"✅ Number of lyrics lines: {len(lines)}")
        
        # Print sample of lyrics lines (not the full lyrics)
        if lines:
            sample_lines = lines #lines[:min(3, len(lines))]
            for i, line in enumerate(sample_lines):
                if sync_type == "LINE_SYNCED":
                    # Just print data structure without the full lyrics content
                    start_time = line.get("startTimeMs", "N/A")
                    words_preview = line.get("words", "") #line.get("words", "")[:10] + "..." if line.get("words", "") else "N/A"
                    print(f"  Line {i+1}: Time: {start_time}ms, {words_preview}")
                else:
                    # For unsynced lyrics
                    words_preview = line[:10] + "..." if line else "N/A"
                    print(f"  Line {i+1}: Preview: {words_preview}")
        
        # Test timestamp adjustment
        if track_duration_ms > 0 and sync_type == "LINE_SYNCED":
            print("\nTesting timestamp adjustment...")
            adjusted_lyrics = lrclib_provider.adjust_timestamps(lyrics_result, track_duration_ms)
            print(f"✅ Successfully adjusted timestamps to match track duration: {track_duration_ms}ms")
            
            # Print example of original vs adjusted timestamp
            if lines and len(lines) > 0 and "startTimeMs" in lines[-1]:
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
    test_lrclib_lyrics()
