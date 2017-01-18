(function(){
var minimatch = require('minimatch');
var url = require('url');

helpers = {

    ensureOptions: (o, metadata) =>{
        o = o || {};
        metadata = metadata || {};

        o.name          = o.name            || ':collection.xml';

        o.author        = o.author          || metadata.author        || '';
        o.title         = o.title           || metadata.title         || '';
        o.description   = o.description     || metadata.description   || '';
        o.siteUrl       = o.siteUrl         || metadata.siteUrl       || '';
        o.generator 	= o.generator		|| 'metalsmith-rss';
        
        o.feedOptions	= helpers.ensureFunc(o.feedOptions || helpers.collectionToFeed);

        o.collection    = o.collection ? helpers.ensureArray(o.collection) : false;
        o.collectionKey = o.collectionKey   || o.collection ? 'collections' : false;		
        o.replaceToken  = o.replaceToken 	|| ':collection';
        o.pattern       = new minimatch.Minimatch(o.pattern || '**');

        o.permalinkKey  = o.permalinkKey    || 'permalink';

        o.limit         = o.limit           || false;

        o.pathToUrl     = o.pathToUrl       || helpers.resolveUrl;
        
        o.itemOptions	= helpers.ensureFunc(o.itemOptions || helpers.fileToItem);

        return o;
    },

    resolveUrl: (p, o) => url.resolve(o.siteUrl || '', p || ''),

    fileToItem: (file, o) => ({
            title: file.title || '',
            description: (file.less || file.excerpt || file.contents || '').toString(),
            author: (typeof file.author == 'object' ? file.author.name : file.author) || '',
            url: file[o.permalinkKey] ? o.pathToUrl(file[o.permalinkKey], o) : o.pathToUrl(file.path || '', o),
            date: file.date || '',            
            guid: file[o.permalinkKey] ? null : file.path
    }),

    collectionToFeed: (c, cc, o) => ({
            generator: o.generator,
            site_url: o.siteUrl,
            //author: o.author.name || o.author,
            author: (typeof o.author == 'object' ? o.author.name : o.author) || '',
            description: o.description.replace(o.replaceToken, c),
            title: o.title.replace(o.replaceToken, c),
            feed_url: o.pathToUrl(o.name.replace(o.replaceToken, c), o)
    }),

    ensureFunc: o => typeof o == 'function' ? o : () => o,

    ensureArray: o => o !== undefined ? [].concat(o) : [],
};

module.exports = helpers;

})();