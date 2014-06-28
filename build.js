var fs = require('fs')
var path = require('path')

var modules = "node_modules/"

function Module(name) {
  this.name = path.basename(name)
  this.readme = ""
  this.modules = {}
}

module.exports = buildTree
function buildTree(path,cb) {
  var module = new Module(path)
  var moduledir = path+modules
  //console.log("Checking: "+path)
  //console.log("Checking for package.json: "+path)
  fs.readFile(path+"package.json",function(e,file) {
    if(e) {
       //console.log("Not a module!: "+path)
       return cb(e)
    }
    //console.log("Loading README.md: "+path)
    loadReadme(path,function(e,file) {
      if(e) {
        //console.log("README.md not found!: "+path)
      } else {
        module.readme = new String(file)
      }
      fs.readdir(moduledir, function(e,files) {
        if(e) {
          return cb(null,module)
        }
        checkFiles(moduledir,files, function(subtree) {
          if(subtree && typeof subtree.name != "undefined")
            module.modules[subtree.name] = subtree
          //console.log(path+" Finished!")
        },function() {
          return cb(null,module)
        })
      })
    })
  })
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

  function tryReadme(array,index,cb) {
    //console.log("trying "+index)
    if(array.length <= index) {
      return cb(new Error("No Readme Found"))
    }
    fs.stat(folder+array[index],function(e,stat) {
      if(e || !stat.isFile()) return tryReadme(array,++index,cb)
      cb(null,index)
    })
  }

  tryReadme(filenames,0,function(e,index) {
    if(e) return cb(e)
    fs.readFile(folder+filenames[index],cb)
  })
}


function checkFiles(path,files,addModule,cb) {
  var finished = complete(files.length,function() {
    return cb(null)
  })
  files.forEach(function(v) {
    var newpath = path + v
    fs.stat(newpath,function(e,stat) {
      if(e) { return finished() }
      if(!stat.isDirectory()) { return finished() }
      buildTree(newpath+"/",function(e,subtree) {
        addModule(subtree)
        finished()
      })
    })
  })
}

function complete(count,cb) {
  return function() {
    count--
    if(count===0) return cb()
  }
}
