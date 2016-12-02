#!/usr/bin/env python
"""
Example application views.

Note that `render_template` is wrapped with `make_response` in all application
routes. While not necessary for most Flask apps, it is required in the
App Template for static publishing.
"""

import app_config
import logging
import oauth
import static

from flask import Flask, make_response, render_template
from render_utils import make_context, smarty_filter, urlencode_filter
from werkzeug.debug import DebuggedApplication

app = Flask(__name__)
app.debug = app_config.DEBUG

app.add_template_filter(smarty_filter, name='smarty')
app.add_template_filter(urlencode_filter, name='urlencode')

logging.basicConfig(format=app_config.LOG_FORMAT)
logger = logging.getLogger(__name__)
logger.setLevel(app_config.LOG_LEVEL)

@app.route('/')
@oauth.oauth_required
def index():
    """
    Example view demonstrating rendering a simple HTML page.
    """
    context = make_context()
    context['namespace'] = 'index'
    return make_response(render_template('index.html', **context))

@app.route('/list/<slug>/')
@oauth.oauth_required
def list(slug):
    """
    Example view demonstrating rendering a simple HTML page.
    """
    context = make_context(asset_depth=2)
    underscores = slug.replace('-', '_')

    context['slug'] = underscores
    types_found = []
    for row in context['COPY'][underscores]:
        if row['type'] not in types_found:
            types_found.append(row['type'])

    if len(types_found) >= 2:
        context['types'] = 'both'
    else:
        context['types'] = types_found[0]

    context['namespace'] = 'list'

    for row in context['COPY']['best_lists']:
        if row['slug'] == slug:
            context['list_name'] = row['list_name']
            context['list_description'] = row['description']
            context['playlist'] = row['spotify']
            context['art'] = row['art']

    for row in context['COPY']['deeper_lists']:
        if row['slug'] == slug:
            context['list_name'] = row['list_name']
            context['list_description'] = row['description']
            context['playlist'] = row['spotify']
            context['art'] = row['art']

    try:
        test_float = float(context['COPY'][underscores][0]['sort'])
        context['ranked'] = True
    except:
        context['ranked'] = False


    return make_response(render_template('list.html', **context))

@app.route('/favorites/')
@oauth.oauth_required
def favorites():
    """
    Example view demonstrating rendering a simple HTML page.
    """
    context = make_context(asset_depth=1)
    context['namespace'] = 'favorites'

    return make_response(render_template('favorites.html', **context))

@app.route('/share/')
@oauth.oauth_required
def share():
    context = make_context(asset_depth=1)

    context['lists'] = {}

    for row in context['COPY']['best_lists']:
        underscores = row['slug'].replace('-', '_')
        context['lists'][row['slug']] = context['COPY'][underscores]

    for row in context['COPY']['deeper_lists']:
        underscores = row['slug'].replace('-', '_')
        context['lists'][row['slug']] = context['COPY'][underscores]

    return make_response(render_template('share.html', **context))    

app.register_blueprint(static.static)
app.register_blueprint(oauth.oauth)

# Enable Werkzeug debug pages
if app_config.DEBUG:
    wsgi_app = DebuggedApplication(app, evalex=False)
else:
    wsgi_app = app

# Catch attempts to run the app directly
if __name__ == '__main__':
    logging.error('This command has been removed! Please run "fab app" instead!')
