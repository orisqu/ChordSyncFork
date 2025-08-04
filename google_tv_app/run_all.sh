#!/bin/bash
# Run both ChordSync and ChordSync TV apps together

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if the .env file exists
if [ ! -f .env ]; then
    echo "No .env file found in the google_tv_app directory."
    echo "Please create a .env file with your credentials or run ./start.sh first."
    exit 1
fi

# Function to kill background processes on exit
cleanup() {
    echo "Stopping all processes..."
    kill $CHORDSYNC_PID $API_PID $TV_PID 2>/dev/null
    exit 0
}

# Set up trap to call cleanup function on exit
trap cleanup EXIT INT TERM

# Get the local IP address
IP_ADDRESS=$(hostname -I | awk '{print $1}')

echo "Starting ChordSync ecosystem..."

# Start the main ChordSync app
echo "Starting main ChordSync app..."
cd ..
python3 app.py &
CHORDSYNC_PID=$!
cd google_tv_app

# Wait for the main app to start
echo "Waiting for main ChordSync app to start..."
sleep 5

# Start the API endpoints
echo "Starting API endpoints..."
python3 add_api_endpoints.py &
API_PID=$!

# Wait for the API to start
echo "Waiting for API endpoints to start..."
sleep 2

# Start the Google TV app
echo "Starting Google TV app..."
python3 app.py &
TV_PID=$!

echo ""
echo "All services started!"
echo ""
echo "Main ChordSync app: http://localhost:5000"
echo "ChordSync TV app: http://localhost:5001"
echo "ChordSync API: http://localhost:5002"
echo ""
echo "To access from your Google TV, open Chrome and navigate to:"
echo "http://$IP_ADDRESS:5001"
echo ""
echo "Press Ctrl+C to stop all services."

# Wait for any process to exit
wait $CHORDSYNC_PID $API_PID $TV_PID