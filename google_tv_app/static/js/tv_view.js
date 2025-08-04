/**
 * ChordSync TV View
 * 
 * This script handles the view-only interface for Google TV.
 * It fetches the current track data and updates the UI accordingly.
 */

// Configuration
const CONFIG = {
    refreshInterval: 1000, // How often to refresh the playback state (ms)
    trackRefreshInterval: 5000, // How often to check for track changes (ms)
    highlightClass: 'current-line', // Class to add to the current line
    apiEndpoints: {
        currentTrack: '/api/current_track',
        playbackState: '/api/playback_state'
    }
};

// State
let currentState = {
    trackId: null,
    progressMs: 0,
    isPlaying: false,
    syncedLines: [],
    currentLineIndex: -1
};

// DOM Elements
const elements = {
    albumCover: document.getElementById('album-cover'),
    trackName: document.getElementById('track-name'),
    artistName: document.getElementById('artist-name'),
    trackProgress: document.getElementById('track-progress'),
    trackDuration: document.getElementById('track-duration'),
    progressFill: document.getElementById('progress-fill'),
    playStatus: document.getElementById('play-status'),
    shuffleStatus: document.getElementById('shuffle-status'),
    repeatStatus: document.getElementById('repeat-status'),
    chordContent: document.getElementById('chord-content'),
    songKey: document.getElementById('song-key'),
    songCapo: document.getElementById('song-capo'),
    songTuning: document.getElementById('song-tuning'),
    syncValue: document.getElementById('sync-value')
};

/**
 * Initialize the application
 */
function init() {
    // Start the refresh loops
    refreshCurrentTrack();
    setInterval(refreshPlaybackState, CONFIG.refreshInterval);
    setInterval(refreshCurrentTrack, CONFIG.trackRefreshInterval);
    
    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Handle visibility changes (pause updates when tab is not visible)
 */
function handleVisibilityChange() {
    if (document.hidden) {
        // Pause all intervals when tab is not visible
        clearAllIntervals();
    } else {
        // Resume intervals when tab becomes visible again
        init();
    }
}

/**
 * Clear all active intervals
 */
function clearAllIntervals() {
    // Get all interval IDs and clear them
    const highestId = setInterval(() => {}, 0);
    for (let i = 1; i <= highestId; i++) {
        clearInterval(i);
    }
}

/**
 * Format milliseconds to MM:SS format
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted time string
 */
function formatTime(ms) {
    if (!ms) return '0:00';
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Fetch the current track data from the API
 */
async function refreshCurrentTrack() {
    try {
        const response = await fetch(CONFIG.apiEndpoints.currentTrack);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            showLoadingMessage(data.error);
            return;
        }
        
        // Check if track has changed
        if (data.track.id !== currentState.trackId) {
            updateTrackInfo(data);
        }
        
        // Update current state
        currentState.trackId = data.track.id;
        
    } catch (error) {
        console.error('Error fetching current track:', error);
        showLoadingMessage('Error connecting to server. Retrying...');
    }
}

/**
 * Fetch the current playback state from the API
 */
async function refreshPlaybackState() {
    try {
        const response = await fetch(CONFIG.apiEndpoints.playbackState);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            return;
        }
        
        updatePlaybackInfo(data);
        
    } catch (error) {
        console.error('Error fetching playback state:', error);
    }
}

/**
 * Update the track information in the UI
 * @param {Object} data - Track data from the API
 */
function updateTrackInfo(data) {
    // Update track metadata
    elements.trackName.textContent = data.track.name;
    elements.artistName.textContent = data.track.artist;
    elements.trackDuration.textContent = formatTime(data.track.duration_ms);
    
    // Update album cover
    if (data.track.album_cover) {
        elements.albumCover.src = data.track.album_cover;
    } else {
        elements.albumCover.src = '/google_tv_app/static/img/default_album.txt';
    }
    
    // Update chord content
    if (data.chords && data.chords.main_chords_body) {
        elements.chordContent.innerHTML = data.chords.main_chords_body;
        
        // Extract synced lines
        extractSyncedLines();
    } else {
        elements.chordContent.innerHTML = '<p>No chord data available for this song.</p>';
        currentState.syncedLines = [];
    }
    
    // Update additional info
    if (data.chords) {
        elements.songKey.textContent = data.chords.track_key || '-';
        elements.songCapo.textContent = data.chords.guitar_capo || '0';
        elements.songTuning.textContent = data.chords.guitar_tuning || 'Standard';
        
        // Update sync status
        const syncAvailable = data.chords.musixmatch_lyrics_is_linesynced === 1;
        elements.syncValue.textContent = syncAvailable ? 'Available' : 'Not Available';
        elements.syncValue.style.color = syncAvailable ? '#1DB954' : '#ff5555';
    }
}

