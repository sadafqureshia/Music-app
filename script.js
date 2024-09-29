const audio = new Audio();
let playlist = [];
let currentIndex = 0;
let recentPlays = [];

// Function to load the song
function loadSong() {
    if (playlist.length > 0) {
        const currentSong = playlist[currentIndex];
        audio.src = currentSong.src;
        document.getElementById('currentTitle').innerText = currentSong.title;
        document.getElementById('currentArtist').innerText = currentSong.artist;
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('currentTime').innerText = '0:00';
        document.getElementById('totalTime').innerText = formatTime(currentSong.duration);
    }
}

// Function to play the song
function playSong() {
    audio.play();
    document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
}

// Function to pause the song
function pauseSong() {
    audio.pause();
    document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i>';
}

// Function to change the volume
function changeVolume(volume) {
    audio.volume = volume;
}

// Function to format the time
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Function to update the progress bar
function updateProgress() {
    const progress = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('currentTime').innerText = formatTime(audio.currentTime);
}

// Function to handle the audio ended event
function audioEnded() {
    if (currentIndex < playlist.length - 1) {
        currentIndex++;
        loadSong();
        playSong();
    } else {
        currentIndex = 0;
        loadSong();
        playSong();
    }
}

// Function to handle the audio time update event
function audioTimeUpdate() {
    updateProgress();
}

// Function to handle the play/pause button click event
function playPause() {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
}

// Function to handle the previous button click event
function prevSong() {
    if (currentIndex > 0) {
        currentIndex--;
        loadSong();
        playSong();
    } else {
        currentIndex = playlist.length - 1;
        loadSong();
        playSong();
    }
}

// Function to handle the next button click event
function nextSong() {
    if (currentIndex < playlist.length - 1) {
        currentIndex++;
        loadSong();
        playSong();
    } else {
        currentIndex = 0;
        loadSong();
        playSong();
    }
}

// Function to handle the remove button click event
function removeSong() {
    if (playlist.length > 0) {
        playlist.splice(currentIndex, 1);
        if (currentIndex > 0) {
            currentIndex--;
        }
        loadSong();
        playSong();
    }
}

// Function to handle the upload button click event
function uploadSongs() {
    const files = document.getElementById('uploadSongs').files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(event) {
            const audioData = event.target.result;
            const audioSrc = URL.createObjectURL(file);
            const title = file.name;
            const artist = 'Unknown';
            const duration = file.duration;
            const song = {
                src: audioSrc,
                title,
                artist,
                duration
            };
            playlist.push(song);
            const playlistList = document.getElementById('playlist');
            const li = document.createElement('li');
            li.innerText = song.title;
            li.onclick = function() {
                const index = playlist.indexOf(song);
                currentIndex = index;
                loadSong();
                playSong();
            };
            playlistList.appendChild(li);
        };
        reader.readAsDataURL(file);
    }
}

// Function to handle the search button click event
function searchSongs() {
    const searchInput = document.getElementById('searchInput').value;
    const filteredPlaylist = playlist.filter(song => song.title.toLowerCase().includes(searchInput.toLowerCase()));
    const playlistList = document.getElementById('playlist');
    playlistList.innerHTML = '';
    filteredPlaylist.forEach(song => {
        const li = document.createElement('li');
        li.innerText = song.title;
        li.onclick = function() {
            const index = playlist.indexOf(song);
            currentIndex = index;
            loadSong();
            playSong();
        };
        playlistList.appendChild(li);
    });
}

// Add event listeners
audio.addEventListener('ended', audioEnded);
audio.addEventListener('timeupdate', audioTimeUpdate);
document.getElementById('playPauseBtn').addEventListener('click', playPause);
document.getElementById('prevBtn').addEventListener('click', prevSong);
document.getElementById('nextBtn').addEventListener('click', nextSong);
document.getElementById('removeBtn').addEventListener('click', removeSong);
document.getElementById('uploadSongs').addEventListener('change', uploadSongs);
document.getElementById('searchInput').addEventListener('input', searchSongs);

// Initialize the music player
loadSong();