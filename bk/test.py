import spotipy
from spotipy.oauth2 import SpotifyOAuth

sp_oauth = SpotifyOAuth(
    client_id="xxx",
    client_secret="xxx",
    redirect_uri="http://localhost:5003/callback",
    scope="user-read-playback-state"
)


# Get the authorization URL
auth_url = sp_oauth.get_authorize_url()
print(f"Please visit this URL: {auth_url}")

# After visiting the URL and authorizing, you'll be redirected
# Copy the URL you were redirected to and enter it here
response_url = input("Enter the URL you were redirected to: ")

# Extract the code from the response URL
code = sp_oauth.parse_response_code(response_url)

# Get the access token
token_info = sp_oauth.get_access_token(code)

# Create a Spotify client
sp = spotipy.Spotify(auth=token_info['access_token'])

# Try a simple API call
try:
    current_user = sp.current_user()
    print(f"Successfully authenticated as: {current_user['display_name']}")
    
    devices = sp.devices()
    print("Available devices:")
    for device in devices['devices']:
        print(f"- {device['name']} ({device['type']})")
    
    current_playback = sp.current_playback()
    if current_playback:
        print(f"Currently playing: {current_playback['item']['name']} by {current_playback['item']['artists'][0]['name']}")
    else:
        print("No active playback found")
        
except Exception as e:
    print(f"Error: {e}")