/**
 * Update the playback information in the UI
 * @param {Object} data - Playback data from the API
 */
function updatePlaybackInfo(data) {
    // Update progress
    elements.trackProgress.textContent = formatTime(data.progress_ms);
    const progressPercent = data.progress_ms / currentState.duration_ms * 100 || 0;
    elements.progressFill.style.width = `${progressPercent}%`;
    
    // Update playback status icons
    elements.playStatus.textContent = data.is_playing ? '⏸️' : '▶️';
    elements.playStatus.classList.toggle('active', true);
    
    elements.shuffleStatus.textContent = '🔀';
    elements.shuffleStatus.classList.toggle('active', data.shuffle_state);
    
    // Update repeat icon based on state
    switch (data.repeat_state) {
        case 'off':
            elements.repeatStatus.textContent = '🔁';
            elements.repeatStatus.classList.remove('active');
            break;
        case 'context':
            elements.repeatStatus.textContent = '🔁';
            elements.repeatStatus.classList.add('active');
            break;
        case 'track':
            elements.repeatStatus.textContent = '🔂';
            elements.repeatStatus.classList.add('active');
            break;
    }
    
    // Update current state
    currentState.progressMs = data.progress_ms;
    currentState.isPlaying = data.is_playing;
    
    // Update current line highlight if we have synced lines
    if (currentState.syncedLines.length > 0) {
        highlightCurrentLine();
    }
}

/**
 * Extract synced lines from the chord content
 */
function extractSyncedLines() {
    // Reset synced lines
    currentState.syncedLines = [];
    
    // Find all elements with IDs starting with "IS_SYNCED_AT:"
    const syncedElements = elements.chordContent.querySelectorAll('[id^="IS_SYNCED_AT:"]');
    
    syncedElements.forEach(element => {
        const match = element.id.match(/^IS_SYNCED_AT:(.+)/);
        if (match) {
            const timestamp = parseInt(match[1]);
            currentState.syncedLines.push({
                element: element,
                timestamp: timestamp
            });
        }
    });
    
    // Sort by timestamp
    currentState.syncedLines.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Highlight the current line based on playback progress
 */
function highlightCurrentLine() {
    // Find the current line based on progress
    let newLineIndex = -1;
    
    for (let i = 0; i < currentState.syncedLines.length; i++) {
        if (currentState.progressMs >= currentState.syncedLines[i].timestamp) {
            newLineIndex = i;
        } else {
            break;
        }
    }
    
    // If the line has changed, update the highlight
    if (newLineIndex !== currentState.currentLineIndex) {
        // Remove highlight from all lines
        currentState.syncedLines.forEach(line => {
            line.element.classList.remove(CONFIG.highlightClass);
        });
        
        // Add highlight to current line
        if (newLineIndex >= 0 && newLineIndex < currentState.syncedLines.length) {
            const currentLine = currentState.syncedLines[newLineIndex];
            currentLine.element.classList.add(CONFIG.highlightClass);
            
            // Scroll to keep the current line visible
            scrollToCurrentLine(currentLine.element);
        }
        
        // Update current line index
        currentState.currentLineIndex = newLineIndex;
    }
}

/**
 * Scroll to keep the current line visible
 * @param {HTMLElement} element - The element to scroll to
 */
function scrollToCurrentLine(element) {
    // Only scroll if the element is not fully visible
    const container = elements.chordContent.parentElement;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    // Check if element is not fully visible
    if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
        // Calculate position to center the element
        const scrollTop = element.offsetTop - (container.clientHeight / 2) + (element.clientHeight / 2);
        
        // Smooth scroll to the position
        container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }
}

/**
 * Show a loading message in the chord content area
 * @param {string} message - The message to display
 */
function showLoadingMessage(message) {
    elements.chordContent.innerHTML = `
        <div class="loading-message">
            <p>${message}</p>
            <div class="loading-spinner"></div>
        </div>
    `;
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);