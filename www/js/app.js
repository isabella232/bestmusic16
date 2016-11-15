import Barba from 'barba.js';
import Flickity from 'flickity';

let songContainers = null;
let modal = null;
let modalOverlay = null;
let carousel = null;
let flkty = null;

const isTouch = Modernizr.touchevents;

const onWindowLoaded = function() {
    Barba.Dispatcher.on('newPageReady', attachEvents);
    Barba.Pjax.start();
}

const attachEvents = function(currentStatus, prevStatus) {
    if (currentStatus.namespace === 'list') {
        songContainers = document.querySelectorAll('.song-wrapper');
        modal = document.querySelector('.modal');
        modalOverlay = document.querySelector('.modal-overlay');
        carousel = document.querySelector('.main-carousel');
        flkty = new Flickity(carousel, {
            pageDots: false,
            draggable: isTouch,
            dragThreshold: 20,
            setGallerySize: false,
            friction: isTouch ? 0.28 : 1,
            selectedAttraction: isTouch ? 0.025 : 1
        });

        for (var i = 0; i < songContainers.length; i++) {
            songContainers[i].addEventListener('click', onSongClick);
        }
        modalOverlay.addEventListener('click', onModalClick);
    }
}

const onSongClick = function() {
    modal.style.display = 'block';
    flkty.resize();
    flkty.select([].indexOf.call(songContainers, this), false, true);
}

const onModalClick = function() {
    modal.style.display = 'none';
}

window.onload = onWindowLoaded;
