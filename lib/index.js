var _ = require('lodash'),
  gutil = require('gulp-util'),
  path = require('path'),
  defaultTemplates = require('./templates'),
  parseUrl = require('url').parse,
  through = require('through2');


/**
 * 
 */
module.exports = function gulpMultijnect(files, name, options) {
  options = options ? _.clone(options) : {};
  
  _.defaults(options, {
    templateMap: defaultTemplates,
    base: "",
    urlPrefix: "/",
    relative: false,
    defaultExtension: null
  });
  
  return through.obj(function(file, enc, cb) {
    var self = this;
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-multinject', 'Streaming not supported'));
      return cb();
    }
    
    if (file.isNull()) {
      this.push(file); // Do nothing if no contents
      return cb();
    }
    
    var ext = path.extname(file.path).replace('.', '');
    var targetTypeTemplates = options.templateMap[ext];
    if(!targetTypeTemplates) {
      this.push(file);
      return cb();
    }

    var startTag = _.template(targetTypeTemplates.startTag, {name: name});
    var endTag = targetTypeTemplates.endTag;
    var tagRegex = new RegExp('(' + escapeRegExp(startTag) + ')(\\s*)(\\n|\\r|.)*?(' + escapeRegExp(endTag) + ')', 'gi');

    file.contents = new Buffer(file.contents.toString()
      .replace(tagRegex, 
        function(match, startTag, indentation, ignore, endTag) {
          return [startTag]
            .concat(_.map(files, function(injFile) {
              var injectExt, url;
              if(isUrl(injFile)) {
                injectExt = path.extname(parseUrl(injFile).pathname).replace('.', '');
                url = injFile;
              } else {
                injectExt = path.extname(injFile).replace('.', '');
                url = path.relative(options.base, injFile);
                if(options.relative) {
                  url = path.relative(path.dirname(file.relative), url);
                }
                url = options.urlPrefix + url;
              }
              
              var template = targetTypeTemplates.template[injectExt];
              if(!template) {
                template = targetTypeTemplates.template[options.defaultExtension];
              }
              if(!template) {
                self.emit('error', new gutil.PluginError('gulp-multinject', "Cannot find template for rendering a " 
                  + injectExt + " file into a " + ext + " file (" + injFile + " => " + file.path + ")"));
              }
              return _.template(template, {url: url});
            }))
            .concat(endTag)
            .join(indentation);
        })
    );
    
    this.push(file);
    cb();
  });
};


function escapeRegExp(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function isUrl(url) {
  return (/^(http[s]?:)?\/\/./).test(url);
}
