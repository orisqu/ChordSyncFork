# ChordSync Google TV App

A view-only interface for Google TV that displays chord sheets synchronized with your Spotify playback.

## Overview

This application is an extension of the main ChordSync app, designed specifically for Google TV. It provides a view-only interface that displays the current song information, chords, and lyrics from the main ChordSync app.

Key features:
- View-only interface optimized for TV screens
- Spotify authentication using Device Code Flow
- Real-time display of current song information
- Synchronized chord and lyric display
- Automatic highlighting of the current line

## Requirements

- Python 3.8 or higher
- Spotify Premium account
- Main ChordSync app running and accessible

## Installation

1. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the `google_tv_app` directory with the following variables:
   ```
   FLASK_SECRET_KEY=your_secret_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:5001/callback
   CHORDSYNC_URL=http://localhost:5000
   ```

   Note: You can use the same Spotify credentials as your main ChordSync app.

3. For convenience, you can copy the `.env.example` file and edit it:
   ```
   cp .env.example .env
   nano .env  # or use any text editor
   ```

## Usage

1. Make sure the main ChordSync app is running.

2. (Optional) Add API endpoints to the main ChordSync app:
   ```
   python add_api_endpoints.py
   ```
   This script adds additional API endpoints to support the Google TV app without modifying the original ChordSync files.

3. You can start the Google TV app in several ways:

   a. Start only the TV app (requires main ChordSync to be running separately):
   ```
   ./start.sh
   ```

   b. Start everything (main ChordSync app, API endpoints, and TV app) with one command:
   ```
   ./run_all.sh
   ```

   c. Start manually:
   ```
   cd google_tv_app
   python app.py
   ```

4. The app will be available at:
   - Local: `http://localhost:5001`
   - On your network: `http://<your-ip-address>:5001`

5. On your Google TV, open the Chrome browser and navigate to the IP address of the computer running the app, e.g., `http://192.168.1.100:5001`.

6. Follow the authentication instructions on the screen:
   - A code will be displayed on the TV
   - On your phone or computer, go to the URL shown on the TV
   - Enter the code to authenticate with Spotify

7. Once authenticated, the app will display the current song information and chord sheet.

## Testing

You can verify that everything is working correctly by running the test script:

```
./test_app.py
```

This script will:
- Check if the TV app is running
- Check if the main ChordSync app is running
- Check if the API endpoints are running
- Test the TV app API endpoints

If any issues are found, the script will provide guidance on how to fix them.

## How It Works

The Google TV app communicates with the main ChordSync app to get the current song information and chord data. It also communicates directly with Spotify to get the current playback state.

The app uses a view-only interface, meaning all playback control happens through your normal Spotify app. The TV app simply displays the current song information and chord sheet in a format optimized for viewing on a TV screen.

## Troubleshooting

- **Authentication Issues**: If you have trouble authenticating, make sure your Spotify credentials are correct and that you have a Spotify Premium account.

- **Connection Issues**: If the app can't connect to the main ChordSync app, make sure it's running and accessible at the URL specified in the `.env` file.

- **Display Issues**: The app is optimized for TV screens, but you may need to adjust your TV's display settings for optimal viewing.

## License

This project is licensed under the same terms as the main ChordSync app.