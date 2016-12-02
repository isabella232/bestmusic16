import Barba from 'barba.js';
import Flickity from 'flickity';
import template from 'lodash.template';
import Layzr from 'layzr.js';
import SONGS from './songs.json';

let songContainers = null;
let spotifyPlaylist = null;
let modal = null;
let modalOverlay = null;
let modalContent = null;
let carousel = null;
let closeModalButton = null;
let flkty = null;

let modalOpened = null;

let listButton = null;
let headerFavoriteButton = null;
let favoriteButtons = null;
let favorites = [];

let songContainerTemplate = null;
let sliderItemTemplate = null;

const isTouch = Modernizr.touchevents;
const imgRoot = 'http://media.npr.org/music/best-music-2016/'
const layzrInstance = Layzr({
    threshold: 10
});
const parser = new DOMParser();


const onWindowLoaded = function() {
    listButton = document.querySelector('button.lists');
    headerFavoriteButton = document.querySelector('button.favorites');
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length > 0) {
        headerFavoriteButton.querySelector('span').classList.add('filled');
    }

    layzrInstance
        .update()
        .check()
        .handlers(true)

    Barba.Dispatcher.on('newPageReady', attachEvents);
    Barba.Dispatcher.on('transitionCompleted', setUpLayzr);
    Barba.Pjax.start();
}

const attachEvents = function(currentStatus, prevStatus, container) {
    if (currentStatus.namespace === 'index') {
        listButton.style.display = "none";
    }

    if (currentStatus.namespace === 'favorites') {
        songContainerTemplate = container.querySelector('#song-container-template');
        layoutFavorites(container);
    }

    if (currentStatus.namespace === 'list' || currentStatus.namespace === 'favorites') {

        listButton.style.display = "block";

        songContainers = container.querySelectorAll('.song-wrapper');
        spotifyPlaylist = container.querySelector('.spotify-playlist');
        modal = container.querySelector('.modal');
        modalOverlay = container.querySelector('.modal-overlay');
        carousel = container.querySelector('.main-carousel');
        modalContent = container.querySelector('.modal-content');
        closeModalButton = container.querySelector('.window-close');

        sliderItemTemplate = template(container.querySelector('#slider-item').innerHTML);

        flkty = new Flickity(carousel, {
            pageDots: false,
            draggable: isTouch,
            dragThreshold: 50,
            setGallerySize: false,
            friction: isTouch ? 0.9 : 1,
            selectedAttraction: isTouch ? 0.2 : 1,
            lazyLoad: 1
        });
        flkty.on('settle', updateSlider);

        for (var i = 0; i < songContainers.length; i++) {
            songContainers[i].addEventListener('click', onSongClick);
        }

        if (spotifyPlaylist) {
            spotifyPlaylist.addEventListener('click', onSpotifyPlaylistClick);
        }
        closeModalButton.addEventListener('click', onCloseModalButtonClick);
        modalOverlay.addEventListener('click', onModalOverlayClick);

        checkForPermalink();
    }

    // track the pageview if this is not the initial page load

    if (Object.keys(prevStatus).length > 0) {
        ANALYTICS.trackPageview(currentStatus.url);
    }
}

const setUpLayzr = function(currentStatus) {
    layzrInstance.update();
    layzrInstance.check();
}

const checkForPermalink = function() {
    const slug = getParameterByName('item');

    if (slug) {
        const songContainer = [].find.call(songContainers, function(container) {
            return container.getAttribute('data-slug') === slug;
        })
        createSliderItems(songContainer);

        modal.style.display = 'block';
        setTimeout( function() { modalContent.classList.add('modal-show') }, 0);
        document.body.style.overflow = 'hidden';
        document.querySelector('#barba-wrapper').style.overflow = 'hidden';
        flkty.resize();
        flkty.select(1, false, true);

        window.history.replaceState('', '', document.location.href.split('?')[0]);
    }
}

const createSliderItems = function(selectedItem) {
    const parser = new DOMParser();
    const listName = document.querySelector('.list-title h2').textContent;

    const i = [].indexOf.call(songContainers, selectedItem);
    const items = [songContainers[i - 1], selectedItem, songContainers[i + 1]];
    const sliderItems = [];

    for (var j = 0; j < items.length; j++) {
        if (items[j]) {
            const slug = items[j].getAttribute('data-slug');
            const itemData = SONGS[slug]

            const itemDOM = parser.parseFromString(sliderItemTemplate({
               'item': itemData,
               'baseURL': APP_CONFIG.S3_BASE_URL,
               'listName': listName,
               'ranked': items[j].querySelector('h4') ? true : false
            }), 'text/html');
            const itemHTML = itemDOM.querySelector('.carousel-cell');

            sliderItems.push(itemHTML);
        }
    }

    for (var k = 0; k < sliderItems.length; k++) {
        if (sliderItems[k].getAttribute('data-slug') === selectedItem.getAttribute('data-slug')) {
            var thisIndex = k;
        }
    }

    flkty.append(sliderItems);

    bindClickEvents();

    setTimeout(function() {
        flkty.select(thisIndex, false, true);
    }, 0);
}

const bindClickEvents = function() {
    favoriteButtons = document.querySelectorAll('.modal-favorites');
    for (var i = 0; i < favoriteButtons.length; i++) {
        const el = favoriteButtons[i];

        if (favorites && favorites.indexOf(el.getAttribute('data-slug')) !== -1) {
            const span = el.querySelector('span');
            span.classList.add('filled');
            el.innerHTML = '';
            el.append(span);
            el.append(' Unfavorite');
        }

        favoriteButtons[i].addEventListener('click', onFavoriteButtonClick);
    }

    const smartURLs = document.querySelectorAll('.stream-link a');

    for (var i = 0; i < smartURLs.length; i++) {
        const el = smartURLs[i];
        smartURLs[i].addEventListener('click', onSmartURLClick);
    }
}

