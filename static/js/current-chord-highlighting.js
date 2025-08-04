/**
 * Fixed ChordSync Highlighting
 * Only highlights lyrics and ignores chord lines
 */

(function() {
    // Add styles for lyric highlighting only
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Highlight only for lyric lines */
            .highlight-lyric {
                background-color: rgba(29, 185, 84, 0.12);
                position: relative;
                padding: 4px 8px !important;
                margin: 4px 0 !important;
                border-radius: 4px;
                box-shadow: 0 0 10px rgba(29, 185, 84, 0.2);
            }
            
            /* Left side indicator */
            .highlight-lyric::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 4px;
                background-color: #1DB954;
                box-shadow: 0 0 5px rgba(29, 185, 84, 0.5);
                border-radius: 2px;
            }
            
            /* Progress bar container */
            .lyric-progress-container {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 3px;
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .lyric-progress-bar {
                height: 100%;
                width: 0%;
                background-color: #1DB954;
                box-shadow: 0 0 4px rgba(29, 185, 84, 0.6);
                /* Remove transition to avoid chunky updates */
                transition: none;
                will-change: width;
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Keep track of the highlighted lyric line
    let currentHighlightedLyric = null;
    let updateInterval = null;
    
    // Determine if a line is a lyric line (not a chord line)
    function isLyricLine(element) {
        // Chord lines typically contain chord_span elements
        return !element.querySelector('.chord_span');
    }
    
    // Update highlighting based on current time
    function updateHighlighting() {
        // Only process when sync is enabled and we have synced lyrics
        if (!window.dynamic_scroll || window.musixmatch_lyrics_is_linesynced !== 1) {
            clearAllHighlighting();
            return;
        }
        
        const currentTime = window.progress_ms;
        const timestamps = window.clickable_synced_lines_timestamp_array || [];
        
        // Find all lyric timestamp elements
        const allTimestampElements = [];
        const allElements = document.querySelectorAll('[id^="IS_SYNCED_AT:"]');
        
        allElements.forEach(element => {
            // Only include lyric lines
            if (isLyricLine(element)) {
                const timestamp = parseInt(element.id.replace('IS_SYNCED_AT:', ''));
                allTimestampElements.push({ element, timestamp });
            }
        });
        
        // Sort by timestamp
        allTimestampElements.sort((a, b) => a.timestamp - b.timestamp);
        
        // Find the current and next lyric timestamp
        let currentLyricElement = null;
        let nextLyricTimestamp = null;
        
        for (let i = 0; i < allTimestampElements.length; i++) {
            if (allTimestampElements[i].timestamp <= currentTime) {
                currentLyricElement = allTimestampElements[i].element;
                if (i < allTimestampElements.length - 1) {
                    nextLyricTimestamp = allTimestampElements[i + 1].timestamp;
                }
            } else {
                if (!currentLyricElement) {
                    // If we haven't found a current element but this is in the future,
                    // we're at the beginning
                    currentLyricElement = allTimestampElements[0].element;
                    nextLyricTimestamp = allTimestampElements[0].timestamp;
                }
                break;
            }
        }
        
        // If we have a current lyric element, highlight it
        if (currentLyricElement) {
            highlightLyricElement(currentLyricElement);
            
            // Update progress bar if we know the next timestamp
            if (nextLyricTimestamp) {
                const currentTimestamp = parseInt(currentLyricElement.id.replace('IS_SYNCED_AT:', ''));
                updateProgressBar(currentLyricElement, currentTimestamp, nextLyricTimestamp, currentTime);
            }
        } else {
            clearAllHighlighting();
        }
    }
    
    // Apply highlighting to the current lyric element
    function highlightLyricElement(element) {
        // Remove highlight from previous element
        if (currentHighlightedLyric && currentHighlightedLyric !== element) {
            currentHighlightedLyric.classList.remove('highlight-lyric');
            const progressContainer = currentHighlightedLyric.querySelector('.lyric-progress-container');
            if (progressContainer) {
                progressContainer.remove();
            }
        }
        
        // Add highlight to current element
        if (!element.classList.contains('highlight-lyric')) {
            element.classList.add('highlight-lyric');
            
            // Create progress bar if it doesn't exist
            if (!element.querySelector('.lyric-progress-container')) {
                const progressContainer = document.createElement('div');
                progressContainer.className = 'lyric-progress-container';
                
                const progressBar = document.createElement('div');
                progressBar.className = 'lyric-progress-bar';
                
                progressContainer.appendChild(progressBar);
                element.appendChild(progressContainer);
            }
            
            // Scroll element into view
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
        
        // Update reference to current highlighted element
        currentHighlightedLyric = element;
    }
    
    // Update the progress bar for the current lyric
    function updateProgressBar(element, currentLyricTimestamp, nextLyricTimestamp, currentTime) {
        const progressBar = element.querySelector('.lyric-progress-bar');
        if (!progressBar) return;
        
        const duration = nextLyricTimestamp - currentLyricTimestamp;
        const elapsed = currentTime - currentLyricTimestamp;
        
        // Calculate percentage with more precision
        const percentage = Math.min(100, Math.max(0, (elapsed / duration) * 100));
        
        // Directly set width with no transitions for continuous updates
        progressBar.style.width = `${percentage.toFixed(4)}%`;
    }
    
    // Clear all highlighting
    function clearAllHighlighting() {
        if (currentHighlightedLyric) {
            currentHighlightedLyric.classList.remove('highlight-lyric');
            const progressContainer = currentHighlightedLyric.querySelector('.lyric-progress-container');
            if (progressContainer) {
                progressContainer.remove();
            }
            currentHighlightedLyric = null;
        }
    }
    
    // Start the highlighting process
    function startHighlighting() {
        // Add the styles first
        addStyles();
        
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        
        // Simple flag to manage animation frame
        let animationRunning = true;
        
        // Function for animation frame updates
        function animationLoop() {
            if (!animationRunning) return;
            updateHighlighting();
            requestAnimationFrame(animationLoop);
        }
        
        // Start animation frame loop
        animationLoop();
        
        // Stop using setInterval, rely solely on requestAnimationFrame
        // which syncs perfectly with screen refresh rate
        
        // Clean up when page unloads
        window.addEventListener('beforeunload', () => {
            animationRunning = false;
        });
        
        console.log('Continuous progress bar highlighting started');
    }
    
    // Wait for page load
    if (document.readyState === 'complete') {
        startHighlighting();
    } else {
        window.addEventListener('load', startHighlighting);
    }
    
    // Also add a delay to ensure full initialization
    setTimeout(startHighlighting, 1000);
})();