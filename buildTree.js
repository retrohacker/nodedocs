var fs = require('fs')
var path = require('path')

var modulesdir = "node_modules/"

function Module(name) {
  this.name = path.basename(name)
  this.readme = ""
  this.modules = {}
}

module.exports = buildTree

function buildTree(path,cb) {
  var module = new Module(path)
  var moduledir = path+modulesdir
  isPackage(path,function(yes) {
    if(!yes) { return cb(new Error("Not a package!")) }
    loadReadme(path,function(e,file) {
      if(!e) { module.readme = file }
      buildSubtree(moduledir,function(e, subtree) {
        if(e) { cb(null,module) }
        if(typeof subtree.name != "undefined") {
          module.modules[subtree.name] = subtree
        }
      }, function() {
        return cb(null,module)
      })
    })
  })
}

function buildSubtree(path, addModule, done) {
  fs.readdir(path,function(e,files) {
    if(e) {
      addModule(new Error("Not a directory"))
      return done()
    }
    var finished = complete(files.length, function() {
      return cb()
    })
    files.forEach(function(folder) {
      var newpath = path + folder + "/"
      fs.stat(newpath,function(e,stat) {
        if(e || !stat.isDirectory()) return finished()
        buildTree(newpath,function(e,subtree) {
          addModule(subtree)
          finished()
        })
      })
    })
  })
}

function complete(count,cb) {
  return function() {
    if(--count === 0) return cb()
  }
}

function loadReadme(folder,cb) {
  var filenames = [
    "README.md",
    "readme.md",
    "Readme.md",
    "README.markdown",
    "readme.markdown",
    "Readme.markdown",
    "readme",
    "Readme",
    "README"
  ]

  var index = 0

  function getReadme() {
    fs.stat(folder+filenames[index], function(e,stat) {
      if(e || !stat.isFile()) {
        index++
        if(names.length <= index) return new Error("Readme not found!")
        return getReadme()
      }
      fs.readFile(folder+filenames[index],cb)
    })
  }

  getReadme()
}

function isPackage(path,cb) {
  fs.readFile(path+"package.json",function(e) {
    if(e) return cb(false)
    return cb(true)
  })
}
