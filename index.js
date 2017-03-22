module.exports = function(o){
    var RSS = require('rss');
    
    var helpers = require('./helpers.js');

    return function(files, metalsmith, done){
        var md = metalsmith.metadata();
        var siteMd = md.site || md;

        o = helpers.ensureOptions(o, siteMd);

        var collections = {};
        var feeds = {};

        if(o.collection){
            for(var c of o.collection){
                collections[c] = md[o.collectionKey][c];
            }
        }else if(o.collectionKey){
            collections = md[o.collectionKey];
        }else{
            collections.feed = [];
            for(var f in files){
                if(o.pattern.match(f)){
                    collections.feed.push(files[f]);
                }
            }
        }
        
        for(var c in collections){
            var feedName = o.name.replace(o.replaceToken, c);
            var collection = collections[c];
            
            if(!feeds[feedName]){
                var feedOptions = o.feedOptions(c, collection, o);
                feeds[feedName] = new RSS(feedOptions);
            }
            var feed = feeds[feedName];
            
            if(o.limit){
                collection = collection.slice(0, o.limit);				
            }
                    
            for(var i in collection){
                var file = collection[i];
                
                if (isNaN(i) || file == null)
                    continue;
                    
                if(!o.collection || file.collection == o.collection){
                    var item = o.itemOptions(file, o);
                    feed.item(item);
                }
            }
        }
        
        for(var f in feeds){
            files[f] = {
                contents: Buffer.from(feeds[f].xml(), 'utf8')
            };
        }
        
        done();
    }
}