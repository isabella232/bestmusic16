import Barba from 'barba.js';

let songContainers = null;
let modal = null;
let modalOverlay = null;

const onWindowLoaded = function() {
    songContainers = document.querySelectorAll('.song-container');
    modal = document.querySelector('.modal');
    modalOverlay = document.querySelector('.modal-overlay');

    for (var i = 0; i < songContainers.length; i++) {
        songContainers[i].addEventListener('click', onSongClick);
    }
    modalOverlay.addEventListener('click', onModalClick);

    Barba.Pjax.start();
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