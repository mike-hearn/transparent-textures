#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals


AUTHOR = u'Mike Hearn'
SITENAME = u'Transparent Textures'
SITEURL = 'http://www.transparenttextures.com'
SITEDOMAIN = 'transparenttextures.com'

TIMEZONE = 'America/New_York'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

DEFAULT_PAGINATION = False

THEME = 'theme'

READERS = {'html': None}

PLUGIN_PATH = "plugins"
PLUGINS = ['tipue_search',]

PAGE_EXCLUDES = ((
	'node_modules',
	'bower_components',
	))
ARTICLE_EXCLUDES = ((
	'pages',
	'node_modules',
	'bower_components',
	))

EXTRA_PATH_METADATA = {
	'extra/favicon.png': {'path': 'favicon.png'},
}

TEMPLATE_PAGES = {'data.html' : 'data.json'}

GOOGLE_ANALYTICS = 'UA-48127789-1'