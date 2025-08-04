// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Debug script loaded');
    
    // Check if socket.io is loaded
    if (typeof io === 'undefined') {
        console.error('Socket.IO not loaded!');
        alert('Socket.IO not loaded! Check your HTML includes the socket.io.js script.');
        return;
    }
    
    // Monitor socket events
    var socket = io.connect();
    
    // Connection events
    socket.on('connect', function() {
        console.log('🟢 Socket connected!', socket.id);
        document.body.classList.add('socket-connected');
        
        // Manually request track data
        console.log('Manually requesting track data...');
        socket.emit('trackDynamicDataRequest');
        socket.emit('trackStaticDataRequest');
    });
    
    socket.on('disconnect', function(reason) {
        console.log('🔴 Socket disconnected!', reason);
        document.body.classList.remove('socket-connected');
    });
    
    socket.on('connect_error', function(error) {
        console.error('🔴 Socket connection error:', error);
        document.body.classList.remove('socket-connected');
    });
    
    // Data events
    socket.on('trackDynamicDataResponse', function(data) {
        console.log('📊 Received dynamic data:', data);
        
        // Check if we're getting valid data
        if (data.track_id === "0") {
            console.warn('No valid track playing');
            
            // Add a visual indicator
            const statusDiv = getOrCreateStatusDiv();
            statusDiv.innerHTML = '<p style="color:orange">⚠️ No track playing in Spotify</p>';
            return;
        }
        
        // Update status
        const statusDiv = getOrCreateStatusDiv();
        statusDiv.innerHTML = `
            <p style="color:green">✅ Playing: ${data.current_time}</p>
            <p>Playing: ${data.play_or_pause}</p>
            <p>Track ID: ${data.track_id}</p>
        `;
        
        // Try to update UI elements
        updateUIElement('#current-time', data.current_time);
    });
    
    socket.on('trackStaticDataResponse', function(data) {
        console.log('📊 Received static data:', data);
        
        // Check if we're getting valid data
        if (data.track_name === "Track" || data.artist_name === "Artist") {
            console.warn('No valid track info');
            
            // Add a visual indicator
            const statusDiv = getOrCreateStatusDiv();
            if (!statusDiv.querySelector('.static-data-status')) {
                const staticStatus = document.createElement('p');
                staticStatus.classList.add('static-data-status');
                staticStatus.style.color = 'orange';
                staticStatus.textContent = '⚠️ No track info available';
                statusDiv.appendChild(staticStatus);
            }
            return;
        }
        
        // Update status
        const statusDiv = getOrCreateStatusDiv();
        if (!statusDiv.querySelector('.static-data-status')) {
            const staticStatus = document.createElement('p');
            staticStatus.classList.add('static-data-status');
            staticStatus.style.color = 'green';
            statusDiv.appendChild(staticStatus);
        }
        
        statusDiv.querySelector('.static-data-status').innerHTML = `
            ✅ Track: ${data.track_name}<br>
            Artist: ${data.artist_name}<br>
            Album Cover: ${data.album_cover_url ? 'Yes' : 'No'}<br>
            Lyrics: ${data.found_musixmatch_lyrics ? 'Yes' : 'No'}<br>
            Synced: ${data.musixmatch_lyrics_is_linesynced ? 'Yes' : 'No'}
        `;
        
        // Try to update UI elements
        updateUIElement('#track-name', data.track_name);
        updateUIElement('#artist-name', data.artist_name);
        
        // Update album cover
        const albumCover = document.querySelector('#album-cover');
        if (albumCover && data.album_cover_url) {
            albumCover.src = data.album_cover_url;
        }
        
        // Update lyrics/chords
        const mainChordsBody = document.querySelector('#main-chords-body');
        if (mainChordsBody && data.main_chords_body) {
            mainChordsBody.innerHTML = data.main_chords_body;
        }
    });
    
    // Set up polling for updates
    setInterval(function() {
        socket.emit('trackDynamicDataRequest');
    }, 1000);
    
    setInterval(function() {
        socket.emit('trackStaticDataRequest');
    }, 5000);
    
    // Helper functions
    function getOrCreateStatusDiv() {
        let statusDiv = document.getElementById('debug-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'debug-status';
            statusDiv.style.position = 'fixed';
            statusDiv.style.bottom = '10px';
            statusDiv.style.right = '10px';
            statusDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
            statusDiv.style.color = 'white';
            statusDiv.style.padding = '10px';
            statusDiv.style.borderRadius = '5px';
            statusDiv.style.zIndex = '9999';
            statusDiv.style.maxWidth = '300px';
            statusDiv.style.fontSize = '12px';
            statusDiv.style.fontFamily = 'monospace';
            
            // Add a toggle button
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Hide Debug';
            toggleButton.style.marginBottom = '5px';
            toggleButton.addEventListener('click', function() {
                const content = statusDiv.querySelector('.debug-content');
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    toggleButton.textContent = 'Hide Debug';
                } else {
                    content.style.display = 'none';
                    toggleButton.textContent = 'Show Debug';
                }
            });
            
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('debug-content');
            
            statusDiv.appendChild(toggleButton);
            statusDiv.appendChild(contentDiv);
            document.body.appendChild(statusDiv);
        }
        return statusDiv.querySelector('.debug-content');
    }
    
    function updateUIElement(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            if (element.tagName === 'INPUT') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    }
    
    // Add a force reload button
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Force Reload UI';
    reloadButton.style.position = 'fixed';
    reloadButton.style.top = '10px';
    reloadButton.style.right = '10px';
    reloadButton.style.zIndex = '9999';
    reloadButton.addEventListener('click', function() {
        socket.emit('trackDynamicDataRequest');
        socket.emit('trackStaticDataRequest');
    });
    document.body.appendChild(reloadButton);
});