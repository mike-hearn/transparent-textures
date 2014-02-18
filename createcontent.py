#!/usr/bin/env python

import os
import requests
import re
import argparse
from datetime import datetime

# Set up arguments
parser = argparse.ArgumentParser(description='Grabs the pattern info from Subtle Patterns.')
parser.add_argument('-i','--input', help='Input site.', required=True)
args = vars(parser.parse_args())

original = args['input']

content = requests.get(original).content

title = re.findall('<h2>(.*)</h2>', content)[0].title()
date = datetime.now().strftime("%Y-%m-%d %H:%I:%S")
imgur = ""
slug = title.lower().replace(' ','-')
try:
	authorsite, author = re.findall('Made by.+?<a href="(.+?)".*>(.*)</a>',content)[0]
except IndexError:
	author = re.findall('Made by (.+?)\.',content)[0]
	authorsite = ''

print title
print slug
print author
print authorsite
print original+"\n"

filename = './content/' + slug + '.md'
if os.path.isfile(filename):
	print "Error: file exists."
	exit()
writefile = open(filename,'w')

writefile.write("title: %s\n" % title)
writefile.write("date: %s\n" % date)
writefile.write("imgur: %s\n" % imgur)
writefile.write("slug: %s\n" % slug)
writefile.write("author: %s\n" % author)
writefile.write("authorsite: %s\n" % authorsite)
writefile.write("original: %s\n" % original)

writefile.close()
