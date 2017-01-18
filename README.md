# metalsmith-rssfeed 
[![Build Status](https://travis-ci.org/mpolitze/metalsmith-rssfeed.svg?branch=master)](https://travis-ci.org/mpolitze/metalsmith-rssfeed)
[![npm version](https://badge.fury.io/js/metalsmith-rssfeed.svg)](https://badge.fury.io/js/metalsmith-rssfeed)

Yet another [metalsmith](https://github.com/segmentio/metalsmith) plugin to generate an RSS feeds.

Compatible with (but does not depend on): 
- [metalsmith-collections](https://github.com/segmentio/metalsmith-collections)
- [metalsmith-tags](https://github.com/totocaster/metalsmith-tags)
- [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks)
- [metalsmith-more](https://github.com/kfranqueiro/metalsmith-more) and 
- [metalsmith-excerpts](https://github.com/segmentio/metalsmith-excerpts)

## Installation
```
$ npm install metalsmith-rssfeed --save
```

## Usage
```javascript
var rssfeed     = require('metalsmith-rssfeed');

// create a rss feed from the first 20 elements of the collection posts
// and save it as feed.xml
metalsmith.use(reefeed({
    collection: "posts",
    limit: 20,
    name: "feed.xml",
});
```

## Examples
create a rss feed for containing every post with a specific tag and save it in one file per tag:

```javascript
metalsmith.use(reefeed({
    collectionKey: "tags",
    name: ":collection.xml",
});
```

create a rss feed for containing every post with a specific tag and save it in one file per tag:

```javascript
metalsmith.use(reefeed({
    collectionKey: "tags",
    name: ":collection.xml",
});
```

merge all tagged posts in a single feed alltags.xml:

```javascript
metalsmith.use(reefeed({
    title: 'Tagged Posts'
    description: 'All tagged posts are in this feed.'
    collectionKey: "tags",
    name: "alltags.xml",
});
```

## Options and default values
```javascript
{
    // filename of the rss feed. 
    // options.replaceToken will be replaced by the feed name when 
    // generating multiple feeds e.g. one for each tag.
    name: ':collection.xml',

    // ** feed options **
    // if not set explicitely will try to read these from metalsmith 
    // metadata like:
    // metadata[key] or metadata.site[key]

    // author of rss feed.    
    author: '',
    // title of rss feed.
    // options.replaceToken will be replaced by the feed name when 
    // generating multiple feeds e.g. one for each tag.
    title:  '',
    // description of rss feed.
    // options.replaceToken will be replaced by the feed name when 
    // generating multiple feeds e.g. one for each tag.
    description: '',
    // url of the site
    siteUrl: '',
    // generator of the rss feed.
    generator: 'metalsmith-rssfeed',
    // a custom function returning the feed options above.
    // other options will be ignored if this is set.
    feedOptions: (CollectionName, collection, options) => ({
            generator: options.generator,
            site_url: options.siteUrl,
            author: options.author.name || options.author,
            description: options.description.replace(o.replaceToken, c),
            title: options.title.replace(o.replaceToken, c),
            feed_url: options.pathToUrl(feedName)
    }),

    // ** feed items **

    // generate feed for a specific collection.
    // if it is an array will generate a feed for each item. 
    // if false generate for all colletions in options.collectionKey
    collection: false,
    // key to use to look for collections. 
    // defaults to 'collections' if options.collection was set. 
    collectionKey: o.collection ? 'collections' : false,
    // token to be replaced by collection name.
    replaceToken: ':collection',
    // pattern to filter files if neither collection nor
    // collection key were specified.
    pattern: '**';
    // key to permalink of file
    permalinkKey: 'permalink';
    // max number of items in the feed
    // if false all files are included.
    o.limit: false;
    // function to generate absolute url from file path
    pathToUrl: p => url.resolve(options.siteUrl, p);
    // a custom function to return the feed items
    // defaults will be ignored if this is set.
    itemOptions:  (file, options) => ({
            title: file.title,
            description: file.less || file.excerpt || file.contents,
            author: file.author.name || file.author,
            url: options.pathToUrl(file[options.permalinkKey] || file.path, options),
            date: file.date,            
            guid: file[options.permalinkKey] ? null : file.path
    })
```

## Notes

[metalsmith-feed](https://github.com/hurrymaplelad/metalsmith-feed) is another great feed creation plugin, however it strictly depends on collections.
