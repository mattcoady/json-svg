#!/usr/bin/env node

var fs = require('fs'),
  glob = require('glob'),
  svgJson = {};

svgJson.svgData = {};
svgJson.names = [];

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

  svgJson.names.push(fileName);

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

  svgJson.svgData[fileName] = {};
  svgJson.svgData[fileName]['viewBox'] = viewBox;
  svgJson.svgData[fileName]['shape'] = [];
  svgJson.svgData[fileName]['shape'] = paths;

  console.log(file + " - Done");

  fs.writeFile('output.json',JSON.stringify(svgJson),'utf8');

}

glob("*.svg",function(er, files){
  if(files.length > 0){
    for(var i = 0; i < files.length;i++){
      fileIterator(files[i]);
    }
  }else{
    console.log ("Oh no errors! Might be no svg's in this directory.");
  }
});

function fileIterator(file){
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      console.log ("Ah balls, an error", err);
    }
    jsonMaker(data, file);
  });
}