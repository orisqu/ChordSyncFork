 #!/bin/bash
# Build and install the ChordSync TV Android app

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo "Error: Android SDK not found. Please set the ANDROID_HOME environment variable."
    echo "Example: export ANDROID_HOME=~/Android/Sdk"
    exit 1
fi

# Check if ADB is available
if ! command -v adb &> /dev/null; then
    echo "Error: ADB not found. Please make sure Android SDK platform-tools are installed and in your PATH."
    exit 1
fi

# Function to get user input with default value
get_input() {
    local prompt="$1"
    local default="$2"
    local input
    
    echo -n "$prompt [$default]: "
    read input
    echo "${input:-$default}"
}

# Function to update server URL in MainActivity.java
update_server_url() {
    local server_ip="$1"
    local server_port="$2"
    local file="app/src/main/java/com/chordsync/tv/MainActivity.java"
    
    # Create backup
    cp "$file" "${file}.bak"
    
    # Replace server URL
    sed -i "s|private String serverUrl = \"http://SERVER_IP_ADDRESS:5001\"|private String serverUrl = \"http://${server_ip}:${server_port}\"|g" "$file"
    
    echo "Updated server URL to http://${server_ip}:${server_port} in $file"
}

# Main script
echo "ChordSync TV Android App Builder"
echo "================================"
echo

# Get server IP and port
SERVER_IP=$(get_input "Enter the IP address of your ChordSync TV server" "192.168.1.100")
SERVER_PORT=$(get_input "Enter the port of your ChordSync TV server" "5001")

# Update server URL in MainActivity.java
update_server_url "$SERVER_IP" "$SERVER_PORT"

# Build the app
echo
echo "Building the app..."
./gradlew assembleDebug

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Error: Build failed. Please check the error messages above."
    exit 1
fi

echo
echo "Build successful!"
echo "APK file created at: app/build/outputs/apk/debug/app-debug.apk"
echo

# Ask if user wants to install the app
INSTALL=$(get_input "Do you want to install the app on your Google TV? (yes/no)" "yes")

if [ "$INSTALL" != "yes" ]; then
    echo "Skipping installation. You can manually install the APK file later."
    exit 0
fi

# Get Google TV IP address
TV_IP=$(get_input "Enter the IP address of your Google TV" "192.168.1.101")

# Connect to Google TV
echo
echo "Connecting to Google TV at $TV_IP..."
adb connect "$TV_IP"

if [ $? -ne 0 ]; then
    echo "Error: Failed to connect to Google TV. Please make sure:"
    echo "1. Your Google TV is on the same network as your computer"
    echo "2. Developer mode is enabled on your Google TV"
    echo "3. USB debugging is enabled on your Google TV"
    exit 1
fi

# Install the app
echo
echo "Installing the app on your Google TV..."
adb install -r app/build/outputs/apk/debug/app-debug.apk

if [ $? -ne 0 ]; then
    echo "Error: Failed to install the app. Please check the error messages above."
    exit 1
fi

echo
echo "Installation successful!"
echo "You can now launch the ChordSync TV app from your Google TV home screen."
echo
echo "Note: Make sure the ChordSync TV web app is running at http://${SERVER_IP}:${SERVER_PORT}"
echo "      before launching the app on your Google TV."