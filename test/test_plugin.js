var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var chaiXml = require('chai-xml');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

chai.use(chaiXml);

chai.use(function(c){
    c.Assertion.addMethod('xpath', function(p){
        var doc = new dom().parseFromString(this._obj);
        var nodes = xpath.select(p, doc);
        this.assert(nodes.length > 0, 
         `Expected \n\n${doc}\n\n  to have xpath '${p}'`,
         `Expected \n\n${doc}\n\n  to not have xpath '${p}'`)
    })
});

var rssfeed = require('../');

var MetalsmithFake = function(metadata){
    this.md = metadata || {};
};
MetalsmithFake.prototype.metadata = function(){
    return this.md;
}

describe('metalsmith-rssfeed plugin', function() {
    describe('is a metalsmith plugin if', function(){
        it('it has the correct type', function(done){
            expect(typeof rssfeed).to.equal('function');
            expect(typeof rssfeed()).to.equal('function');
            done();
        });
    });

    describe('works with default options', function(){
        it('should add feed.xml', function(done){
            var files = {};
            var metalsmith = new MetalsmithFake();
            var f = rssfeed();
            f(files, metalsmith, function(){  
                expect(files).to.have.property('feed.xml');
                expect(files['feed.xml']).to.have.property('contents');
                expect(files['feed.xml'].contents.toString()).xml.to.be.valid();
                done();
            });
        });

        it('should get feed metadata from metalsmith metadata', function(done){
            var files = {};
            var metalsmith = new MetalsmithFake({
                author: 'TheAuthor',
                title: 'TheTitle',
                description: 'TheDescription',
                siteUrl: 'TheSiteUrl'
            });
            var f = rssfeed();
            f(files, metalsmith, function(){  
                expect(files['feed.xml'].contents.toString()).to.have.xpath("rss/channel[contains(author, 'TheAuthor')]");
                expect(files['feed.xml'].contents.toString()).to.have.xpath("rss/channel[contains(title, 'TheTitle')]");
                expect(files['feed.xml'].contents.toString()).to.have.xpath("rss/channel[contains(description, 'TheDescription')]");
                expect(files['feed.xml'].contents.toString()).to.have.xpath("rss/channel[contains(link, 'TheSiteUrl')]");
                done();
            });
        });

        it('should generate one feed item per file', function(done){
            var files = {
                file1: {},
                file2: {}
            };
            var metalsmith = new MetalsmithFake();
            var f = rssfeed();
            f(files, metalsmith, function(){  
                expect(files['feed.xml'].contents.toString()).to.have.xpath("(//item)[1]");
                expect(files['feed.xml'].contents.toString()).to.have.xpath("(//item)[2]");
                done();
            });
        });

        it('should generate one item metadata from file without permalink', function(done){
            var files = {
                file1: {
                    title: "TheItemTitle",
                    less: "Some text to begin with",
                    author: "TheItemAutor",
                    path: "./The/Item/Path",
                    date: Date.UTC(2014, 6, 5, 13, 30, 23, 00),
                }
            };
            var metalsmith = new MetalsmithFake({
                siteUrl: "http://example.com/items/"
            });
            var f = rssfeed();
            f(files, metalsmith, function(){  
                var contents = files['feed.xml'].contents.toString();
                expect(contents).to.have.xpath("(//item)[1][contains(title, 'TheItemTitle')]");
                expect(contents).to.have.xpath("(//item)[1][contains(description, 'Some text to begin with')]");
                expect(contents).to.have.xpath("(//item)[1]/*[local-name()='creator' and contains(., 'TheItemAutor')]");
                expect(contents).to.have.xpath("(//item)[1][contains(link, 'http://example.com/items/The/Item/Path')]");
                expect(contents).to.have.xpath("(//item)[1][contains(pubDate, 'Sat, 05 Jul 2014 13:30:23 GMT')]");
                expect(contents).to.have.xpath("(//item)[1]/guid[contains(., './The/Item/Path') and @isPermaLink='false']");
                done();
            });
        });

        it('should generate one item metadata from file with permalink', function(done){
            var files = {
                file1: {
                    title: "TheItemTitle",
                    less: "Some text to begin with",
                    author: "TheItemAutor",
                    path: "./The/Item/Path",
                    date: Date.UTC(2014, 6, 5, 13, 30, 23, 00),
                    permalink: "./The/Item/Permalink"
                }
            };
            var metalsmith = new MetalsmithFake({
                siteUrl: "http://example.com/items/"
            });
            var f = rssfeed();
            f(files, metalsmith, function(){                  
                var contents = files['feed.xml'].contents.toString();
                expect(contents).to.have.xpath("(//item)[1][contains(title, 'TheItemTitle')]");
                expect(contents).to.have.xpath("(//item)[1][contains(description, 'Some text to begin with')]");
                expect(contents).to.have.xpath("(//item)[1]/*[local-name()='creator' and contains(., 'TheItemAutor')]");
                expect(contents).to.have.xpath("(//item)[1][contains(link, 'http://example.com/items/The/Item/Permalink')]");
                expect(contents).to.have.xpath("(//item)[1][contains(pubDate, 'Sat, 05 Jul 2014 13:30:23 GMT')]");
                expect(contents).to.have.xpath("(//item)[1]/guid[contains(., 'http://example.com/items/The/Item/Permalink') and @isPermaLink='true']");
                done();
            });
        });
    });
});