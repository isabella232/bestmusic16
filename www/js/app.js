import Barba from 'barba.js';
import Flickity from 'flickity';

let songContainers = null;
let modal = null;
let modalOverlay = null;
let carousel = null;
let flkty = null;
let listButton = null;

const isTouch = Modernizr.touchevents;

const onWindowLoaded = function() {
    listButton = document.querySelector('button.lists');
    Barba.Dispatcher.on('newPageReady', attachEvents);
    Barba.Pjax.start();
}

const attachEvents = function(currentStatus, prevStatus) {
    if (currentStatus.namespace === 'index') {
        listButton.style.display = "none";
    }

    if (currentStatus.namespace === 'list') {
        listButton.style.display = "block";
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

        flkty.on('select', loadEmbed);
        flkty.on('settle', unloadEmbed);

        for (var i = 0; i < songContainers.length; i++) {
            songContainers[i].addEventListener('click', onSongClick);
        }
        modalOverlay.addEventListener('click', onModalClick);
    }
}

const loadEmbed = function() {
    const item = document.querySelectorAll('.carousel-cell')[flkty.selectedIndex];

    const iframe = item.querySelector('iframe');

    if (iframe) {
        const src = iframe.getAttribute('data-src');
        iframe.setAttribute('src', src);
    }
}

const unloadEmbed = function() {
    const itemBehind = document.querySelectorAll('.carousel-cell')[flkty.selectedIndex - 1];
    const itemAhead = document.querySelectorAll('.carousel-cell')[flkty.selectedIndex + 1];

    const items = [itemBehind, itemAhead];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item) {
            const iframe = items[i].querySelector('iframe');
            if (iframe) {
                iframe.setAttribute('src', '');
            }
        }
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
