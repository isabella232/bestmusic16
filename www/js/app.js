import Barba from 'barba.js';

let songContainers = null;
let modal = null;
let modalOverlay = null;

const onWindowLoaded = function() {
    Barba.Dispatcher.on('newPageReady', attachEvents);
    Barba.Pjax.start();
}

const attachEvents = function(currentStatus, prevStatus) {
    if (currentStatus.namespace === 'list') {
        songContainers = document.querySelectorAll('.song-container');
        modal = document.querySelector('.modal');
        modalOverlay = document.querySelector('.modal-overlay');

        for (var i = 0; i < songContainers.length; i++) {
            songContainers[i].addEventListener('click', onSongClick);
        }
        modalOverlay.addEventListener('click', onModalClick);
    }
}

const onSongClick = function() {
    modal.style.display = 'block';

    modal.querySelector('.artist').innerHTML = this.querySelector('h6').innerHTML;
    modal.querySelector('.title').innerHTML = this.querySelector('h5').innerHTML;
    modal.querySelector('.desc').innerHTML = this.querySelector('p').innerHTML;
}

const onModalClick = function() {
    modal.style.display = 'none';
}

window.onload = onWindowLoaded;