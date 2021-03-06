#!/usr/bin/env python

"""
Commands related to syncing copytext from Google Docs.
"""

import app_config
import copytext
import json
import logging

from fabric.api import task
from oauth import get_document, get_credentials

logging.basicConfig(format=app_config.LOG_FORMAT)
logger = logging.getLogger(__name__)
logger.setLevel(app_config.LOG_LEVEL)

@task(default=True)
def update():
    """
    Downloads a Google Doc as an Excel file.
    """
    if app_config.COPY_GOOGLE_DOC_KEY == None:
        logger.warn('You have set COPY_GOOGLE_DOC_KEY to None. If you want to use a Google Sheet, set COPY_GOOGLE_DOC_KEY  to the key of your sheet in app_config.py')
        return

    credentials = get_credentials()
    if not credentials:
        print logger.warn('No Google OAuth credentials file found.')
        print logger.warn('Run `fab app` and visit `http://localhost:8000` to generate credentials.')
        return

    get_document(app_config.COPY_GOOGLE_DOC_KEY, app_config.COPY_PATH)
    with open('www/js/songs.json', 'w') as f:
        sheet = copytext.Copy(app_config.COPY_PATH)
        all_lists = list(sheet['best_lists']) + list(sheet['deeper_lists'])
        all_songs = {}

        for row in all_lists:
            if row['slug']:
                slug = row['slug'].replace('-', '_')
                songs = sheet[slug]
                for song in songs:
                    if all_songs.get(song['song_slug']):
                        continue

                    song_obj = {}
                    song_obj['sort'] = song['sort']
                    song_obj['artist'] = song['artist']
                    song_obj['title'] = song['title']

                    if song['song_slug'] == 'big-thief-masterpiece' and song['type'] == 'album':
                        song_obj['song_slug'] = 'big-thief-masterpiece-album'
                    elif song['song_slug'] == 'big-thief-masterpiece' and song['type'] == 'song':
                        song_obj['song_slug'] = 'big-thief-masterpiece-song'
                    else:
                        song_obj['song_slug'] = song['song_slug']

                    song_obj['description'] = song['description']
                    song_obj['art'] = song['art']
                    song_obj['author'] = song['author']
                    song_obj['author_twitter'] = song['author_twitter']
                    song_obj['affiliation'] = song['affiliation']
                    song_obj['explicit'] = song['explicit']
                    song_obj['filed_under'] = song['filed_under']
                    song_obj['type'] = song['type']    
                    song_obj['smarturl'] = song['smarturl']
                    song_obj['embed'] = song['embed'].replace('watch?v=', 'embed/')
                    song_obj['embed_type'] = song['embed_type']
                    song_obj['embed_caption'] = song['embed_caption']
                    all_songs[song_obj['song_slug']] = song_obj

        output = json.dumps(all_songs)
        f.write(output)
