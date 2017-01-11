(function(){

var url = require('url');

module.exports = {

    resolveUrl: (p, o) => url.resolve(o.siteUrl || '', p || ''),

    fileToItem: (file, o) => ({
            title: file.title || '',
            description: (file.less || file.excerpt || file.contents || '').toString(),
            author: file.author || '',
            url: o.pathToUrl(file.path || ''),
            date: file.date || '',
            permalink: file[o.permalinkKey] ? o.pathToUrl(file[o.permalinkKey]) : null
    }),

    collectionToFeed: (c, cc, o) => ({
            generator: o.generator,
            site_url: o.siteUrl,
            author: o.author,
            description: o.description.replace(o.replaceToken, c),
            title: o.title.replace(o.replaceToken, c),
            feed_url: o.pathToUrl(o.name.replace(o.replaceToken, c), o)
    }),

    ensureFunc: o => typeof o == 'function' ? o : () => o,

    ensureArray: o => [].concat(o),
};

})();