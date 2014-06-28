var http = require('http')
var docs = require('./build.js')

module.exports = init

function init() {
  console.log("Building docs")
  docs("./",function(e,modules) {
    if(e) return console.log("Unable to load modules!: "+e.stack)
    console.log("Done!")
    docs.modules = modules
    startServer()
  })
}

function startServer() {
  console.log("Starting server on 0.0.0.0:8080")
  http.createServer(hostContent).listen(8080,"0.0.0.0")
}

function hostContent(req,res) {
  module = req.url.split("/")
  module.shift() //Throw away /
  if(module[0] == "") {
    return res.end(listContent()) //list contents
  }
  return res.end(JSON.stringify(getReadme(module,docs.modules)))
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
    string += "<li><a href="+path+">"
    string += key
    string += getChildren(path,module.modules[key])
    string += "</a>"+"</li>"
  })
  string += "</ul>"
  return string
}
