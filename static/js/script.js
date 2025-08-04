//////// CAPO ////////
var capo_minus_button = document.getElementById("IDcapoMinusButton");
var capo_plus_button = document.getElementById("IDcapoPlusButton");
var current_capo_value;
var current_capo_value_int;

// Capo minus -> transpose chords +1
capo_minus_button.addEventListener("click", () => {
    if (spotify_error == 1) {
        // Make button unclickable if Spotify is not available
        return;
    }
    current_capo_value = document.getElementById("IDguitarCapo");
    current_capo_value_int = parseInt(current_capo_value.innerHTML);
    if (current_capo_value_int > -12) {
        current_capo_value_int -= 1;
        current_capo_value.innerHTML = current_capo_value_int;
        capo_minus_button.style.opacity = "1";
        capo_plus_button.style.opacity = "1";
        
        // Apply chord transpose (minus 1 capo) for main_chords_body
        var parser = new DOMParser();
        var parsed_body = parser.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
        var all_chords = parsed_body.getElementsByClassName("chord_span");
        for (let i = 0; i < all_chords.length; i++) {
            all_chords[i].innerHTML = sharOrFlatTranposer(transposeChord(all_chords[i].innerHTML.toString(), 1), current_flat_or_sharp);
        }
        document.getElementById('IDdivMainChords').innerHTML = parsed_body.body.innerHTML;
        main_chords_body = parsed_body.body.innerHTML;
    }

    if (current_capo_value_int == -12) {
        capo_minus_button.style.opacity = "0.5";
        capo_plus_button.style.opacity = "1";
    } 
    if (initial_capo_value == current_capo_value_int) {
        current_capo_value.style.fontWeight = "bold";
        current_capo_value.style.color = "#1DB954";
    } else {
        current_capo_value.style.fontWeight = "normal";
        current_capo_value.style.color = "#1DB954";
    }

    // Check current_flat_or_sharp after capo change
    var parser3 = new DOMParser();
    var parsed_body_3 = parser3.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
    var all_chords_3 = parsed_body_3.getElementsByClassName("chord_span");
    amount_of_flats = 0;
    amount_of_sharps = 0;
    for (let i = 0; i < all_chords_3.length; i++) {
        amount_of_flats += (all_chords_3[i].innerHTML.match(/b/g) || []).length;
    }
    for (let i = 0; i < all_chords_3.length; i++) {
        amount_of_sharps += (all_chords_3[i].innerHTML.match(/#/g) || []).length;
    }
    if (amount_of_sharps > amount_of_flats) {
        document.getElementById("IDsharpSymbol").style.fontWeight = "bold";
        document.getElementById("IDsharpSymbol").style.color = "#1DB954";
        document.getElementById("IDsharpSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        current_flat_or_sharp = "#";
    }
    if (amount_of_flats > amount_of_sharps) {
        document.getElementById("IDflatSymbol").style.fontWeight = "bold";
        document.getElementById("IDflatSymbol").style.color = "#1DB954";
        document.getElementById("IDflatSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        current_flat_or_sharp = "b";
    }
    if (amount_of_sharps == amount_of_flats) {
        document.getElementById("IDsharpSymbol").style.fontWeight = "normal";
        document.getElementById("IDsharpSymbol").style.color = "white";
        document.getElementById("IDsharpSymbol").style.filter = "";
        document.getElementById("IDflatSymbol").style.fontWeight = "normal";
        document.getElementById("IDflatSymbol").style.color = "white";
        document.getElementById("IDflatSymbol").style.filter = "";
        // Do not reasign current_flat_or_sharp to persist the previous value when changing capo afterwards again
    }
    localStorage.setItem("key_local_storage_previous_capo_value", current_capo_value_int);

    lines_hover_and_clickable();
});

function capoMinusFunc() {
    if (spotify_error == 1) {
        // Make button unclickable if Spotify is not available
        return;
    }
    current_capo_value = document.getElementById("IDguitarCapo");
    current_capo_value_int = parseInt(current_capo_value.innerHTML);
    if (current_capo_value_int > -12) {
        current_capo_value_int -= 1;
        current_capo_value.innerHTML = current_capo_value_int;
        capo_minus_button.style.opacity = "1";
        capo_plus_button.style.opacity = "1";
        
        // Apply chord transpose (minus 1 capo) for main_chords_body
        var parser = new DOMParser();
        var parsed_body = parser.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
        var all_chords = parsed_body.getElementsByClassName("chord_span");
        for (let i = 0; i < all_chords.length; i++) {
            all_chords[i].innerHTML = sharOrFlatTranposer(transposeChord(all_chords[i].innerHTML.toString(), 1), current_flat_or_sharp);
        }
        document.getElementById('IDdivMainChords').innerHTML = parsed_body.body.innerHTML;
        main_chords_body = parsed_body.body.innerHTML;
    }

    if (current_capo_value_int == -12) {
        capo_minus_button.style.opacity = "0.5";
        capo_plus_button.style.opacity = "1";
    } 
    if (initial_capo_value == current_capo_value_int) {
        current_capo_value.style.fontWeight = "bold";
        current_capo_value.style.color = "#1DB954";
    } else {
        current_capo_value.style.fontWeight = "normal";
        current_capo_value.style.color = "#1DB954";
    }

    // Check current_flat_or_sharp after capo change
    var parser3 = new DOMParser();
    var parsed_body_3 = parser3.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
    var all_chords_3 = parsed_body_3.getElementsByClassName("chord_span");
    amount_of_flats = 0;
    amount_of_sharps = 0;
    for (let i = 0; i < all_chords_3.length; i++) {
        amount_of_flats += (all_chords_3[i].innerHTML.match(/b/g) || []).length;
    }
    for (let i = 0; i < all_chords_3.length; i++) {
        amount_of_sharps += (all_chords_3[i].innerHTML.match(/#/g) || []).length;
    }
    if (amount_of_sharps > amount_of_flats) {
        document.getElementById("IDsharpSymbol").style.fontWeight = "bold";
        document.getElementById("IDsharpSymbol").style.color = "#1DB954";
        document.getElementById("IDsharpSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        current_flat_or_sharp = "#";
    }
    if (amount_of_flats > amount_of_sharps) {
        document.getElementById("IDflatSymbol").style.fontWeight = "bold";
        document.getElementById("IDflatSymbol").style.color = "#1DB954";
        document.getElementById("IDflatSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        current_flat_or_sharp = "b";
    }
    if (amount_of_sharps == amount_of_flats) {
        document.getElementById("IDsharpSymbol").style.fontWeight = "normal";
        document.getElementById("IDsharpSymbol").style.color = "white";
        document.getElementById("IDsharpSymbol").style.filter = "";
        document.getElementById("IDflatSymbol").style.fontWeight = "normal";
        document.getElementById("IDflatSymbol").style.color = "white";
        document.getElementById("IDflatSymbol").style.filter = "";
        // Do not reasign current_flat_or_sharp to persist the previous value when changing capo afterwards again
    }
    localStorage.setItem("key_local_storage_previous_capo_value", current_capo_value_int);

    lines_hover_and_clickable();
}

// Capo plus -> transpose chords -1
capo_plus_button.addEventListener("click", () => {
    if (spotify_error == 1) {
        // Make button unclickable if Spotify is not available
        return;
    }
    current_capo_value = document.getElementById("IDguitarCapo");
    current_capo_value_int = parseInt(current_capo_value.innerHTML);
    if (current_capo_value_int < 12) {
        current_capo_value_int += 1;
        current_capo_value.innerHTML = current_capo_value_int;
        capo_plus_button.style.opacity = "1";
        capo_minus_button.style.opacity = "1";

        // Apply chord transpose (plus 1 capo) for main_chords_body
        var parser = new DOMParser();
        var parsed_body = parser.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
        var all_chords = parsed_body.getElementsByClassName("chord_span");
        for (let i = 0; i < all_chords.length; i++) {
            all_chords[i].innerHTML = sharOrFlatTranposer(transposeChord(all_chords[i].innerHTML.toString(), -1), current_flat_or_sharp);
        }
        document.getElementById('IDdivMainChords').innerHTML = parsed_body.body.innerHTML;
        main_chords_body = parsed_body.body.innerHTML;
    }

    if (current_capo_value_int == 12) {
        capo_plus_button.style.opacity = "0.5";
        capo_minus_button.style.opacity = "1";
    }
    if (initial_capo_value == current_capo_value_int) {
        current_capo_value.style.fontWeight = "bold";
        current_capo_value.style.color = "#1DB954";
    } else {
        current_capo_value.style.fontWeight = "normal";
        current_capo_value.style.color = "#1DB954";
    }

    // Check current_flat_or_sharp after capo change
    var parser3 = new DOMParser();
    var parsed_body_3 = parser3.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
    var all_chords_3 = parsed_body_3.getElementsByClassName("chord_span");
    amount_of_flats = 0;
    amount_of_sharps = 0;
    for (let i = 0; i < all_chords_3.length; i++) {
        amount_of_flats += (all_chords_3[i].innerHTML.match(/b/g) || []).length;
    }
    for (let i = 0; i < all_chords_3.length; i++) {
        amount_of_sharps += (all_chords_3[i].innerHTML.match(/#/g) || []).length;
    }
    if (amount_of_sharps > amount_of_flats) {
        document.getElementById("IDsharpSymbol").style.fontWeight = "bold";
        document.getElementById("IDsharpSymbol").style.color = "#1DB954";
        document.getElementById("IDsharpSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        current_flat_or_sharp = "#";
    }
    if (amount_of_flats > amount_of_sharps) {
        document.getElementById("IDflatSymbol").style.fontWeight = "bold";
        document.getElementById("IDflatSymbol").style.color = "#1DB954";
        document.getElementById("IDflatSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        current_flat_or_sharp = "b";
    }
    if (amount_of_sharps == amount_of_flats) {
        document.getElementById("IDsharpSymbol").style.fontWeight = "normal";
        document.getElementById("IDsharpSymbol").style.color = "white";
        document.getElementById("IDsharpSymbol").style.filter = "";
        document.getElementById("IDflatSymbol").style.fontWeight = "normal";
        document.getElementById("IDflatSymbol").style.color = "white";
        document.getElementById("IDflatSymbol").style.filter = "";
        // Do not reasign current_flat_or_sharp to persist the previous value when changing capo afterwards again
    }
    localStorage.setItem("key_local_storage_previous_capo_value", current_capo_value_int);

    lines_hover_and_clickable();
});

function capoPlusFunc() {
    if (spotify_error == 1) {
        // Make button unclickable if Spotify is not available
        return;
    }
    current_capo_value = document.getElementById("IDguitarCapo");
    current_capo_value_int = parseInt(current_capo_value.innerHTML);
    if (current_capo_value_int < 12) {
        current_capo_value_int += 1;
        current_capo_value.innerHTML = current_capo_value_int;
        capo_plus_button.style.opacity = "1";
        capo_minus_button.style.opacity = "1";

        // Apply chord transpose (plus 1 capo) for main_chords_body
        var parser = new DOMParser();
        var parsed_body = parser.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
        var all_chords = parsed_body.getElementsByClassName("chord_span");
        for (let i = 0; i < all_chords.length; i++) {
            all_chords[i].innerHTML = sharOrFlatTranposer(transposeChord(all_chords[i].innerHTML.toString(), -1), current_flat_or_sharp);
        }
        document.getElementById('IDdivMainChords').innerHTML = parsed_body.body.innerHTML;
        main_chords_body = parsed_body.body.innerHTML;
    }

    if (current_capo_value_int == 12) {
        capo_plus_button.style.opacity = "0.5";
        capo_minus_button.style.opacity = "1";
    }
    if (initial_capo_value == current_capo_value_int) {
        current_capo_value.style.fontWeight = "bold";
        current_capo_value.style.color = "#1DB954";
    } else {
        current_capo_value.style.fontWeight = "normal";
        current_capo_value.style.color = "#1DB954";
    }

    // Check current_flat_or_sharp after capo change
    var parser3 = new DOMParser();
    var parsed_body_3 = parser3.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
    var all_chords_3 = parsed_body_3.getElementsByClassName("chord_span");
    amount_of_flats = 0;
    amount_of_sharps = 0;
    for (let i = 0; i < all_chords_3.length; i++) {
        amount_of_flats += (all_chords_3[i].innerHTML.match(/b/g) || []).length;
    }
    for (let i = 0; i < all_chords_3.length; i++) {
        amount_of_sharps += (all_chords_3[i].innerHTML.match(/#/g) || []).length;
    }
    if (amount_of_sharps > amount_of_flats) {
        document.getElementById("IDsharpSymbol").style.fontWeight = "bold";
        document.getElementById("IDsharpSymbol").style.color = "#1DB954";
        document.getElementById("IDsharpSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        current_flat_or_sharp = "#";
    }
    if (amount_of_flats > amount_of_sharps) {
        document.getElementById("IDflatSymbol").style.fontWeight = "bold";
        document.getElementById("IDflatSymbol").style.color = "#1DB954";
        document.getElementById("IDflatSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        current_flat_or_sharp = "b";
    }
    if (amount_of_sharps == amount_of_flats) {
        document.getElementById("IDsharpSymbol").style.fontWeight = "normal";
        document.getElementById("IDsharpSymbol").style.color = "white";
        document.getElementById("IDsharpSymbol").style.filter = "";
        document.getElementById("IDflatSymbol").style.fontWeight = "normal";
        document.getElementById("IDflatSymbol").style.color = "white";
        document.getElementById("IDflatSymbol").style.filter = "";
        // Do not reasign current_flat_or_sharp to persist the previous value when changing capo afterwards again
    }

    localStorage.setItem("key_local_storage_previous_capo_value", current_capo_value_int);

    lines_hover_and_clickable();
}


//////// CHORD TRANPOSE FUNCTIONALITY ////////
var note_step_sharp_array = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
var note_step_flat_array =  ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];

function sharOrFlatTranposer(any_chord, sharp_or_flat) {
    if (sharp_or_flat == "#") return any_chord
    if (sharp_or_flat == "0") return any_chord
    
    var chord = any_chord;
    const sharp_notes = ["C#", "D#", "F#", "G#", "A#"];
    const flat_notes = ["Db", "Eb", "Gb", "Ab", "Bb"];
    
    for (let i = 0; i < sharp_notes.length; i++) {
        if (chord.includes(sharp_notes[i])) {
            chord = chord.replace(sharp_notes[i], flat_notes[i]);
        }
    }
    return chord;
}

function transposeChord(chord, n) {
    // Similar to "hammar"s Haskell approach
    // https://codegolf.stackexchange.com/questions/3847/create-a-function-for-transposing-musical-chords
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sharp_notes = ["C#", "D#", "F#", "G#", "A#"];
    const flat_notes = ["Db", "Eb", "Gb", "Ab", "Bb"];

    for (let i = 0; i < flat_notes.length; i++) {
        if (chord.includes(flat_notes[i])) {
            chord = chord.replace(flat_notes[i], sharp_notes[i]);
        }
    }
    const chord_array = chord.split('/');
    const base_chord = chord_array[0];
    const slash_chord = chord_array[1];

    const transposed_base_chord = base_chord.replace(/[CDEFGAB]#?/g, match => {
        const index = (notes.indexOf(match) + n) % 12;
        if (index < 0) return notes[index + 12];
        return notes[index];
    });

    if (slash_chord) {
        const transposed_slash_chord = slash_chord.replace(/[CDEFGAB]#?/g, match => {
            const index = (notes.indexOf(match) + n) % 12;
            if (index < 0) return notes[index + 12];
            return notes[index];
        });
        return transposed_base_chord + '/' + transposed_slash_chord;
    }
    return transposed_base_chord;
}


//////// FLAT/SHARP BUTTON ////////
var flat_or_sharp_button = document.getElementById("IDflatOrSharp");
flat_or_sharp_button.addEventListener("click", () => {
    if (spotify_error == 1) {
        // Make button unclickable if Spotify is not available
        return;
    }
    sharp_symobl = document.getElementById("IDsharpSymbol");
    flat_symbol = document.getElementById("IDflatSymbol");
    if ((sharp_symobl.style.color == "white") && (flat_symbol.style.color == "white")) {
        return;
    }
    if (current_flat_or_sharp == "#") {
        current_flat_or_sharp = "b";

        var parser = new DOMParser();
        var parsed_body = parser.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
        var all_chords = parsed_body.getElementsByClassName("chord_span");
        for (let i = 0; i < all_chords.length; i++) {
            all_chords[i].innerHTML = sharOrFlatTranposer(transposeChord(all_chords[i].innerHTML.toString(), 0), current_flat_or_sharp);
        }
        document.getElementById('IDdivMainChords').innerHTML = parsed_body.body.innerHTML;
        main_chords_body = parsed_body.body.innerHTML;

        track_key = sharOrFlatTranposer(transposeChord(track_key, 0), current_flat_or_sharp);
        document.getElementById("IDtrackKeyValue").textContent = track_key;

        document.getElementById("IDsharpSymbol").style.fontWeight = "normal";
        document.getElementById("IDsharpSymbol").style.color = "white";    
        document.getElementById("IDsharpSymbol").style.filter = "";
        document.getElementById("IDflatSymbol").style.fontWeight = "bold";
        document.getElementById("IDflatSymbol").style.color = "#1DB954";
        document.getElementById("IDflatSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        
    } else if (current_flat_or_sharp == "b") {
        current_flat_or_sharp = "#";

        var parser = new DOMParser();
        var parsed_body = parser.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
        var all_chords = parsed_body.getElementsByClassName("chord_span");
        for (let i = 0; i < all_chords.length; i++) {
            all_chords[i].innerHTML = sharOrFlatTranposer(transposeChord(all_chords[i].innerHTML.toString(), 0), current_flat_or_sharp);
        }
        document.getElementById('IDdivMainChords').innerHTML = parsed_body.body.innerHTML;
        main_chords_body = parsed_body.body.innerHTML;

        track_key = sharOrFlatTranposer(transposeChord(track_key, 0), current_flat_or_sharp);
        document.getElementById("IDtrackKeyValue").textContent = track_key;

        document.getElementById("IDsharpSymbol").style.fontWeight = "bold";
        document.getElementById("IDsharpSymbol").style.color = "#1DB954";    
        document.getElementById("IDsharpSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        document.getElementById("IDflatSymbol").style.fontWeight = "normal";
        document.getElementById("IDflatSymbol").style.color = "white";
        document.getElementById("IDflatSymbol").style.filter = "";
    }
    localStorage.setItem("key_local_storage_previous_flat_or_sharp", current_flat_or_sharp);

    lines_hover_and_clickable();
});

function flatOrSharpPersistSetting() {
    // Not the same as event click, because doesn't reassign current_flat_or_sharp
    if (spotify_error == 1) {
        // Make button unclickable if Spotify is not available
        return;
    }
    sharp_symobl = document.getElementById("IDsharpSymbol");
    flat_symbol = document.getElementById("IDflatSymbol");
    if ((sharp_symobl.style.color == "white") && (flat_symbol.style.color == "white")) {
        return;
    }
    if (current_flat_or_sharp == "b") {

        var parser = new DOMParser();
        var parsed_body = parser.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
        var all_chords = parsed_body.getElementsByClassName("chord_span");
        for (let i = 0; i < all_chords.length; i++) {
            all_chords[i].innerHTML = sharOrFlatTranposer(transposeChord(all_chords[i].innerHTML.toString(), 0), current_flat_or_sharp);
        }
        document.getElementById('IDdivMainChords').innerHTML = parsed_body.body.innerHTML;
        main_chords_body = parsed_body.body.innerHTML;

        track_key = sharOrFlatTranposer(transposeChord(track_key, 0), current_flat_or_sharp);
        document.getElementById("IDtrackKeyValue").textContent = track_key;

        document.getElementById("IDsharpSymbol").style.fontWeight = "normal";
        document.getElementById("IDsharpSymbol").style.color = "white";    
        document.getElementById("IDsharpSymbol").style.filter = "";
        document.getElementById("IDflatSymbol").style.fontWeight = "bold";
        document.getElementById("IDflatSymbol").style.color = "#1DB954";
        document.getElementById("IDflatSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        
    } else if (current_flat_or_sharp == "#") {

        var parser = new DOMParser();
        var parsed_body = parser.parseFromString(document.getElementById('IDdivMainChords').innerHTML, "text/html");
        var all_chords = parsed_body.getElementsByClassName("chord_span");
        for (let i = 0; i < all_chords.length; i++) {
            all_chords[i].innerHTML = sharOrFlatTranposer(transposeChord(all_chords[i].innerHTML.toString(), 0), current_flat_or_sharp);
        }
        document.getElementById('IDdivMainChords').innerHTML = parsed_body.body.innerHTML;
        main_chords_body = parsed_body.body.innerHTML;
        
        track_key = sharOrFlatTranposer(transposeChord(track_key, 0), current_flat_or_sharp);
        document.getElementById("IDtrackKeyValue").textContent = track_key;

        document.getElementById("IDsharpSymbol").style.fontWeight = "bold";
        document.getElementById("IDsharpSymbol").style.color = "#1DB954";    
        document.getElementById("IDsharpSymbol").style.filter = "drop-shadow(0 0 8px #1DB954)";
        document.getElementById("IDflatSymbol").style.fontWeight = "normal";
        document.getElementById("IDflatSymbol").style.color = "white";
        document.getElementById("IDflatSymbol").style.filter = "";
    }
    lines_hover_and_clickable();
}


//////// SPOTIFY MUSIC CONTROL BUTTONS ////////
// Next Song
var next_spotify_track_button = document.getElementById("IDforwardButton");
next_spotify_track_button.addEventListener("click", () => {
    socket.emit('nextSpotifyTrack');
});
next_spotify_track_button.addEventListener("mouseover", () => {
    if (!is_on_touch_device) {
        next_spotify_track_button.style.scale = "1.1";
    }
});
next_spotify_track_button.addEventListener("mouseout", () => {
    next_spotify_track_button.style.scale = "1";
});

// Previous Song
var previous_spotify_track_button = document.getElementById("IDbackButton");
previous_spotify_track_button.addEventListener("click", () => {
    clicked_previous = 1;
    socket.emit('previousSpotifyTrack');
});
previous_spotify_track_button.addEventListener("mouseover", () => {
    if (!is_on_touch_device) {
        previous_spotify_track_button.style.scale = "1.1";
    }
});
previous_spotify_track_button.addEventListener("mouseout", () => {
    previous_spotify_track_button.style.scale = "1";
});

// Play/Pause Song
var play_pause_spotify_track_button = document.getElementById("IDplayAndPauseButton");
play_pause_spotify_track_button.addEventListener("click", () => {
    socket.emit('playPauseSpotifyTrack');
});
play_pause_spotify_track_button.addEventListener("mouseover", () => {
    if (!is_on_touch_device) {
        play_pause_spotify_track_button.style.scale = "1.1";
    }
});
play_pause_spotify_track_button.addEventListener("mouseout", () => {
    play_pause_spotify_track_button.style.scale = "1";
});


//////// SONG TIMELINE ////////
var line_empty = document.getElementById('IDtimeLineEmpty');
var line_filled = document.getElementById('IDtimeLineFilled');
var line_empty_2 = document.getElementById('IDtimeLineEmpty2');
var line_filled_2 = document.getElementById('IDtimeLineFilled2');

// Display a second timeline at hover and hide real timeline to prevent backend updating conflict
line_empty.addEventListener("mousemove", (event) => {
    line_empty.style.visibility = "hidden";
    line_filled.style.visibility = "hidden";
    line_empty.style.display = "none";
    line_filled.style.display = "none";
    line_empty_2.style.visibility = "visible";
    line_filled_2.style.visibility = "visible";
    line_empty_2.style.display = "block";
    line_filled_2.style.display = "block";
    
    let timeline_width = line_empty_2.clientWidth;
    let clickX = event.clientX - line_empty_2.getBoundingClientRect().left;

    let quotient = clickX / timeline_width;
    let calc_ms = Math.round(quotient * track_duration_ms);

    let progress_ratio = calc_ms / track_duration_ms;
    let progress_percent = Math.round(progress_ratio * 100);
    line_filled_2.style.width = progress_percent + "%";
});

// Update second timeline at hover and update current track time
line_empty_2.addEventListener("mousemove", (event) => {
    currently_hovering_timeline = true;
    if (!is_on_touch_device) {
        line_empty_2.style.transform = "scaleY(1.5)";
        line_filled_2.style.backgroundColor = "#34df70";
    }
    line_empty.style.visibility = "hidden";
    line_filled.style.visibility = "hidden";
    line_empty.style.display = "none";
    line_filled.style.display = "none";
    line_empty_2.style.visibility = "visible";
    line_filled_2.style.visibility = "visible";
    line_empty_2.style.display = "block";
    line_filled_2.style.display = "block";

    let timeline_width = line_empty_2.clientWidth;
    let clickX = event.clientX - line_empty_2.getBoundingClientRect().left;

    let quotient = clickX / timeline_width;
    let calc_ms = Math.round(quotient * track_duration_ms);

    let currentTime = document.getElementById("IDcurrentTime");
    let totalSeconds = Math.floor(calc_ms / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let formattedMinutes = minutes.toString();
    let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
    currentTime.textContent = formattedMinutes + ":" + formattedSeconds;

    let progress_ratio = calc_ms / track_duration_ms;
    let progress_percent = Math.round(progress_ratio * 100);
    line_filled_2.style.width = progress_percent + "%";
});

// Hide second timeline at hover-end and show real timeline again
line_empty_2.addEventListener("mouseleave", () => {
    currently_hovering_timeline = false;
    line_empty.style.visibility = "visible";
    line_filled.style.visibility = "visible";
    line_empty.style.display = "block";
    line_filled.style.display = "block";

    line_empty_2.style.visibility = "hidden";
    line_filled_2.style.visibility = "hidden";
    line_empty_2.style.display = "none";
    line_filled_2.style.display = "none";
});

// Click on second timeline -> Display line into center and send no time to backend
line_empty_2.addEventListener("click", (event) => {
    if (spotify_error == 1) {
        // Make button unclickable if Spotify is not available
        return;
    }
    if (musixmatch_lyrics_is_linesynced == 1) {
        dynamic_scroll = true;
    }
    clicked_on_timeline = true;
    let timeline_width = line_empty_2.clientWidth;
    let clickX = event.clientX - line_empty_2.getBoundingClientRect().left;

    let quotient = clickX / timeline_width;
    let calc_ms = Math.round(quotient * track_duration_ms);

    // Scroll immediately to the closest synced line available without waiting for server response or dynamic script
    // Important, as when clicking in timelime, you might click a time "between" existing timestamps and the dynamic script will 
    // scroll delayed only as soon as the next timestamp is the same as current time
    let closest_timestamp = null;
    let closest_difference = Infinity;
    clickable_synced_lines_timestamp_array.forEach((timestamp) => {
        let difference = Math.abs(timestamp - calc_ms);
        if (difference < closest_difference) {
            closest_difference = difference;
            closest_timestamp = timestamp;
        }
    });
    if (closest_timestamp != null) {
        current_synced_line = document.getElementById("IS_SYNCED_AT:" + closest_timestamp);
        try {
            current_synced_line.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
            current_synced_line.scrollTo;
        } catch {
            console.log('%cNo current synced line available - Could not center current line', 'color: yellow; font-weight: bold;');
        }
    }

    let progress_ratio = calc_ms / track_duration_ms;
    let progress_percent = Math.round(progress_ratio * 100);
    line_filled_2.style.width = progress_percent + "%";
    line_filled.style.width = progress_percent + "%";

    socket.emit('jumpInsideTrack', calc_ms);

    // Prevent dynamic script from updating to Spotifys current time until new one in front end is received
    sleepPromise(500).then(() => { clicked_on_timeline = false; });
});


//////// SYNC BUTTON ////////
var sync_button = document.getElementById("IDsyncButton");
var sync_button_current_rotation = 0;

// Hover effects
sync_button.addEventListener('mouseover', () =>  {
    if (!is_on_touch_device) {
        sync_button.style.transform = 'scale(0.85)'
    }
});
sync_button.addEventListener('mouseout', () =>  {
    if (!is_on_touch_device) {
        sync_button.style.transform = 'scale(1.0)'
    }
});

// Center synced line into view
sync_button.addEventListener('click', () =>  {
    if (spotify_error == 1 || complete_source_code_found == 0) {
        // Make button unclickable if Spotify is not available or no chords avaiable (stay at unsync)
        return;
    }
    try {
        current_synced_line.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
        current_synced_line.scrollTo;
    } catch {
        console.log('%cNo current synced line available - Could not center current line', 'color: yellow; font-weight: bold;');
    }

    dynamic_scroll = !dynamic_scroll;
    if (!dynamic_scroll) {
        sync_button.src = "static/img/sync_button.png";
        sync_button.style.filter = "";
        sync_button.style.opacity = "0.5";
        bottom_hr.classList.remove("classHRsyncOn");
        top_hr.classList.remove("classHRsyncOn");
    }

    if (dynamic_scroll) {
        sync_button.src = "static/img/sync_button_blue.png";
        sync_button.style.filter = " drop-shadow(0 0 15px #62dbfb)";
        sync_button.style.opacity = "1";
        bottom_hr.classList.add("classHRsyncOn");
        top_hr.classList.add("classHRsyncOn");
    }
});


//////// SYNC SKIP BUTTON ////////
var sync_skip_toggle = document.getElementById("IDsyncSkipToggle");
sync_skip_toggle.addEventListener('click', () =>  {

    if (sync_skip_on == 0) {
        sync_skip_on = 1;
        document.getElementById("IDforwardButton").src = "static/img/music_control/forward_button_blue.png";
        document.getElementById("IDforwardButton").title = "Next Syncable Song";
        document.getElementById("IDforwardButton").style.filter = " drop-shadow(0 0 10px #62dbfb)";
        document.getElementById("IDbackButton").src = "static/img/music_control/back_button_blue.png";
        document.getElementById("IDbackButton").title = "Previous Syncable Song";
        document.getElementById("IDbackButton").style.filter = " drop-shadow(0 0 10px #62dbfb)";
    }
    else if (sync_skip_on == 1) {
        sync_skip_on = 0;
        document.getElementById("IDforwardButton").src = "static/img/music_control/forward_button.png";
        document.getElementById("IDforwardButton").title = "Next Song";
        document.getElementById("IDforwardButton").style.filter = "";
        document.getElementById("IDbackButton").src = "static/img/music_control/back_button.png";
        document.getElementById("IDbackButton").title = "Previous Song";
        document.getElementById("IDbackButton").style.filter = "";
    }
});


//////// SETTINGS OVERLAY ////////
var settings_button = document.getElementById("IDsettingsButton");
var settings_overlay = document.getElementById("IDsettingsOverlay");
var settings_close_button = document.getElementById("IDcloseSettings");
settings_button.addEventListener("click", () => {
    settings_overlay.style.opacity = "1";
    settings_overlay.style.visibility = "visible";
});

settings_close_button.addEventListener("click", () => {
    settings_overlay.style.opacity = "0";
    settings_overlay.style.visibility = "hidden";
});

// Capo Settings
var capo_settings = document.getElementById("IDcapoSettings");
var capo_settings_checkbox = document.getElementById("IDcapoSettingsCheckbox");

var grayRGB = "rgb(174, 174, 174)";
var greenRGB = "rgb(29, 185, 84)";

function capoPersistOn() {
    capo_settings_checkbox.style.backgroundColor = greenRGB;
    setting_persist_capo_value = true;
    localStorage.setItem("key_local_storage_setting_persist_capo_value", setting_persist_capo_value);
}

function capoPersistOff() { 
    capo_settings_checkbox.style.backgroundColor = grayRGB;
    setting_persist_capo_value = false;
    localStorage.setItem("key_local_storage_setting_persist_capo_value", setting_persist_capo_value);
}

capo_settings.addEventListener("click", () => {
    if (window.getComputedStyle(capo_settings_checkbox).backgroundColor == grayRGB) {
        capoPersistOn();
    } else if (window.getComputedStyle(capo_settings_checkbox).backgroundColor == greenRGB) {
    capoPersistOff();
    }
});

setting_persist_capo_value == "true" && capoPersistOn();
setting_persist_capo_value == "false" && capoPersistOff();


// Flat/Sharp Settings
var flat_sharp_settings = document.getElementById("IDflatSharpSettings");
var flat_sharp_settings_checkbox = document.getElementById("IDflatSharpSettingsCheckbox");

function flatSharpPersistOn() {
    flat_sharp_settings_checkbox.style.backgroundColor = greenRGB;
    setting_persist_flat_or_sharp = true;
    localStorage.setItem("key_local_storage_setting_persist_flat_or_sharp", setting_persist_flat_or_sharp);
    localStorage.setItem("key_local_storage_previous_flat_or_sharp", current_flat_or_sharp);
}

function flatSharpPersistOff() {
    flat_sharp_settings_checkbox.style.backgroundColor = grayRGB;
    setting_persist_flat_or_sharp = false;
    localStorage.setItem("key_local_storage_setting_persist_flat_or_sharp", setting_persist_flat_or_sharp);
    localStorage.setItem("key_local_storage_previous_flat_or_sharp", current_flat_or_sharp);
}

flat_sharp_settings.addEventListener("click", () => {
    if (window.getComputedStyle(flat_sharp_settings_checkbox).backgroundColor == grayRGB) {
        flatSharpPersistOn();

    } else if (window.getComputedStyle(flat_sharp_settings_checkbox).backgroundColor == greenRGB) {
        flatSharpPersistOff();
    }
});

setting_persist_flat_or_sharp == "true" && flatSharpPersistOn();
setting_persist_flat_or_sharp == "false" && flatSharpPersistOff();


// Align Settings
var left_align_settings = document.getElementById("IDalignSettingsCheckbox");
var middle_align_settings = document.getElementById("IDalignSettingsCheckbox2");

function alignLeft() {
    left_align_settings.style.backgroundColor = greenRGB;
    left_align_settings.style.filter = "drop-shadow(0 0 8px #1DB954)";
    middle_align_settings.style.backgroundColor = grayRGB;
    middle_align_settings.style.filter = "";
    settings_align = "left";

    localStorage.setItem("key_local_storage_settings_align", settings_align);

    align_capo_persister = true;
    align_flat_or_sharp_persister = true;

    document.getElementById("IDdivMainChords").style.textAlign = "left";

    // request new static data from backend with parameter "left" as then spaces get insertet to fit UG layout
    socket.emit('trackStaticDataRequest', "left");
    // margins have to be fixed, which is done withing the handling of trackStaticDataResponse
}

left_align_settings.addEventListener("click", () => {
    if (window.getComputedStyle(left_align_settings).backgroundColor == greenRGB) {
        // pass
    } else if (window.getComputedStyle(left_align_settings).backgroundColor == grayRGB) {
        alignLeft();
    }
});

function alignMiddle() {
    middle_align_settings.style.backgroundColor = greenRGB;
    middle_align_settings.style.filter = "drop-shadow(0 0 8px #1DB954)";
    left_align_settings.style.backgroundColor = grayRGB;
    left_align_settings.style.filter = "";
    settings_align = "middle";

    localStorage.setItem("key_local_storage_settings_align", settings_align);

    align_capo_persister = true;
    align_flat_or_sharp_persister = true;

    document.getElementById("IDdivMainChords").style.textAlign = "center";

    // request new static data from backend with parameter "middle" as then spaces don't get insertet to enable simple middle align
    socket.emit('trackStaticDataRequest', "middle");
    // margins have to be fixed, which is done withn the handling of trackStaticDataResponse
}

middle_align_settings.addEventListener("click", () => {
    if (window.getComputedStyle(middle_align_settings).backgroundColor == greenRGB) {
        // pass
    } else if (window.getComputedStyle(middle_align_settings).backgroundColor == grayRGB) {
        alignMiddle();
    }
});

settings_align == "left" && alignLeft();
settings_align == "middle" && alignMiddle();


// Tuning Icon
var tuning_icon = document.getElementById("IDtuningIcon");
tuning_icon.addEventListener("mouseover", () => {
    if (!is_on_touch_device) {
        tuning_icon.src = "static/img/tuning_icon_hover.png";
    }
});
tuning_icon.addEventListener("mouseout", () => {
    tuning_icon.src = "static/img/tuning_icon.png";
});


// Arrow Keys
var lastEmitTime = 0;
var emitInterval = 200; 
var resetInterval = 3000;

var leftCounter = 0;
var rightCounter = 0;

document.addEventListener('keydown', function(event) {
    var wind_length_ms = 5000;

    // Check if the pressed key is the left arrow key
    if (event.key === 'ArrowLeft') {
        console.log("Backwards");

        // Check the time difference since the last emit
        var currentTime = new Date().getTime();
        if (currentTime - lastEmitTime >= emitInterval) {
            if (currentTime - lastEmitTime >= resetInterval) {
                leftCounter = 0;
                rightCounter = 0;
            }
            leftCounter += 1;
            if (leftCounter >= 4) {
                socket.emit('/songBackwards', progress_ms, wind_length_ms*2);
            }
            socket.emit('/songBackwards', progress_ms, wind_length_ms);

            // Update the last emit time
            lastEmitTime = currentTime;
        }
    }

    if (event.key === 'ArrowRight') {
        console.log("Forwards");

        // Check the time difference since the last emit
        var currentTime = new Date().getTime();
        if (currentTime - lastEmitTime >= emitInterval) {
            if (currentTime - lastEmitTime >= resetInterval) {
                leftCounter = 0;
                rightCounter = 0;
            }
            rightCounter += 1;
            if (rightCounter >= 4) {
                socket.emit('/songForwards', progress_ms, track_duration_ms, wind_length_ms*2);
            }
            socket.emit('/songForwards', progress_ms, track_duration_ms, wind_length_ms);

            // Update the last emit time
            lastEmitTime = currentTime;
        }
    }

    if (event.key === ' ') {
        console.log("Pause");
        socket.emit('playPauseSpotifyTrack');
    }

    if (event.key === 'ArrowUp') {
        console.log("Volume Increase");

        var currentTime = new Date().getTime();
        if (currentTime - lastEmitTime >= emitInterval) {
            socket.emit('increaseVolumeSpotify');
            lastEmitTime = currentTime;
        }
    }

    if (event.key === 'ArrowDown') {
        console.log("Volume Decrease");

        var currentTime = new Date().getTime();
        if (currentTime - lastEmitTime >= emitInterval) {
            socket.emit('decreaseVolumeSpotify');
            lastEmitTime = currentTime;
        }
    }
});


//////// REPEAT SECTION BUTTON ////////
var repeat_section_button = document.getElementById("IDrepeatSectionToggle");
clicked_counter_repeat_section = 0;
repeat_section_on = false;

repeat_section_button.addEventListener("click", () => {
    if (spotify_error == 1) {
        // Make button unclickable if Spotify is not available
        return;
    }
    clicked_counter_repeat_section = 1;
    repeat_section_on = !repeat_section_on;

    if (repeat_section_on) {
        repeat_section_button.checked = true;
        first_line_time = -1;
        last_line_time = -1;
        var style = document.createElement('style');
        var existingStyle = document.querySelector('style#repeatSectionStyle');
        var styleContent = `
            #IDrepeatSectionToggle:checked:before {
                background-image:url('/static/img/repeat_section_button_2.png');
                background-size: cover;
            }
        `;
        if (existingStyle) {
            existingStyle.innerHTML = styleContent;
        } else {
            style.type = 'text/css';
            style.innerHTML = styleContent;
            style.id = 'repeatSectionStyle';
            document.head.appendChild(style);
        }
    }

    if (!repeat_section_on) {
        repeat_section_button.checked = false;
        first_line_time = -1;
        last_line_time = -1;
        var style = document.createElement('style');
        var existingStyle = document.querySelector('style#repeatSectionStyle');
        var styleContent = `
            #IDrepeatSectionToggle:checked:before {
                background-image:url('/static/img/repeat_section_button_1.png');
                background-size: cover;
            }
        `;
        if (existingStyle) {
            existingStyle.innerHTML = styleContent;
        } else {
            style.type = 'text/css';
            style.innerHTML = styleContent;
            style.id = 'repeatSectionStyle';
            document.head.appendChild(style);
        }
    }
});

function resetRepeatSectionFlag() {
    already_in_section_request_first_line = false;
}


//////// MUTE SONG ////////
document.getElementById("IDAlbum").addEventListener("click", () => {
    if (spotify_error == 1) {
        // Make button unclickable if Spotify is not available
        return;
    }
    socket.emit('muteSpotifyTrack');
});


//////// SHUFFLE ////////
var shuffle_button = document.getElementById("IDshuffleButton");
shuffle_button.addEventListener("click", () => {
    socket.emit('toggleShuffleState');
});
shuffle_button.addEventListener("mouseover", () => {
    if (!is_on_touch_device) {
        shuffle_button.style.scale = "1.1";
    }
});
shuffle_button.addEventListener("mouseout", () => {
    shuffle_button.style.scale = "1";
});


//////// REPEAT SPOTIFY ////////
var spotify_repeat_button = document.getElementById("IDrepeatSpotifyButton");
spotify_repeat_button.addEventListener("click", () => {
    socket.emit('toggleRepeatState');
});
spotify_repeat_button.addEventListener("mouseover", () => {
    if (!is_on_touch_device) {
        spotify_repeat_button.style.scale = "1.1";
    }
});
spotify_repeat_button.addEventListener("mouseout", () => {
    spotify_repeat_button.style.scale = "1";
});

var repeatSectionToggle = document.getElementById("IDrepeatSectionToggle");
repeatSectionToggle.addEventListener("click", function() {
    // Check the state of the checkbox
    if (repeatSectionToggle.checked) {
        repeatSectionToggle.title = "Click LINE to define START of Repeat Section";
    } else {
        repeatSectionToggle.title = "Repeat/Replay Section";
    }
});

// Initial setup based on the checkbox state
if (repeatSectionToggle.checked) {
    repeatSectionToggle.title = "Click LINE to define START of Repeat Section";
} else {
    repeatSectionToggle.title = "Repeat/Replay Section";
}



// Save reference to the original calcDynamicScrolling function (if it exists)
const originalCalcDynamicScrolling = window.calcDynamicScrolling;

// Create our enhanced dynamic scrolling function which will be used in the socket.on handler
function enhancedDynamicScrolling(min_scroll_value, max_scroll_value, track_duration_ms, progress_ms, clickable_synced_lines_timestamp_array) {
    // Remove current-line class from all elements
    document.querySelectorAll('.current-line').forEach(el => {
        el.classList.remove('current-line');
    });

    // Find the currently active line based on progress time
    let closestTimestamp = null;
    let closestDifference = Infinity;

    clickable_synced_lines_timestamp_array.forEach((timestamp) => {
        //////// Repeat Section Logic ////////
        if (clicked_counter_repeat_section == 3 && repeat_section_on == true && first_line_time != -1 && last_line_time != -1) {
            if (Math.abs(progress_ms - parseInt(last_line_time)) <= 500) {
                if (already_in_section_request_first_line == false) {
                    already_in_section_request_first_line = true;
                    socket.emit('jumpInsideTrack', parseInt(first_line_time));
                    setTimeout(resetRepeatSectionFlag, 2000);
                }   
            }
        }
        // End Repeat Section Logic

        const difference = Math.abs(progress_ms - timestamp);
        
        // Keep track of the closest line to current time
        if (difference < closestDifference) {
            closestDifference = difference;
            closestTimestamp = timestamp;
        }

        // Highlight exact matching line 
        if (difference <= 300) {
            current_synced_line = document.getElementById("IS_SYNCED_AT:" + timestamp);
            if (!current_synced_line) {
                current_synced_line = document.getElementById("IS_SYNCED_AT:" + timestamp + ".0");
            }

            try {
                current_synced_line.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
                
                // Add highlight class to the current line
                current_synced_line.classList.add('current-line');
                
                // Highlight chords in current line
                highlightChordsInCurrentLine(current_synced_line);
                
            } catch(e) {
                console.log('The exact error message is: ' + e);
                console.log('%cNo current synced line available - Could not center current line', 'color: yellow; font-weight: bold;');
            }
        }
    });

    // If no exact match was found within threshold, use the closest line
    if (!document.querySelector('.current-line') && closestTimestamp !== null) {
        const nearestLine = document.getElementById("IS_SYNCED_AT:" + closestTimestamp) || 
                            document.getElementById("IS_SYNCED_AT:" + closestTimestamp + ".0");
        
        if (nearestLine && Math.abs(progress_ms - closestTimestamp) < 5000) {
            nearestLine.classList.add('current-line');
            highlightChordsInCurrentLine(nearestLine);
        }
    }
}

// Function to highlight chords within the current line
function highlightChordsInCurrentLine(lineElement) {
    if (!lineElement) return;
    
    const chordSpans = lineElement.querySelectorAll('.chord_span');
    chordSpans.forEach((chord, index) => {
        // Small delay for each chord to create a cascade effect
        setTimeout(() => {
            chord.style.transition = 'transform 0.2s ease';
            chord.style.transform = 'scale(1.05)';
            setTimeout(() => {
                chord.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// Modify our socket.on handler for trackDynamicDataResponse
// We'll add this code at the end of the script file, and it will override the existing handler
document.addEventListener('DOMContentLoaded', function() {
    // Make sure this runs after the original socket handlers are set up
    setTimeout(() => {
        // Remove the existing handler and replace with our enhanced one
        const originalHandler = socket._callbacks.$trackDynamicDataResponse[0];
        socket.off('trackDynamicDataResponse');
        
        socket.on('trackDynamicDataResponse', (track_dynamic_data) => {
            // Call the original handler to maintain existing functionality
            originalHandler(track_dynamic_data);
            
            // Add our enhanced highlighting logic
            // Only enhance when dynamic scroll is on and synced lyrics are available
            if (dynamic_scroll && musixmatch_lyrics_is_linesynced == 1 && in_track_change == false) {
                enhancedDynamicScrolling(min_scroll_value, max_scroll_value, track_duration_ms, progress_ms, clickable_synced_lines_timestamp_array);
            }
        });
    }, 1000); // Wait 1 second to ensure the original handlers are loaded
});

// Add style tag for our CSS enhancements
function addEnhancedStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        /* REDUCE SIZE OF PLAYER UI */
        #IDAlbum {
            width: auto;
            height: 140px; /* Reduced from 175px */
        }

        #IDdivTrackAndTime {
            height: 140px; /* Reduced from 175px */
        }

        #IDtrackName {
            font-size: 1.7rem; /* Reduced from 2rem */
        }

        #IDartistName {
            font-size: 1.1rem; /* Reduced from 1.3rem */
        }

        #IDplayAndPauseButton {
            width: 45px; /* Reduced from 50px */
        }

        #IDbackButton, #IDforwardButton {
            width: 35px; /* Reduced from 40px */
        }

        #IDshuffleButton, #IDrepeatSpotifyButton {
            width: 30px; /* Reduced from 35px/45px */
            height: 40px; /* Reduced from 45px */
        }

        #IDdivAlbumAndTrackAndTime {
            margin: 0 0 1vh 0; /* Reduced from 2vh */
        }

        /* INCREASE SIZE OF LYRICS/CHORDS */
        #IDdivMainChordsWrapper {
            height: 50vh; /* Increased from 40vh */
            font-size: 1.7rem; /* Increased from 1.5rem */
        }

        .chord_span {
            font-weight: bold;
            color: #1DB954; /* Spotify green for chords */
        }

        /* ENHANCE CURRENT LINE HIGHLIGHTING */
        .current-line {
            font-weight: bold;
            color: #f8f8f8 !important;
            background-color: rgba(29, 185, 84, 0.2); /* Spotify green with transparency */
            padding: 0.2em 0.5em;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
            transition: all 0.3s ease;
        }

        .current-line .chord_span {
            color: #ffffff !important;
            background-color: #1DB954;
            padding: 0.1em 0.3em;
            border-radius: 3px;
            box-shadow: 0 0 8px #1DB954;
        }

        #IDdivMainChords > span:not(.current-line) {
            opacity: 0.8;
        }

        #IDdivMainChords > span {
            transition: all 0.4s ease;
            display: block;
            margin-bottom: 0.3em;
        }

        #IDdivMainChords br {
            line-height: 1.8;
        }
    `;
    document.head.appendChild(styleEl);
}


// Ensure this runs after the main script has loaded
window.addEventListener('load', function() {
    // Create control fallbacks for Spotify playback controls
    createControlFallbacks();
    
    // Setup socket reconnection handling
    setupSocketReconnection();
});

function createControlFallbacks() {
    // Play/Pause button with HTTP fallback
    const playPauseButton = document.getElementById('IDplayAndPauseButton');
    const originalPlayPauseAction = playPauseButton.onclick;
    
    playPauseButton.onclick = function() {
        if (spotify_error == 1) {
            // Make button unclickable if Spotify is not available
            return;
        }
        
        try {
            // Try WebSocket first
            socket.emit('playPauseSpotifyTrack');
        } catch (e) {
            console.log('WebSocket error, using HTTP fallback for play/pause:', e);
            // Use HTTP fallback
            fetch('/api/player/play-pause', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error controlling playback:', data.error);
                } else {
                    // Update UI to reflect new state
                    if (data.action === 'play') {
                        playPauseButton.src = "static/img/music_control/play_button.png";
                    } else {
                        playPauseButton.src = "static/img/music_control/pause_button.png";
                    }
                }
            })
            .catch(error => console.error('Error:', error));
        }
    };
    
    // Next Track button with HTTP fallback
    const nextButton = document.getElementById('IDforwardButton');
    const originalNextAction = nextButton.onclick;
    
    nextButton.onclick = function() {
        if (spotify_error == 1) {
            // Make button unclickable if Spotify is not available
            return;
        }
        
        // Check if sync skip is enabled
        if (sync_skip_on == 1) {
            try {
                socket.emit('nextSpotifyTrack');
            } catch (e) {
                console.error('WebSocket error for next track with sync skip:', e);
            }
            return;
        }
        
        try {
            // Try WebSocket first
            socket.emit('nextSpotifyTrack');
        } catch (e) {
            console.log('WebSocket error, using HTTP fallback for next track:', e);
            // Use HTTP fallback
            fetch('/api/player/next', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error controlling playback:', data.error);
                } else {
                    // Trigger a data refresh to show the new track
                    requestTrackData();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    };
    
    // Previous Track button with HTTP fallback
    const previousButton = document.getElementById('IDbackButton');
    const originalPreviousAction = previousButton.onclick;
    
    previousButton.onclick = function() {
        if (spotify_error == 1) {
            // Make button unclickable if Spotify is not available
            return;
        }
        
        clicked_previous = 1;
        
        try {
            // Try WebSocket first
            socket.emit('previousSpotifyTrack');
        } catch (e) {
            console.log('WebSocket error, using HTTP fallback for previous track:', e);
            // Use HTTP fallback
            fetch('/api/player/previous', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error controlling playback:', data.error);
                } else {
                    // Trigger a data refresh to show the new track
                    requestTrackData();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    };
    
    // Add fallbacks for other controls (volume, shuffle, repeat, etc)
    setupVolumeControlFallbacks();
    setupShuffleRepeatFallbacks();
    setupTimelineFallback();
}

function setupVolumeControlFallbacks() {
    // Volume Up fallback
    const volumeUpAction = function() {
        try {
            socket.emit('increaseVolumeSpotify');
        } catch (e) {
            console.log('Using HTTP fallback for volume up');
            fetch('/api/player/volume-up', { method: 'POST' })
                .catch(err => console.error('Volume control error:', err));
        }
    };
    
    // Volume Down fallback
    const volumeDownAction = function() {
        try {
            socket.emit('decreaseVolumeSpotify');
        } catch (e) {
            console.log('Using HTTP fallback for volume down');
            fetch('/api/player/volume-down', { method: 'POST' })
                .catch(err => console.error('Volume control error:', err));
        }
    };
    
    // Mute fallback
    const muteAction = function() {
        try {
            socket.emit('muteSpotifyTrack');
        } catch (e) {
            console.log('Using HTTP fallback for mute');
            fetch('/api/player/mute', { method: 'POST' })
                .catch(err => console.error('Mute control error:', err));
        }
    };
    
    // Hook these into the UI as needed
    // For arrow keys
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp') {
            volumeUpAction();
        } else if (event.key === 'ArrowDown') {
            volumeDownAction();
        }
    });
    
    // For album click (mute)
    const albumCover = document.getElementById('IDAlbum');
    if (albumCover) {
        const originalAlbumClick = albumCover.onclick;
        albumCover.onclick = function() {
            if (spotify_error == 1) return;
            muteAction();
        };
    }
}

function setupShuffleRepeatFallbacks() {
    // Shuffle button fallback
    const shuffleButton = document.getElementById('IDshuffleButton');
    if (shuffleButton) {
        const originalShuffleClick = shuffleButton.onclick;
        shuffleButton.onclick = function() {
            if (spotify_error == 1) return;
            
            try {
                socket.emit('toggleShuffleState');
            } catch (e) {
                console.log('Using HTTP fallback for shuffle');
                fetch('/api/player/toggle-shuffle', { method: 'POST' })
                    .catch(err => console.error('Shuffle control error:', err));
            }
        };
    }
    
    // Repeat button fallback
    const repeatButton = document.getElementById('IDrepeatSpotifyButton');
    if (repeatButton) {
        const originalRepeatClick = repeatButton.onclick;
        repeatButton.onclick = function() {
            if (spotify_error == 1) return;
            
            try {
                socket.emit('toggleRepeatState');
            } catch (e) {
                console.log('Using HTTP fallback for repeat');
                fetch('/api/player/toggle-repeat', { method: 'POST' })
                    .catch(err => console.error('Repeat control error:', err));
            }
        };
    }
}

function setupTimelineFallback() {
    // Timeline click fallback
    const timeline = document.getElementById('IDtimeLineEmpty2');
    if (timeline) {
        const originalTimelineClick = timeline.onclick;
        timeline.onclick = function(event) {
            if (spotify_error == 1) return;
            
            let timeline_width = timeline.clientWidth;
            let clickX = event.clientX - timeline.getBoundingClientRect().left;
            let quotient = clickX / timeline_width;
            let calc_ms = Math.round(quotient * track_duration_ms);
            
            try {
                socket.emit('jumpInsideTrack', calc_ms);
            } catch (e) {
                console.log('Using HTTP fallback for seeking');
                fetch('/api/player/seek', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ position_ms: calc_ms })
                })
                .catch(err => console.error('Seek control error:', err));
            }
        };
    }
}

// Function to request track data using HTTP if WebSockets are down
function requestTrackData() {
    fetch('/api/track-data')
        .then(response => response.json())
        .then(data => {
            // Update UI with the new track data
            updateUIWithTrackData(data);
        })
        .catch(error => console.error('Error fetching track data:', error));
}

// Update UI based on track data
function updateUIWithTrackData(data) {
    // Update track info
    if (data.track_name) {
        document.getElementById('IDtrackName').textContent = data.track_name;
    }
    
    if (data.artist_name) {
        document.getElementById('IDartistName').textContent = "by " + data.artist_name;
    }
    
    // Update album cover if available
    if (data.album_cover_url && data.album_cover_url !== "") {
        document.getElementById('IDAlbum').src = data.album_cover_url;
        document.body.style.backgroundImage = `url('${data.album_cover_url}')`;
    }
    
    // Update progress and timeline
    if (data.progress_ms !== undefined) {
        progress_ms = data.progress_ms;
        let progress_ratio = progress_ms / data.track_duration_ms;
        let progress_percent = Math.round(progress_ratio * 100);
        document.getElementById('IDtimeLineFilled').style.width = progress_percent + "%";
        document.getElementById('IDcurrentTime').textContent = data.current_time;
    }
    
    // Update play/pause button state
    if (data.play_or_pause) {
        if (data.play_or_pause === "True") {
            document.getElementById('IDplayAndPauseButton').src = "static/img/music_control/play_button.png";
        } else {
            document.getElementById('IDplayAndPauseButton').src = "static/img/music_control/pause_button.png";
        }
    }
    
    // Update other UI elements as needed
    if (data.current_shuffle_state !== undefined) {
        document.getElementById('IDshuffleButton').src = data.current_shuffle_state ? 
            "static/img/music_control/shuffle_on.png" : 
            "static/img/music_control/shuffle_off.png";
    }
    
    // Handle repeat state
    if (data.current_repeat_state) {
        let repeatImg;
        switch(data.current_repeat_state) {
            case "off":
                repeatImg = "static/img/music_control/repeat_spotify_off.png";
                break;
            case "track":
                repeatImg = "static/img/music_control/repeat_spotify_song.png";
                break;
            case "context":
                repeatImg = "static/img/music_control/repeat_spotify_context.png";
                break;
        }
        document.getElementById('IDrepeatSpotifyButton').src = repeatImg;
    }
}

// Setup socket reconnection handling for better reliability
function setupSocketReconnection() {
    // Add connect event handlers if socket exists
    if (typeof socket !== 'undefined') {
        // Track connection state
        let isConnected = socket.connected;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        
        // Handle disconnections
        socket.on('disconnect', function() {
            console.log('Socket disconnected');
            isConnected = false;
            
            // Try to reconnect if disconnected
            if (reconnectAttempts < maxReconnectAttempts) {
                setTimeout(function() {
                    reconnectAttempts++;
                    console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
                    socket.connect();
                }, 1000); // Wait 1 second before trying to reconnect
            } else {
                console.log('Max reconnection attempts reached, switching to HTTP mode');
                // Switch to HTTP polling mode
                startHttpPolling();
            }
        });
        
        // Reset reconnect counter on successful connection
        socket.on('connect', function() {
            console.log('Socket connected');
            isConnected = true;
            reconnectAttempts = 0;
            
            // Request initial data
            socket.emit('trackStaticDataRequest', settings_align || 'left');
        });
        
        // Handle connection errors
        socket.on('connect_error', function(error) {
            console.log('Connection error:', error);
            if (reconnectAttempts < maxReconnectAttempts) {
                setTimeout(function() {
                    reconnectAttempts++;
                    console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
                    socket.connect();
                }, 1000);
            } else {
                console.log('Max reconnection attempts reached, switching to HTTP mode');
                startHttpPolling();
            }
        });
    }
}

// Fallback to HTTP polling if WebSockets fail completely
let httpPollingInterval = null;
function startHttpPolling() {
    if (httpPollingInterval) {
        clearInterval(httpPollingInterval);
    }
    
    // Poll every second for track data
    httpPollingInterval = setInterval(function() {
        requestTrackData();
    }, 1000);
    
    console.log('HTTP polling started');
}

// Stop HTTP polling if WebSockets are working again
function stopHttpPolling() {
    if (httpPollingInterval) {
        clearInterval(httpPollingInterval);
        httpPollingInterval = null;
        console.log('HTTP polling stopped');
    }
}



// Add our styles
document.addEventListener('DOMContentLoaded', function() {
    addEnhancedStyles();
});