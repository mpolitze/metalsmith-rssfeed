var expect = require('chai').expect;
var assert = require('chai').assert;

var rssfeed = require('../');

var MetalsmithFake = function(metadata){
    this.md = metadata || {};
};
MetalsmithFake.prototype.metadata = function(){
    return this.md;
}

describe('metalsmith-rssfeed', function() {
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
                
                done();
            });
        });
    });
});