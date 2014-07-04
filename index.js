var http = require('http')
var docs = require('./buildTree.js')
var gfm2html = require('gfm2html')
var readfiles = require('readfiles')
var varstring = require('varstring')
var path = require('path')
var jquery
var sidrjs
var sidrcss
var css
var template

module.exports = init

function init() {
  console.log("Building docs")
  docs("./",function(e,modules) {
    if(e) return console.log("Unable to load modules!: "+e.stack)
    docs.modules = modules
    console.log("Done!")
    readfiles([ path.join(__dirname,'files/template.html'),
                path.join(__dirname,'files/doc.css'),
                path.join(__dirname,'files/jquery.min.js'),
                path.join(__dirname,'files/sidr.css'),
                path.join(__dirname,'files/jquery.sidr.min.js')]
    ,function(e,files) {
      if(e) return console.log(e.stack)
      template = files[0]
      css = files[1]
      jquery = files[2]
      sidrcss = files[3]
      sidrjs = files[4]
      startServer()
    })
  })
}

function startServer() {
  console.log("Starting server on 0.0.0.0:8080")
  http.createServer(hostContent).listen(8080,"0.0.0.0")
}

function hostContent(req,res) {
  switch(req.url) {
  case "/jquery.min.js":
    return res.end(jquery)
  case "/docs.css":
    return res.end(css)
  case "/sidr.js":
    return res.end(sidrjs)
  case "/sidr.css":
    return res.end(sidrcss)
  }
  module = req.url.split("/")
  module.shift() //Throw away /
  if(module[0] == "") {
    console.log(req.url)
    return res.end(listContent()) //list contents
  }
  gfm2html(getReadme(module,docs.modules),{"template":template},function(e,html) {
    if(e) return res.end(e)
    res.end(varstring(html,{"modules":listContent()}))
  })
}

function getReadme(path,module) {
  try {
  if(path.length === 0) { return module.readme }
  var modules = module.modules[path.shift()]
  return getReadme(path,modules)
  } catch(e) {
   return ""
  } //TODO: Don't ignore 404's
}

function listContent() {
  var string = "<html><head></head><body>"
  string += getChildren("",docs.modules)
  string += "</body></html>"
  return string
}

function getChildren(parent,module) {
  var string = "<ul>"
  Object.keys(module.modules).forEach(function(key) {
    var path = parent + "/" + key
    string += "<li><a href=\""+path+"\">"
    string += key
    string += getChildren(path,module.modules[key])
    string += "</a>"+"</li>"
  })
  string += "</ul>"
  return string
}
