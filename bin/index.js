var fs = require('fs');
var glob = require('glob');
var svgJson = {};

function pathFinder(path){
  return newPath = {
    "attr": {
      "fill": path.match (/fill="\s*([^"]*)\s*"/gi)[0].replace (/["']/g, "").replace (/fill=/gi, ""),
      "d": path.match (/d="\s*([^"]*)\s*"/gi)[0].replace (/["']/g, "").replace (/d=/gi, "")
    },
    "type":"path"
  };
}


function jsonMaker(data, file){

  var fileName = file.replace(/(.svg)/g, "");

  var svgContainerSettings = data.match(/<svg(.*)>/gi)[0];
  var viewBox = svgContainerSettings
    .match(/viewBox="\s*([^"]*)\s*"/gi)[0]
    .replace(/["']/g,"")
    .replace(/viewBox=/gi,"");

  var pathsHtml = data.match(/<path(.*?)>/gi);
  var paths = [];


  for(var i = 0; i < pathsHtml.length;i++){
    paths.push(pathFinder(pathsHtml[i]));
  }

  svgJson[fileName] = {};
  svgJson[fileName]['viewBox'] = viewBox;
  svgJson[fileName]['shape'] = [];
  svgJson[fileName]['shape'] = paths;

  fs.writeFile('output.json',JSON.stringify(svgJson),'utf8');

}

glob("*.svg",function(er, files){
  for(var i = 0; i < files.length;i++){
    fileIterator(files[i]);
  }
});

function fileIterator(file){
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    jsonMaker(data, file);
  });
}