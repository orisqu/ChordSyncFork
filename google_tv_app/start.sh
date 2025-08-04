#!/bin/bash
# Start script for ChordSync Google TV App

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if the .env file exists
if [ ! -f .env ]; then
    echo "No .env file found. Creating from example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Created .env file from .env.example. Please edit it with your credentials."
        echo "Then run this script again."
        exit 1
    else
        echo "No .env.example file found. Please create a .env file with your credentials."
        exit 1
    fi
fi

# Check if requirements are installed
echo "Checking requirements..."
python3 -m pip install -r requirements.txt

# Get the local IP address
IP_ADDRESS=$(hostname -I | awk '{print $1}')

echo "Starting ChordSync Google TV App..."
echo "The app will be available at:"
echo "  - Local: http://localhost:5001"
echo "  - Network: http://$IP_ADDRESS:5001"
echo ""
echo "To access from your Google TV, open Chrome and navigate to:"
echo "http://$IP_ADDRESS:5001"
echo ""
echo "Press Ctrl+C to stop the app."

# Start the app
python3 app.py