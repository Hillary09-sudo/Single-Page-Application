// Function to fetch data from the API
async function fetchWordData(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// Function to parse and display the fetched data
function displayResults(data) {
    const wordDisplay = document.getElementById('word-display');
    const phoneticDisplay = document.getElementById('phonetic-display');
    const audioDisplay = document.getElementById('audio-display');
    const audioPlayer = document.getElementById('audio-player');
    const definitionsDisplay = document.getElementById('definitions-display');
    const synonymsDisplay = document.getElementById('synonyms-display');
    const synonymsList = document.getElementById('synonyms-list');
    const errorDisplay = document.getElementById('error-display');
    const loadingDisplay = document.getElementById('loading-display');

    // Hide loading and error
    loadingDisplay.style.display = 'none';
    errorDisplay.style.display = 'none';

    // Assuming data is an array with the first entry
    const entry = data[0];

    // Display word
    wordDisplay.textContent = entry.word;
    wordDisplay.style.display = 'block';

    // Display phonetic
    if (entry.phonetic) {
        phoneticDisplay.textContent = entry.phonetic;
        phoneticDisplay.style.display = 'block';
    } else {
        phoneticDisplay.style.display = 'none';
    }

    // Display audio
    const phonetics = entry.phonetics;
    let audioSrc = null;
    for (let phonetic of phonetics) {
        if (phonetic.audio) {
            audioSrc = phonetic.audio;
            break;
        }
    }
    if (audioSrc) {
        audioPlayer.src = audioSrc;
        audioDisplay.style.display = 'block';
    } else {
        audioDisplay.style.display = 'none';
    }

    // Display definitions
    definitionsDisplay.innerHTML = '';
    entry.meanings.forEach(meaning => {
        const partOfSpeech = document.createElement('h3');
        partOfSpeech.textContent = meaning.partOfSpeech;
        definitionsDisplay.appendChild(partOfSpeech);
        meaning.definitions.forEach(def => {
            const defItem = document.createElement('p');
            defItem.textContent = def.definition;
            definitionsDisplay.appendChild(defItem);
            if (def.example) {
                const example = document.createElement('em');
                example.textContent = `Example: ${def.example}`;
                definitionsDisplay.appendChild(example);
            }
        });
    });
    definitionsDisplay.style.display = 'block';

    // Display synonyms
    synonymsList.innerHTML = '';
    let hasSynonyms = false;
    entry.meanings.forEach(meaning => {
        meaning.definitions.forEach(def => {
            if (def.synonyms && def.synonyms.length > 0) {
                def.synonyms.forEach(syn => {
                    const li = document.createElement('li');
                    li.textContent = syn;
                    synonymsList.appendChild(li);
                    hasSynonyms = true;
                });
            }
        });
    });
    if (hasSynonyms) {
        synonymsDisplay.style.display = 'block';
    } else {
        synonymsDisplay.style.display = 'none';
    }
}

// Function to handle errors
function displayError(message) {
    const errorDisplay = document.getElementById('error-display');
    const loadingDisplay = document.getElementById('loading-display');
    loadingDisplay.style.display = 'none';
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
    // Hide other displays
    document.getElementById('word-display').style.display = 'none';
    document.getElementById('phonetic-display').style.display = 'none';
    document.getElementById('audio-display').style.display = 'none';
    document.getElementById('definitions-display').style.display = 'none';
    document.getElementById('synonyms-display').style.display = 'none';
}

// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input');
    const word = searchInput.value.trim();
    if (!word) {
        displayError('Please enter a word to search.');
        return;
    }
    // Show loading
    document.getElementById('loading-display').style.display = 'block';
    try {
        const data = await fetchWordData(word);
        displayResults(data);
    } catch (error) {
        displayError(error.message);
    }
});

// Clear results on new input (optional enhancement)
document.getElementById('search-input').addEventListener('input', function() {
    if (this.value.trim() === '') {
        // Hide all displays
        document.getElementById('word-display').style.display = 'none';
        document.getElementById('phonetic-display').style.display = 'none';
        document.getElementById('audio-display').style.display = 'none';
        document.getElementById('definitions-display').style.display = 'none';
        document.getElementById('synonyms-display').style.display = 'none';
        document.getElementById('error-display').style.display = 'none';
        document.getElementById('loading-display').style.display = 'none';
    }
});