import maquette from 'maquette';

const h = maquette.h;
const projector = maquette.createProjector();
const lists = [
    {
        'title': 'Best 50 Albums',
        'items': [
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
        ]
    },
    {
        'title': 'Top 100 Songs',
        'items': [
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
                        {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',

            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
        ]
    },
    {
        'title': 'Bob Boilen\'s Favorite Music of 2016',
        'items': [
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
            {
                'artist': 'Solange',
                'title': 'A Seat At The Table',
                'type': 'album',
            },
            {
                'artist': 'Super Unison',
                'title': 'Auto',
                'type': 'album',
            },
            {
                'artist': 'Chance The Rapper',
                'title': 'Coloring Book',
                'type': 'album',
            },
        ]
    }
]

let appContainer = null;
let renderedLists = null;

const onWindowLoaded = function() {
    appContainer = document.querySelector('.app');
    renderedLists = lists.map(list => createList(list));
    projector.append(appContainer, renderMaquette);
}

const createList = function(list) {
    const listItems = list.items.map(item => createListItem(item))

    const listContainer = {
        renderMaquette: function() {
            return h('div.list-container', [
                h('h2', list.title),
                h('div.list-scroll-wrapper', [
                    h('div.list', {
                        style: "min-width: " + listItems.length * 222 + 'px;'
                    }, [
                        listItems.map(item => item.renderMaquette())
                    ]),
                    h('div.prev.nav-button', {
                        onclick: onNavButtonClick
                    }),
                    h('div.next.nav-button', {
                        onclick: onNavButtonClick
                    })
                ])
            ]);
        }
    }

    return listContainer;
}

const createListItem = function(item) {
    const ListItem = {
        renderMaquette: function() {
            return h('div.item', {
                classes: {
                    'album': item.type === 'album',
                    'song': item.type === 'song'
                }
            }, [
                h('img', {
                    src: 'assets/' + classify(item.title) + '.jpg'
                }),
                h('h4', item.artist),
                h('h5', item.title),
            ])
        }
    }

    return ListItem;
}

const renderMaquette = function() {
    return h('div.app-container', [
        renderedLists.map(list => list.renderMaquette())
    ]);
}

const classify = function(str) {
    return str.toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const onNavButtonClick = function(e) {
    const list = e.target.parentNode.querySelector('.list');
    const width = list.offsetWidth;
    const screenLeft = width - screen.width;
    const availableSlots = Math.floor(screen.width / 222);
    const currentTransform = parseInt(getComputedStyle(list)['transform'].substr(7).split(', ')[4]);

    let transformWidth = -(availableSlots * 222);

    if (e.target.classList.contains('prev')) {
        if (currentTransform) {
            transformWidth = currentTransform - transformWidth;
        } else {
            return;
        }

        if (transformWidth > 0) {
            list.style.transform = 'none';
        } else {
            list.style.transform = 'translateX(' + transformWidth + 'px)';
        }

    } else {
        if (currentTransform) {
            transformWidth = currentTransform + transformWidth;
        }

        if (-(transformWidth) > screenLeft) {
            transformWidth = -(screenLeft);
        }

        list.style.transform = 'translateX(' + transformWidth + 'px)';
    }
}

window.onload = onWindowLoaded;