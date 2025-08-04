#!/usr/bin/env python3
"""
ChordSync Google TV App Test Script

This script tests the Google TV app by making requests to its API endpoints
and verifying that they return the expected responses.

Usage:
    python test_app.py
"""

import os
import sys
import json
import time
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
TV_APP_URL = os.getenv("TV_APP_URL", "http://localhost:5001")
CHORDSYNC_URL = os.getenv("CHORDSYNC_URL", "http://localhost:5000")
API_URL = os.getenv("API_URL", "http://localhost:5002")

def test_tv_app():
    """Test the TV app"""
    print("Testing ChordSync Google TV App...")
    
    # Test 1: Check if the TV app is running
    print("\nTest 1: Checking if the TV app is running...")
    try:
        response = requests.get(TV_APP_URL, timeout=5)
        if response.status_code == 200:
            print("✅ TV app is running")
        else:
            print(f"❌ TV app returned status code {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to connect to TV app: {e}")
        print(f"   Make sure the TV app is running at {TV_APP_URL}")
        return False
    
    # Test 2: Check if the main ChordSync app is running
    print("\nTest 2: Checking if the main ChordSync app is running...")
    try:
        response = requests.get(CHORDSYNC_URL, timeout=5)
        if response.status_code == 200:
            print("✅ Main ChordSync app is running")
        else:
            print(f"❌ Main ChordSync app returned status code {response.status_code}")
            print("   This may cause issues with the TV app")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to connect to main ChordSync app: {e}")
        print(f"   Make sure the main ChordSync app is running at {CHORDSYNC_URL}")
        print("   This may cause issues with the TV app")
    
    # Test 3: Check if the API endpoints are running
    print("\nTest 3: Checking if the API endpoints are running...")
    try:
        response = requests.get(f"{API_URL}/api/chord-data", params={
            'track_id': 'test',
            'track_name': 'Test Track',
            'artist_name': 'Test Artist'
        }, timeout=5)
        
        if response.status_code == 200:
            print("✅ API endpoints are running")
        else:
            print(f"❌ API endpoints returned status code {response.status_code}")
            print("   This is not critical but may limit functionality")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to connect to API endpoints: {e}")
        print(f"   Make sure the API endpoints are running at {API_URL}")
        print("   This is not critical but may limit functionality")
    
    # Test 4: Check TV app API endpoints
    print("\nTest 4: Checking TV app API endpoints...")
    try:
        response = requests.get(f"{TV_APP_URL}/api/current_track")
        
        if response.status_code == 200 or response.status_code == 401:
            # 401 is expected if not authenticated
            print("✅ TV app API endpoints are working")
        else:
            print(f"❌ TV app API endpoints returned status code {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to connect to TV app API endpoints: {e}")
        return False
    
    print("\nAll tests completed!")
    print("\nIf you encountered any issues, check the following:")
    print("1. Make sure all apps are running")
    print("2. Check the .env file for correct configuration")
    print("3. Make sure you have authenticated with Spotify")
    
    return True

if __name__ == "__main__":
    test_tv_app()