const getNewSlides = function() {
    const carouselCells = document.querySelectorAll('.carousel-cell');

    const createItemHTML = function(addItem) {
        var addItemSlug = addItem.getAttribute('data-slug');
        var item = SONGS[addItemSlug];
        const itemDOM = parser.parseFromString(sliderItemTemplate({
           'item': item,
           'baseURL': APP_CONFIG.S3_BASE_URL,
           'listName': listName,
           'ranked': addItem.querySelector('h4') ? true : false
        }), 'text/html');
        const itemHTML = itemDOM.querySelector('.carousel-cell');
        return itemHTML;
    }

    const listName = document.querySelector('.list-title h2').textContent;
    const slug = carouselCells[flkty.selectedIndex].getAttribute('data-slug');
    const listItem = [].find.call(songContainers, function(container) {
        return container.getAttribute('data-slug') === slug;
    })
    const listIndex = [].indexOf.call(songContainers, listItem);

    if (flkty.selectedIndex === 0 && carouselCells.length <= 3) {
        var addItem = songContainers[listIndex - 1];

        if (addItem) {
            const itemHTML = createItemHTML(addItem);

            flkty.prepend(itemHTML);
            flkty.remove(carouselCells[carouselCells.length - 1]);
        }

        trackViewedSlide();
    } else if (flkty.selectedIndex === carouselCells.length - 1) {
        var addItem = songContainers[listIndex + 1];

        if (addItem) {
            const itemHTML = createItemHTML(addItem);
            flkty.append(itemHTML);

            if (document.querySelectorAll('.carousel-cell').length > 3) {
                flkty.remove(document.querySelectorAll('.carousel-cell')[0]);
            }
        }

        trackViewedSlide();
    }
}

const trackViewedSlide = function() {
    const carouselCells = document.querySelectorAll('.carousel-cell');
    ANALYTICS.trackEvent('slide-viewed', carouselCells[flkty.selectedIndex].getAttribute('data-slug'));
}

const updateSlider = function() {
    handleEmbeds();

    if (modalOpened) {
        getNewSlides();
    }
    bindClickEvents();

    // don't have this set to true until we've settled once
    modalOpened = true;
}

const handleEmbeds = function() {
    // load current embed
    const item = document.querySelectorAll('.carousel-cell')[flkty.selectedIndex];
    const iframe = item.querySelector('iframe');

    if (iframe && !iframe.getAttribute('src')) {
        const src = iframe.getAttribute('data-src');
        iframe.setAttribute('src', src);
    }

    // unload adjacent embeds
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
    createSliderItems(this);

    modal.style.display = 'block';
    setTimeout( function() { modalContent.classList.add('modal-show') }, 0);

    document.body.style.overflow = 'hidden';
    document.querySelector('#barba-wrapper').style.overflow = 'hidden';

    flkty.resize();
    flkty.select([].indexOf.call(songContainers, this), false, true);
    handleEmbeds();
    ANALYTICS.trackEvent('item-selected', this.getAttribute('data-slug'));
    trackViewedSlide();
}

const onFavoriteButtonClick = function() {
    const slug = this.getAttribute('data-slug');
    if (favorites) {
        var favoriteIndex = favorites.indexOf(slug);
    }

    const span = this.querySelector('span');

    if (favorites && favoriteIndex > -1) {
        favorites.splice(favoriteIndex, 1);
        span.classList.remove('filled');
        this.innerHTML = '';
        this.append(span);
        this.append(' Favorite');
        ANALYTICS.trackEvent('item-unfavorited', slug);
    } else {
        favorites.push(slug);
        span.classList.add('filled');
        this.innerHTML = '';
        this.append(span);
        this.append(' Unfavorite');
        ANALYTICS.trackEvent('item-favorited', slug);
    }

    if (favorites.length > 0) {
        headerFavoriteButton.querySelector('span').classList.add('filled');
    } else {
        headerFavoriteButton.querySelector('span').classList.remove('filled');
    }

    const storageItem = JSON.stringify(favorites);
    localStorage.setItem('favorites', storageItem);
}

const onSmartURLClick = function() {
    ANALYTICS.trackEvent('smarturl-clicked', this.getAttribute('data-slug'));
}

const onSpotifyPlaylistClick = function() {
    ANALYTICS.trackEvent('spotify-playlist-clicked', this.getAttribute('data-slug'));
}

const onModalOverlayClick = function() {
    closeModal();
}

const onCloseModalButtonClick = function() {
    closeModal();
}

const closeModal = function() {
    modalContent.addEventListener('transitionend', hideModal);
    modalContent.classList.remove('modal-show');
}

const hideModal = function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.querySelector('#barba-wrapper').style.overflow = 'auto';

    const cells = document.querySelectorAll('.carousel-cell');
    flkty.remove(cells);
    modalOpened = false;
    modalContent.removeEventListener('transitionend', hideModal);
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
            if (songTypes.indexOf(item.type) === -1) {
                songTypes.push(item.type);
            }
        });

        const songTemplateCompiled = template(songContainerTemplate.innerHTML);
        const songDOM = parser.parseFromString(songTemplateCompiled({
           'favoriteItems': songObjects,
           'types': songTypes.length > 1 ? 'both' : songTypes[0]
        }), 'text/html');
        const songHTML = songDOM.querySelector('.list-container');
        container.querySelector('.favorites').append(songHTML);
    } else {
        container.querySelector('.no-content').style.display = 'block';
    }
}

// utils

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

var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.onload = onWindowLoaded;
