import Barba from 'barba.js';
import Flickity from 'flickity';
import template from 'lodash.template';
import SONGS from './songs.json';

let songContainers = null;
let modal = null;
let modalOverlay = null;
let carousel = null;
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
    favorites = JSON.parse(localStorage.getItem('favorites'));
    if (favorites) {
        headerFavoriteButton.querySelector('span').classList.add('filled');
    }

    Barba.Dispatcher.on('newPageReady', attachEvents);
    Barba.Pjax.start();
}

const attachEvents = function(currentStatus, prevStatus, container) {
    if (currentStatus.namespace === 'index') {
        listButton.style.display = "none";
    }

    if (currentStatus.namespace === 'favorites') {
        songContainerTemplate = container.querySelector('#song-container-template');
        modalTemplate = container.querySelector('#modal-template');
        layoutFavorites(container);
    }

    if (currentStatus.namespace === 'list' || currentStatus.namespace === 'favorites') {
        listButton.style.display = "block";
        songContainers = document.querySelectorAll('.song-wrapper');
        modal = document.querySelector('.modal');
        modalOverlay = document.querySelector('.modal-overlay');
        carousel = document.querySelector('.main-carousel');
        favoriteButtons = document.querySelectorAll('.favorite-btn');
        
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

        for (var i = 0; i < favoriteButtons.length; i++) {
            const el = favoriteButtons[i];

            if (favorites.indexOf(el.parentNode.parentNode.getAttribute('data-slug')) !== -1) {
                el.querySelector('span').classList.add('filled');
            }

            favoriteButtons[i].addEventListener('click', onFavoriteButtonClick);
        }

        modalOverlay.addEventListener('click', onModalClick);
    }
}

const onSongClick = function() {
    modal.style.display = 'block';
    flkty.resize();
    flkty.select([].indexOf.call(songContainers, this), false, true);
}

const onFavoriteButtonClick = function() {
    const slug = this.parentNode.parentNode.getAttribute('data-slug');
    const favoriteIndex = favorites.indexOf(slug);
    
    // not a favorite yet
    if (favoriteIndex === -1) {
        favorites.push(slug);
        this.querySelector('span').classList.add('filled');
    } else {
        favorites.splice(favoriteIndex, 1);
        this.querySelector('span').classList.remove('filled');
    }

    if (favorites.length > 0) {
        headerFavoriteButton.querySelector('span').classList.add('filled');
    } else {
        headerFavoriteButton.querySelector('span').classList.remove('filled');
    }

    const storageItem = JSON.stringify(favorites);
    localStorage.setItem('favorites', storageItem);
}

const onModalClick = function() {
    modal.style.display = 'none';
}

const layoutFavorites = function(container) {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
    console.log(storedFavorites);
    if (storedFavorites.length > 0) {
        container.querySelector('.no-content').style.display = 'none';
        const parser = new DOMParser();

        let songObjects = [];
        storedFavorites.forEach(function(item) {
            songObjects.push(SONGS[item]);
        });

        let songTypes = [];
        songObjects.forEach(function(item) {
            if (songTypes.indexOf(item.type) === -1) {
                songTypes.push(item.type);
            }
        });

        const songTemplateCompiled = template(songContainerTemplate.innerHTML);
        const modalTemplateCompiled = template(modalTemplate.innerHTML);

        const songDOM = parser.parseFromString(songTemplateCompiled({
           'favoriteItems': songObjects,
           'types': songTypes.length > 1 ? 'both' : 'single'
        }), 'text/html');
        const modalDOM = parser.parseFromString(modalTemplateCompiled({
           'favoriteItems': songObjects
        }), 'text/html');

        const songHTML = songDOM.querySelector('.list-container');
        const modalOverlayHTML = modalDOM.querySelector('.modal-overlay')
        const modalContentHTML = modalDOM.querySelector('.modal-content')

        container.querySelector('.favorites').append(songHTML);
        container.querySelector('.modal').append(modalOverlayHTML);
        container.querySelector('.modal').append(modalContentHTML);
    } else {
        container.querySelector('.no-content').style.display = 'block';
    }
}

window.onload = onWindowLoaded;
