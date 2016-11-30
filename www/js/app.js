import Barba from 'barba.js';
import Flickity from 'flickity';
import template from 'lodash.template';
import Layzr from 'layzr.js';
import SONGS from './songs.json';

let songContainers = null;
let modal = null;
let modalOverlay = null;
let modalContent = null;
let carousel = null;
let carouselCells = null;
let closeModalButtons = null;
let loadableImages = null;
let flkty = null;

let listButton = null;
let headerFavoriteButton = null;
let favoriteButtons = null;
let favorites = [];

let songContainerTemplate = null;
let modalTemplate = null;
let sliderItemTemplate = null;

const isTouch = Modernizr.touchevents;
const imgRoot = 'http://media.npr.org/music/best-music-2016/'
const layzrInstance = Layzr({
    threshold: 10
});


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
        modalContent = container.querySelector('.modal-content');
        carouselCells = container.querySelectorAll('.carousel-cell');
        closeModalButtons = container.querySelectorAll('.window-close');
        loadableImages = container.querySelectorAll('img.art');
        sliderItemTemplate = container.querySelector('#slider-item');

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

        for (var i = 0; i < closeModalButtons.length; i++) {
            closeModalButtons[i].addEventListener('click', onCloseModalButtonClick);
        }

        modalOverlay.addEventListener('click', onModalOverlayClick);

        // loadImages();
        checkForPermalink();
    }
}

const setUpLayzr = function() {
    layzrInstance.update();
    layzrInstance.check();
}

const loadImages = function() {
    for (var i = 0; i < loadableImages.length; i++) {
        const img = loadableImages[i];
        const dataSrc = img.getAttribute('data-src');
        const filename = dataSrc.split('.')[0];
        const ext = dataSrc.split('.')[1];
        const realSrc = imgRoot + filename + '-s200-c85.' + ext;

        img.setAttribute('src', realSrc);
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

const updateSlider = function() {
    handleEmbeds();

    const parser = new DOMParser();
    const temp = template(sliderItemTemplate.innerHTML);
    const baseURL = document.location.host;
    const listName = document.querySelector('.list-title h2').textContent;
    
    carouselCells = document.querySelectorAll('.carousel-cell');
    const slug = carouselCells[flkty.selectedIndex].getAttribute('data-slug');
    const listItem = [].find.call(songContainers, function(container) {
        return container.getAttribute('data-slug') === slug;
    })
    const listIndex = [].indexOf.call(songContainers, listItem);
    
    if (flkty.selectedIndex === 0 && carouselCells.length <= 3) {        
        var addItem = songContainers[listIndex - 1];
        var addItemSlug = addItem.getAttribute('data-slug');
        var item = SONGS[addItemSlug];
        const itemDOM = parser.parseFromString(temp({
           'item': item,
           'baseURL': baseURL,
           'listName': listName
        }), 'text/html');
        const itemHTML = itemDOM.querySelector('.carousel-cell');

        flkty.prepend(itemHTML);
        flkty.remove(carouselCells[carouselCells.length - 1]);
    } else if (flkty.selectedIndex === carouselCells.length - 1) {
        var addItem = songContainers[listIndex + 1];
        var addItemSlug = addItem.getAttribute('data-slug');
        var item = SONGS[addItemSlug];
        const itemDOM = parser.parseFromString(temp({
           'item': item,
           'baseURL': baseURL,
           'listName': listName
        }), 'text/html');
        const itemHTML = itemDOM.querySelector('.carousel-cell');
        flkty.append(itemHTML);

        if (document.querySelectorAll('carousel-cell').length > 3) {
            flkty.remove(carouselCells[0]);
        }
    }


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
    createSliderItem(this);

    modal.style.display = 'block';
    setTimeout( function() { modalContent.classList.add('modal-show') }, 0);

    document.body.style.overflow = 'hidden';

    flkty.resize();
    flkty.select([].indexOf.call(songContainers, this), false, true);
    handleEmbeds();
}

const createSliderItem = function(clickedItem) {
    const parser = new DOMParser();
    const temp = template(sliderItemTemplate.innerHTML);
    const baseURL = document.location.host;
    const listName = document.querySelector('.list-title h2').textContent;

    const i = [].indexOf.call(songContainers, clickedItem);
    const items = [songContainers[i - 1], clickedItem, songContainers[i + 1]];
    const sliderItems = [];
    
    for (var j = 0; j < items.length; j++) {
        if (items[j]) {
            const slug = items[j].getAttribute('data-slug');
            const itemData = SONGS[slug]

            const itemDOM = parser.parseFromString(temp({
               'item': itemData,
               'baseURL': baseURL,
               'listName': listName
            }), 'text/html');
            const itemHTML = itemDOM.querySelector('.carousel-cell');

            sliderItems.push(itemHTML);
        }
    }

    for (var k = 0; k < sliderItems.length; k++) {
        if (sliderItems[k].getAttribute('data-slug') === clickedItem.getAttribute('data-slug')) {
            var thisIndex = k;
        }
    }

    flkty.append(sliderItems);
    setTimeout(function() {
        flkty.select(thisIndex, false, true);
    }, 0);
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
    } else {
        favorites.push(slug);
        span.classList.add('filled');
        this.innerHTML = '';
        this.append(span);
        this.append(' Unfavorite');
    }

    if (favorites.length > 0) {
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
    modalContent.addEventListener('transitionend', hideModal);
    modalContent.classList.remove('modal-show');
}

const hideModal = function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    const cells = document.querySelectorAll('.carousel-cell');
    flkty.remove(cells);

    modalContent.removeEventListener('transitionend', hideModal);
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
