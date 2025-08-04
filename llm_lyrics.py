"""
LLM-based lyrics retrieval for ChordSync
Replaces the Spotify API lyrics endpoints that are no longer working
"""

import os
import json
import re
import time
from openai import OpenAI
from dotenv import load_dotenv
from icecream import ic

class LLMLyrics:
    def __init__(self):
        load_dotenv()
        # Get OpenAI API key from environment variables
        self.api_key = "no stealing my tokens" #os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise Exception("Missing OPENAI_API_KEY in environment variables")
        
        # Initialize the OpenAI client
        self.client = OpenAI(api_key=self.api_key)
        
        # Configuration
        self.model = "gpt-4o"  
        self.settings = {
            "temperature": 0.7,
        }
        
    def get_lyrics(self, track_id, artist_name, track_name):
        """
        Get lyrics for a song using an LLM (OpenAI API)
        
        Args:
            track_id: Spotify track ID (used for caching)
            artist_name: Name of the artist
            track_name: Name of the track
            
        Returns:
            A dictionary containing lyrics with approximate timestamps
        """
        try:
            # Clean up track name - remove things like "Remastered", "Live", etc.
            clean_track_name = re.sub(r'\s-\s.*?(remaster|version|live|edit|mix).*?$', '', track_name, flags=re.IGNORECASE)
            clean_track_name = re.sub(r'\(.*?(remaster|version|live|edit|mix).*?\)', '', clean_track_name, flags=re.IGNORECASE)
            
            # Create the prompt for the LLM
            system_prompt = """
            You are a lyrics database assistant. Please provide the complete lyrics for the requested song.
            Format the lyrics as a plain text with one line per verse/line (no line numbers).
            Do not include any additional information, introduction, or notes - just the song lyrics.
            """
            #If you don't know the lyrics, respond with "LYRICS_NOT_FOUND".
            
            user_prompt = f"Provide the complete lyrics for the song '{clean_track_name}' by {artist_name}."
            
            # Make API call to OpenAI using the current API format
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=self.settings.get("temperature", 0.7)
            )
            
            # Extract the response text
            raw_lyrics = response.choices[0].message.content.strip()
            
            print("Raw lyrics: ")
            print(raw_lyrics)
            # Check if lyrics were found
            if raw_lyrics == "LYRICS_NOT_FOUND":
                return {"lyrics": {"syncType": "UNSYNCED", "lines": []}}
            
            # Process lyrics into lines
            lyrics_lines = [line for line in raw_lyrics.split('\n') if line.strip()]
            
            # Format into the response structure similar to what Spotify would return
            result = {
                "lyrics": {
                    "syncType": "LINE_SYNCED",
                    "lines": self._generate_timed_lyrics(lyrics_lines)
                }
            }
            
            return result
            
        except Exception as e:
            ic(f"Error fetching lyrics with LLM: {e}")
            # Return an empty result that mimics the structure expected by the app
            return {"lyrics": {"syncType": "UNSYNCED", "lines": []}}
    
    def _generate_timed_lyrics(self, lyrics_lines):
        """
        Generate approximate timestamps for lyrics lines
        
        This uses "dead reckoning" - distributing the lines evenly across a typical song length
        
        Args:
            lyrics_lines: List of lyrics lines
            
        Returns:
            List of dictionaries with startTimeMs and words for each line
        """
        # Assume an average song length of 3:30 (210 seconds or 210,000 ms)
        # We'll distribute the lines evenly across this time
        average_song_length_ms = 210000
        
        # Remove empty lines and instrumental indicators
        filtered_lines = [line for line in lyrics_lines if line.strip() and not re.match(r'^\[.*?\]$', line.strip())]
        
        # If no valid lines, return empty list
        if not filtered_lines:
            return []
        
        # Calculate time per line
        time_per_line = average_song_length_ms / len(filtered_lines)
        
        # Create timed lyrics
        timed_lyrics = []
        for i, line in enumerate(filtered_lines):
            line_time_ms = int(i * time_per_line)
            timed_lyrics.append({
                "startTimeMs": str(line_time_ms),
                "words": line.strip()
            })
        
        return timed_lyrics
    
    def adjust_timestamps(self, lyrics_data, track_duration_ms):
        """
        Adjust timestamps to match the actual song duration
        
        Args:
            lyrics_data: Lyrics data with timestamps
            track_duration_ms: Actual duration of the track in milliseconds
            
        Returns:
            Updated lyrics data with adjusted timestamps
        """
        if not lyrics_data or "lyrics" not in lyrics_data or "lines" not in lyrics_data["lyrics"]:
            return lyrics_data
        
        lines = lyrics_data["lyrics"]["lines"]
        if not lines:
            return lyrics_data
        
        # Calculate the scaling factor
        last_timestamp = int(lines[-1]["startTimeMs"])
        if last_timestamp == 0:
            return lyrics_data
            
        scaling_factor = (track_duration_ms * 0.92) / last_timestamp  # Leave some space at the end
        
        # Adjust timestamps
        for line in lines:
            line["startTimeMs"] = str(int(int(line["startTimeMs"]) * scaling_factor))
        
        return lyrics_data