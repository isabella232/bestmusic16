import Barba from 'barba.js';
import Flickity from 'flickity';
import template from 'lodash.template';
import SONGS from './songs.json';

let songContainers = null;
let modal = null;
let modalOverlay = null;
let carousel = null;
let carouselCells = null;
let closeModalButtons = null;
let flkty = null;
let listButton = null;
let headerFavoriteButton = null;
let favoriteButtons = null;
let favorites = [];
let songContainerTemplate = null;
let modalTemplate = null;

const isTouch = Modernizr.touchevents;

const onWindowLoaded = function() {
    listButton = document.querySelector('button.lists');
    headerFavoriteButton = document.querySelector('button.favorites');
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites) {
        headerFavoriteButton.querySelector('span').classList.add('filled');
    }

    Barba.Dispatcher.on('newPageReady', attachEvents);
    Barba.Pjax.start();
}

const attachEvents = function(currentStatus, prevStatus, container) {
    if (currentStatus.namespace === 'index') {
        listButton.style.display = "none";
        initSponsorship();
    }

    if (currentStatus.namespace === 'favorites') {
        songContainerTemplate = container.querySelector('#song-container-template');
        modalTemplate = container.querySelector('#modal-template');
        layoutFavorites(container);
    }

    if (currentStatus.namespace === 'list' || currentStatus.namespace === 'favorites') {
        listButton.style.display = "block";

        songContainers = container.querySelectorAll('.song-wrapper');
        modal = container.querySelector('.modal');
        modalOverlay = container.querySelector('.modal-overlay');
        carousel = container.querySelector('.main-carousel');
        favoriteButtons = container.querySelectorAll('.modal-favorites');
        carouselCells = container.querySelectorAll('.carousel-cell');
        closeModalButtons = container.querySelectorAll('.window-close');
        
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

        for (var i = 0; i < favoriteButtons.length; i++) {
            const el = favoriteButtons[i];

            if (favorites && favorites.indexOf(el.parentNode.parentNode.parentNode.getAttribute('data-slug')) !== -1) {
                el.querySelector('span').classList.add('filled');
            }

            favoriteButtons[i].addEventListener('click', onFavoriteButtonClick);
        }

        for (var i = 0; i < closeModalButtons.length; i++) {
            closeModalButtons[i].addEventListener('click', onCloseModalButtonClick);
        }

        modalOverlay.addEventListener('click', onModalOverlayClick);

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

const onFavoriteButtonClick = function() {
    const slug = this.getAttribute('data-slug');
    if (favorites) {
        var favoriteIndex = favorites.indexOf(slug);
    }    
    // not a favorite yet
    if (favorites && favoriteIndex > -1) {
        favorites.splice(favoriteIndex, 1);
        this.querySelector('span').classList.remove('filled');
    } else {
        favorites.push(slug);
        this.querySelector('span').classList.add('filled');
    }

    if (favorites) {
        headerFavoriteButton.querySelector('span').classList.add('filled');
    } else {
        headerFavoriteButton.querySelector('span').classList.remove('filled');
    }

    const storageItem = JSON.stringify(favorites);
    localStorage.setItem('favorites', storageItem);
}

const onModalOverlayClick = function() {
    closeModal();
}

const onCloseModalButtonClick = function() {
    closeModal();
}

const closeModal = function() {
    modal.style.display = 'none';
    const item = document.querySelectorAll('.carousel-cell')[flkty.selectedIndex];
    const iframe = item.querySelector('iframe');

    if (iframe) {
        iframe.setAttribute('src', '');
    }
}

const initSponsorship = function() {
    refreshSlot('amazon1');
    googletag.cmd.push(function() {
      googletag.display('amazon1');
    });
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

const layoutFavorites = function(container) {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (storedFavorites.length > 0) {
        container.querySelector('.no-content').style.display = 'none';
        const parser = new DOMParser();

        let songObjects = [];
        storedFavorites.forEach(function(item) {
            songObjects.push(SONGS[item]);
        });

        let songTypes = [];
        songObjects.forEach(function(item) {
            console.log(item);
            if (songTypes.indexOf(item.type) === -1) {
                songTypes.push(item.type);
            }
        });

        const songTemplateCompiled = template(songContainerTemplate.innerHTML);
        const songDOM = parser.parseFromString(songTemplateCompiled({
           'favoriteItems': songObjects,
           'types': songTypes.length > 1 ? 'both' : 'single'
        }), 'text/html');
        const songHTML = songDOM.querySelector('.list-container');
        container.querySelector('.favorites').append(songHTML);


        // build the modal in the order that the page was laid out
        const items = container.querySelectorAll('.song-wrapper');
        let orderedItems = [];
        [].forEach.call(items, function(item) {
            orderedItems.push(item.getAttribute('id'));
        });
        let modalObjects = [];
        orderedItems.forEach(function(item) {
            modalObjects.push(SONGS[item]);
        });

        const modalTemplateCompiled = template(modalTemplate.innerHTML);
        const modalDOM = parser.parseFromString(modalTemplateCompiled({
           'favoriteItems': modalObjects
        }), 'text/html');
        const modalOverlayHTML = modalDOM.querySelector('.modal-overlay')
        const modalContentHTML = modalDOM.querySelector('.modal-content')

        container.querySelector('.modal').append(modalOverlayHTML);
        container.querySelector('.modal').append(modalContentHTML);
    } else {
        container.querySelector('.no-content').style.display = 'block';
    }
}

window.onload = onWindowLoaded;
