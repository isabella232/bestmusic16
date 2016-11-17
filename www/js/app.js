import Barba from 'barba.js';
import Flickity from 'flickity';

let songContainers = null;
let modal = null;
let modalOverlay = null;
let carousel = null;
let carouselCells = null;
let flkty = null;
let listButton = null;

const isTouch = Modernizr.touchevents;

const onWindowLoaded = function() {
    listButton = document.querySelector('button.lists');
    Barba.Dispatcher.on('newPageReady', attachEvents);
    Barba.Pjax.start();
}

const attachEvents = function(currentStatus, prevStatus, container) {
    if (currentStatus.namespace === 'index') {
        listButton.style.display = "none";
    }

    if (currentStatus.namespace === 'list') {
        listButton.style.display = "block";
        songContainers = container.querySelectorAll('.song-wrapper');
        modal = container.querySelector('.modal');
        modalOverlay = container.querySelector('.modal-overlay');
        carousel = container.querySelector('.main-carousel');
        carouselCells = container.querySelectorAll('.carousel-cell');
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

        checkForPermalink();
    }
}

const checkForPermalink = function() {
    const item = getParameterByName('item');

    if (item) {
        const cell = [].find.call(carouselCells, function(song) {
            return song.getAttribute('data-slug') === item;
        });

        const index = [].indexOf.call(carouselCells, cell);

        modal.style.display = 'block';
        flkty.resize();
        flkty.select(index);

        window.history.replaceState('', '', document.location.href.split('?')[0]);
    }
}

var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
    const item = document.querySelectorAll('.carousel-cell')[flkty.selectedIndex];
    const iframe = item.querySelector('iframe');

    if (iframe) {
        iframe.setAttribute('src', '');
    }
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     'use strict';
     if (this == null) {
       throw new TypeError('Array.prototype.find called on null or undefined');
     }
     if (typeof predicate !== 'function') {
       throw new TypeError('predicate must be a function');
     }
     var list = Object(this);
     var length = list.length >>> 0;
     var thisArg = arguments[1];
     var value;

     for (var i = 0; i < length; i++) {
       value = list[i];
       if (predicate.call(thisArg, value, i, list)) {
         return value;
       }
     }
     return undefined;
    }
  });
}

window.onload = onWindowLoaded;
