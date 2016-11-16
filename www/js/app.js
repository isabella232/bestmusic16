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
    favorites.push(slug);
    const storageItem = JSON.stringify(favorites);
    localStorage.setItem('favorites', storageItem);
    headerFavoriteButton.querySelector('span').classList.add('filled');
}

const onModalClick = function() {
    modal.style.display = 'none';
}

const layoutFavorites = function(container) {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    if (favorites) {
        container.querySelector('.no-content').style.display = 'none';
        const parser = new DOMParser();

        let songObjects = [];
        favorites.forEach(function(item) {
            songObjects.push(SONGS[item]);
        });

        const songTemplateCompiled = template(songContainerTemplate.innerHTML);
        const modalTemplateCompiled = template(modalTemplate.innerHTML);

        const songHTML = parser.parseFromString(songTemplateCompiled({
           'favoriteItems': songObjects 
        }), 'text/html');
        const modalHTML = parser.parseFromString(modalTemplateCompiled({
           'favoriteItems': songObjects 
        }), 'text/html');

        container.querySelector('.list-container').append(songHTML.querySelector('.songs-container'));
        container.querySelector('.modal').append(modalHTML.querySelector('.modal-overlay'));
        container.querySelector('.modal').append(modalHTML.querySelector('.modal-content'));
    }
}

window.onload = onWindowLoaded;
