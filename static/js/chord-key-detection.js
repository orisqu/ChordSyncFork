/**
 * ChordSync Key Detection & Nashville Notation Feature
 * This script detects the key signature of a song based on displayed chords 
 * and adds Nashville number notation beside each chord.
 */

// Initialize key detection when chords are loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for page initialization to complete
    setTimeout(initializeKeyDetection, 1000);
  });
  
  // Main initialization function
  function initializeKeyDetection() {
    // Create a MutationObserver to watch for chord changes
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || 
            (mutation.type === 'attributes' && mutation.attributeName === 'innerHTML')) {
          updateKeyAndNashvilleNotation();
          break;
        }
      }
    });
  
    // Target main chord display element
    const mainChordsDiv = document.getElementById('IDdivMainChords');
    if (mainChordsDiv) {
      observer.observe(mainChordsDiv, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        attributeFilter: ['innerHTML']
      });
      
      // Also run on initialization
      updateKeyAndNashvilleNotation();
    }
  
    // Listen for capo changes and flat/sharp toggle
    document.getElementById('IDcapoMinusButton')?.addEventListener('click', updateKeyAndNashvilleNotation);
    document.getElementById('IDcapoPlusButton')?.addEventListener('click', updateKeyAndNashvilleNotation);
    document.getElementById('IDflatOrSharp')?.addEventListener('click', updateKeyAndNashvilleNotation);
  }
  
  // Main function to analyze chords and update UI
  function updateKeyAndNashvilleNotation() {
    // Extract all chords from the page
    const chordElements = document.getElementsByClassName('chord_span');
    if (!chordElements || chordElements.length === 0) return;
    
    // Get chord texts
    const chords = Array.from(chordElements).map(el => el.innerText.trim());
    
    // Detect the key
    const detectedKey = detectKey(chords);
    console.log(`Detected Key: ${detectedKey}`);
    
    // Update the key display in the UI
    const keyDisplay = document.getElementById('IDtrackKeyValue');
    if (keyDisplay) {
      keyDisplay.textContent = detectedKey;
      
      // Highlight key display with animation
      keyDisplay.style.transition = 'all 0.3s ease';
      keyDisplay.style.color = '#1DB954';
      keyDisplay.style.textShadow = '0 0 10px rgba(29, 185, 84, 0.5)';
      setTimeout(() => {
        keyDisplay.style.textShadow = 'none';
      }, 1000);
    }
    
    // Add Nashville notation to each chord
    for (let i = 0; i < chordElements.length; i++) {
      const chord = chordElements[i].innerText;
      const nashville = getNashvilleNotation(chord, detectedKey);
      
      // Check if Nashville notation is already present to avoid duplicating
      if (nashville && !chordElements[i].innerHTML.includes('nashville-notation')) {
        // Create a new span for the Nashville notation
        const nashvilleSpan = document.createElement('span');
        nashvilleSpan.className = 'nashville-notation';
        nashvilleSpan.textContent = ` (${nashville})`;
        nashvilleSpan.style.color = '#ff9d00'; // Orange color for Nashville notation
        nashvilleSpan.style.fontSize = '0.85em';
        nashvilleSpan.style.fontWeight = 'normal';
        nashvilleSpan.style.opacity = '0.85';
        
        // Preserve the original chord text
        const chordText = document.createTextNode(chord);
        
        // Clear and re-add content
        chordElements[i].innerHTML = '';
        chordElements[i].appendChild(chordText);
        chordElements[i].appendChild(nashvilleSpan);
      }
    }
  }
  
  /**
   * Detects the most likely key of a song based on the chords present
   * Uses music theory and statistical analysis to determine the key
   * 
   * @param {Array} chords - Array of chord strings
   * @return {String} - The detected key (uppercase for major, lowercase for minor)
   */
  function detectKey(chords) {
    if (!chords || chords.length === 0) return 'C';
    
    // Define common chord progressions in each key
    const keyProgressions = {
      // Major keys
      'C': {
        tonic: 'C',
        major: true,
        diatonic: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
        common: ['C', 'F', 'G', 'Am', 'Em', 'Dm'],
        weight: 0
      },
      'G': {
        tonic: 'G',
        major: true,
        diatonic: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
        common: ['G', 'C', 'D', 'Em', 'Bm', 'Am'],
        weight: 0
      },
      'D': {
        tonic: 'D',
        major: true,
        diatonic: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
        common: ['D', 'G', 'A', 'Bm', 'F#m', 'Em'],
        weight: 0
      },
      'A': {
        tonic: 'A',
        major: true,
        diatonic: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
        common: ['A', 'D', 'E', 'F#m', 'C#m', 'Bm'],
        weight: 0
      },
      'E': {
        tonic: 'E',
        major: true,
        diatonic: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
        common: ['E', 'A', 'B', 'C#m', 'G#m', 'F#m'],
        weight: 0
      },
      'F': {
        tonic: 'F',
        major: true,
        diatonic: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
        common: ['F', 'Bb', 'C', 'Dm', 'Am', 'Gm'],
        weight: 0
      },
      'Bb': {
        tonic: 'Bb',
        major: true,
        diatonic: ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'],
        common: ['Bb', 'Eb', 'F', 'Gm', 'Dm', 'Cm'],
        weight: 0
      },
      
      // Minor keys
      'a': {
        tonic: 'Am',
        major: false,
        diatonic: ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G'],
        common: ['Am', 'Dm', 'Em', 'F', 'G', 'C'],
        weight: 0
      },
      'e': {
        tonic: 'Em',
        major: false,
        diatonic: ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D'],
        common: ['Em', 'Am', 'Bm', 'C', 'D', 'G'],
        weight: 0
      },
      'd': {
        tonic: 'Dm',
        major: false,
        diatonic: ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C'],
        common: ['Dm', 'Gm', 'Am', 'Bb', 'C', 'F'],
        weight: 0
      },
      'b': {
        tonic: 'Bm',
        major: false,
        diatonic: ['Bm', 'C#dim', 'D', 'Em', 'F#m', 'G', 'A'],
        common: ['Bm', 'Em', 'F#m', 'G', 'A', 'D'],
        weight: 0
      },
      'f#': {
        tonic: 'F#m',
        major: false,
        diatonic: ['F#m', 'G#dim', 'A', 'Bm', 'C#m', 'D', 'E'],
        common: ['F#m', 'Bm', 'C#m', 'D', 'E', 'A'],
        weight: 0
      },
      'c': {
        tonic: 'Cm',
        major: false,
        diatonic: ['Cm', 'Ddim', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'],
        common: ['Cm', 'Fm', 'Gm', 'Ab', 'Bb', 'Eb'],
        weight: 0
      },
      'g': {
        tonic: 'Gm',
        major: false,
        diatonic: ['Gm', 'Adim', 'Bb', 'Cm', 'Dm', 'Eb', 'F'],
        common: ['Gm', 'Cm', 'Dm', 'Eb', 'F', 'Bb'],
        weight: 0
      }
    };
    
    // Expand chords to include common variations (e.g., "C7" is a form of "C")
    const normalizedChords = expandChordVariations(chords);
    
    // Count occurrences of chord types
    let majorCount = 0;
    let minorCount = 0;
    
    normalizedChords.forEach(chord => {
      if (isMinorChord(chord)) {
        minorCount++;
      } else if (isMajorChord(chord)) {
        majorCount++;
      }
    });
    
    // Calculate weights for each potential key
    Object.keys(keyProgressions).forEach(key => {
      const keyInfo = keyProgressions[key];
      let weight = 0;
      
      // Check presence of diatonic chords
      normalizedChords.forEach(chord => {
        const baseChord = getBaseChord(chord);
        
        // Match exact chords
        if (keyInfo.diatonic.includes(baseChord)) {
          weight += 1;
          
          // Extra weight for common chords
          if (keyInfo.common.includes(baseChord)) {
            weight += 0.5;
          }
        }
        
        // Extra weight for tonic chord
        if (baseChord === keyInfo.tonic) {
          weight += 2;
        }
        
        // Extra weight for dominant chord (V in major, v in minor)
        const dominantChord = keyInfo.diatonic[4]; // 5th degree
        if (baseChord === dominantChord) {
          weight += 1.5;
        }
        
        // Extra weight for subdominant chord (IV in major, iv in minor)
        const subdominantChord = keyInfo.diatonic[3]; // 4th degree
        if (baseChord === subdominantChord) {
          weight += 1;
        }
      });
      
      // Chord progression analysis
      // Look for common cadence patterns (e.g., ii-V-I, IV-V-I)
      for (let i = 0; i < normalizedChords.length - 2; i++) {
        const threeChords = normalizedChords.slice(i, i + 3).map(getBaseChord);
        
        // Check for ii-V-I cadence
        if (threeChords[0] === keyInfo.diatonic[1] && // ii chord
            threeChords[1] === keyInfo.diatonic[4] && // V chord
            threeChords[2] === keyInfo.diatonic[0]) { // I chord
          weight += 3;
        }
        
        // Check for IV-V-I cadence
        if (threeChords[0] === keyInfo.diatonic[3] && // IV chord
            threeChords[1] === keyInfo.diatonic[4] && // V chord
            threeChords[2] === keyInfo.diatonic[0]) { // I chord
          weight += 3;
        }
      }
      
      // Adjust weight based on major/minor count statistics
      if (keyInfo.major && majorCount > minorCount) {
        weight += 1;
      } else if (!keyInfo.major && minorCount > majorCount) {
        weight += 1;
      }
      
      // Store the calculated weight
      keyProgressions[key].weight = weight;
    });
    
    // Find the key with the highest weight
    let bestKey = 'C';
    let bestWeight = 0;
    
    Object.keys(keyProgressions).forEach(key => {
      if (keyProgressions[key].weight > bestWeight) {
        bestKey = key;
        bestWeight = keyProgressions[key].weight;
      }
    });
    
    return bestKey;
  }
  
  /**
   * Expands chords to include common variations
   * For example, "C7" is expanded to include "C"
   * 
   * @param {Array} chords - Array of chord strings
   * @return {Array} - Expanded chord array
   */
  function expandChordVariations(chords) {
    const expanded = [];
    
    chords.forEach(chord => {
      // Add the original chord
      expanded.push(chord);
      
      // Add the base chord for common variations
      const baseChord = getBaseChord(chord);
      if (baseChord !== chord) {
        expanded.push(baseChord);
      }
    });
    
    return expanded;
  }
  
  /**
   * Gets the base chord from a chord with extensions
   * For example, "C7" -> "C", "Dm7" -> "Dm"
   * 
   * @param {String} chord - Chord string
   * @return {String} - Base chord
   */
  function getBaseChord(chord) {
    // Common chord extensions to simplify
    const extensions = ['7', 'maj7', 'min7', 'm7', 'dim7', 'aug', 'sus2', 'sus4', '9', 'add9'];
    
    let baseChord = chord;
    
    // Handle slash chords first (e.g., "C/G" -> "C")
    if (chord.includes('/')) {
      baseChord = chord.split('/')[0];
    }
    
    // Remove extensions
    for (const ext of extensions) {
      if (baseChord.endsWith(ext)) {
        if (baseChord.endsWith('m' + ext)) {
          // For minor chords with extensions (e.g., "Dm7" -> "Dm")
          baseChord = baseChord.slice(0, baseChord.length - ext.length + 1);
        } else {
          // For major chords with extensions (e.g., "C7" -> "C")
          baseChord = baseChord.slice(0, baseChord.length - ext.length);
        }
        break;
      }
    }
    
    return baseChord;
  }
  
  /**
   * Determines if a chord is a minor chord
   * 
   * @param {String} chord - Chord string
   * @return {Boolean} - True if minor chord
   */
  function isMinorChord(chord) {
    const baseChord = getBaseChord(chord);
    return baseChord.includes('m') && !baseChord.includes('maj') && !baseChord.includes('dim');
  }
  
  /**
   * Determines if a chord is a major chord
   * 
   * @param {String} chord - Chord string
   * @return {Boolean} - True if major chord
   */
  function isMajorChord(chord) {
    const baseChord = getBaseChord(chord);
    return !baseChord.includes('m') && 
           !baseChord.includes('dim') && 
           !baseChord.includes('aug') && 
           !baseChord.includes('sus');
  }
  
  /**
   * Gets Nashville number notation for a chord in a specific key
   * 
   * @param {String} chord - Chord string
   * @param {String} key - Key string (uppercase for major, lowercase for minor)
   * @return {String} - Nashville notation (e.g., "I", "iv", etc.)
   */
  function getNashvilleNotation(chord, key) {
    // Define the scale degrees for each key
    const scaleDegreesMap = {
      // Major keys
      'C': { 'C': 'I', 'D': 'II', 'E': 'III', 'F': 'IV', 'G': 'V', 'A': 'VI', 'B': 'VII' },
      'G': { 'G': 'I', 'A': 'II', 'B': 'III', 'C': 'IV', 'D': 'V', 'E': 'VI', 'F#': 'VII' },
      'D': { 'D': 'I', 'E': 'II', 'F#': 'III', 'G': 'IV', 'A': 'V', 'B': 'VI', 'C#': 'VII' },
      'A': { 'A': 'I', 'B': 'II', 'C#': 'III', 'D': 'IV', 'E': 'V', 'F#': 'VI', 'G#': 'VII' },
      'E': { 'E': 'I', 'F#': 'II', 'G#': 'III', 'A': 'IV', 'B': 'V', 'C#': 'VI', 'D#': 'VII' },
      'F': { 'F': 'I', 'G': 'II', 'A': 'III', 'Bb': 'IV', 'C': 'V', 'D': 'VI', 'E': 'VII' },
      'Bb': { 'Bb': 'I', 'C': 'II', 'D': 'III', 'Eb': 'IV', 'F': 'V', 'G': 'VI', 'A': 'VII' },
  
      // Minor keys
      'a': { 'A': 'i', 'B': 'ii', 'C': 'III', 'D': 'iv', 'E': 'v', 'F': 'VI', 'G': 'VII' },
      'e': { 'E': 'i', 'F#': 'ii', 'G': 'III', 'A': 'iv', 'B': 'v', 'C': 'VI', 'D': 'VII' },
      'd': { 'D': 'i', 'E': 'ii', 'F': 'III', 'G': 'iv', 'A': 'v', 'Bb': 'VI', 'C': 'VII' },
      'b': { 'B': 'i', 'C#': 'ii', 'D': 'III', 'E': 'iv', 'F#': 'v', 'G': 'VI', 'A': 'VII' },
      'f#': { 'F#': 'i', 'G#': 'ii', 'A': 'III', 'B': 'iv', 'C#': 'v', 'D': 'VI', 'E': 'VII' },
      'c': { 'C': 'i', 'D': 'ii', 'Eb': 'III', 'F': 'iv', 'G': 'v', 'Ab': 'VI', 'Bb': 'VII' },
      'g': { 'G': 'i', 'A': 'ii', 'Bb': 'III', 'C': 'iv', 'D': 'v', 'Eb': 'VI', 'F': 'VII' }
    };
    
    // Flat and sharp equivalents for enharmonic note handling
    const enharmonicEquivalents = {
      'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
      'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };
    
    // Get scale degrees for the specified key
    const scaleDegrees = scaleDegreesMap[key];
    if (!scaleDegrees) return '';
    
    // Extract the root note of the chord
    const rootNote = extractRootNote(chord);
    if (!rootNote) return '';
    
    // Determine if the chord is minor
    const isMinor = isMinorChord(chord);
    
    // Find the degree in the scale
    let degree = scaleDegrees[rootNote];
    
    // If not found directly, check for enharmonic equivalents
    if (!degree && enharmonicEquivalents[rootNote]) {
      degree = scaleDegrees[enharmonicEquivalents[rootNote]];
    }
    
    if (!degree) return '';
    
    // Adjust the case for major/minor chords based on the key
    if (key === key.toLowerCase()) {
      // In minor keys
      if (isMinor && !['III', 'VI', 'VII'].includes(degree)) {
        // Keep lowercase for minor chords
        degree = degree.toLowerCase();
      } else if (!isMinor && ['i', 'ii', 'iv', 'v'].includes(degree)) {
        // Make uppercase for major chords where diatonic would be minor
        degree = degree.toUpperCase();
      }
    } else {
      // In major keys
      if (isMinor && !['ii', 'iii', 'vi'].includes(degree)) {
        // Make lowercase for minor chords where diatonic would be major
        degree = degree.toLowerCase();
      }
    }
    
    return degree;
  }
  
  /**
   * Extracts the root note from a chord
   * 
   * @param {String} chord - Chord string
   * @return {String} - Root note
   */
  function extractRootNote(chord) {
    // Remove slash chord bass note if present
    if (chord.includes('/')) {
      chord = chord.split('/')[0];
    }
    
    // Match patterns for standard root notes
    const rootMatch = chord.match(/^([A-G][b#]?)/);
    if (rootMatch) {
      return rootMatch[1];
    }
    
    return null;
  }
  
  // Add CSS for Nashville notation
  function addNashvilleStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .nashville-notation {
        color: #ff9d00;
        font-size: 0.85em;
        font-weight: normal;
        opacity: 0.85;
        margin-left: 2px;
      }
      
      #IDtrackKeyValue {
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add styles on initial load
  addNashvilleStyles();
  
  // Initialize the feature
  initializeKeyDetection();