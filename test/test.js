var expect = require('chai').expect,
  gutil = require('gulp-util'),
  path = require('path'),
  fs = require('fs'),
  through = require('through2'),
  gulpMultinject = require('../');


function expected(file, base) {
  var filepath = path.resolve('test/expected', file);
  return new gutil.File({
    path: filepath,
    cwd: process.cwd,
    base: base || 'test/expected',
    contents: fs.readFileSync(filepath)
  });
}

function fixture(file, base) {
  var filepath = path.join('test/fixtures', file);
  return new gutil.File({
    path: filepath,
    cwd: process.cwd,
    base: base || 'test/fixtures',
    contents: fs.readFileSync(filepath)
  });
}


describe("gulp-multinject", function() {
 
  it("should inject single file into single template", function(done) {
    var stream = gulpMultinject(['testjs.js'], 'scripts');
    
    stream.pipe(through.obj(function(file) {
      expect(String(file.contents)).to.be.equal(String(expected("jadetemplate.jade").contents));
      done();
    }));
    
    stream.write(fixture("jadetemplate.jade"));
    stream.end();
  });


  it("should inject files using the provided base path", function(done) {
    var stream = gulpMultinject(['assets/testjs.js'], 'scripts', {
        base: 'assets',
        urlPrefix: 'http://example.com/'
      }
    );

    stream.pipe(through.obj(function(file) {
      expect(String(file.contents)).to.be.equal(String(expected("jadetemplate-withbase.jade").contents));
      done();
    }));

    stream.write(fixture("jadetemplate.jade"));
    stream.end();
  });
  
  
  it("should inject files using relative paths", function(done) {
    var stream = gulpMultinject(['assets/testjs.js'], 'scripts', {
        urlPrefix: '',
        relative: true
      }
    );

    stream.pipe(through.obj(function(file) {
      expect(String(file.contents)).to.be.equal(String(expected("jadetemplate-relative.jade").contents));
      done();
    }));

    stream.write(fixture("subdir/jadetemplate.jade"));
    stream.end();
  });
  
  
  it("should inject urls and files", function(done) {
    var stream = gulpMultinject(['assets/testjs.js', 'http://example.com/test.js'], 'scripts', {
        urlPrefix: '/',
        base: "assets"
      }
    );

    stream.pipe(through.obj(function(file) {
      expect(String(file.contents)).to.be.equal(String(expected("jadetemplate-url.jade").contents));
      done();
    }));

    stream.write(fixture("jadetemplate.jade"));
    stream.end();
  });

  it("should inject styles and scripts into html", function(done) {
    var stream = gulpMultinject([
        'assets/testjs.js',
        'http://example.com/test.js',
        'style.css'
      ],
      'default'
    );

    stream
      .pipe(through.obj(function(file) {
        expect(String(file.contents)).to.be.equal(String(expected("htmltemplate.html").contents));
        done();
      }));

    stream.write(fixture("htmltemplate.html"));
    stream.end();
  });
});
