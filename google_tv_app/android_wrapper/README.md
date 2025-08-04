# ChordSync TV Android Wrapper

This is an Android TV app that wraps the ChordSync TV web app in a native app, allowing it to be installed on Google TV and appear as an icon in the launcher.

## Prerequisites

- Android Studio (latest version)
- JDK 8 or higher
- A Google TV device or emulator
- The ChordSync TV web app running on a server accessible from your Google TV

## Setup

1. Open the project in Android Studio.

2. Edit the `MainActivity.java` file to set the correct server URL:
   ```java
   private String serverUrl = "http://SERVER_IP_ADDRESS:5001"; // Replace with your server IP
   ```
   Replace `SERVER_IP_ADDRESS` with the IP address of the computer running the ChordSync TV web app.

3. Create the app icon and banner:
   - Replace `app/src/main/res/drawable/ic_launcher.txt` with an actual icon file named `ic_launcher.png`
   - Replace `app/src/main/res/drawable/app_banner.txt` with an actual banner file named `app_banner.png`

## Building the App

1. In Android Studio, select `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

2. Once the build is complete, you can find the APK file in `app/build/outputs/apk/debug/app-debug.apk`.

## Installing on Google TV

### Method 1: Using ADB (Android Debug Bridge)

1. Enable Developer Mode on your Google TV:
   - Go to Settings > System > About
   - Scroll down to Build and click it 7 times to enable Developer options
   - Go back to System > Developer options
   - Enable USB debugging

2. Connect your computer to the same network as your Google TV.

3. Find your Google TV's IP address:
   - Go to Settings > Network & Internet > Wi-Fi
   - Select your connected network
   - View the IP address

4. Connect to your Google TV using ADB:
   ```
   adb connect YOUR_TV_IP_ADDRESS
   ```

5. Install the app:
   ```
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### Method 2: Using a USB Drive

1. Copy the APK file to a USB drive.

2. Connect the USB drive to your Google TV.

3. Install a file manager app from the Google Play Store (like File Commander).

4. Open the file manager, navigate to the USB drive, and select the APK file to install it.

## Usage

1. Make sure the ChordSync TV web app is running on your server.

2. Launch the ChordSync TV app from the Google TV home screen.

3. The app will connect to the web app and display the current song information and chord sheet.

## Troubleshooting

- **App shows blank screen**: Make sure the server URL is correct and the ChordSync TV web app is running.

- **App crashes**: Check the Android Studio logcat for error messages.

- **Can't install app**: Make sure your Google TV is in Developer Mode and USB debugging is enabled.

## Customization

- **App Name**: Edit `app/src/main/res/values/strings.xml`
- **App Colors**: Edit `app/src/main/res/values/colors.xml`
- **App Icon**: Replace `app/src/main/res/drawable/ic_launcher.png`
- **App Banner**: Replace `app/src/main/res/drawable/app_banner.png`