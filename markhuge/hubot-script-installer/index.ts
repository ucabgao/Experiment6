/*jslint node: true */

var fs = require('fs');

this.read = function(file,callback) {
    try {
      var data = fs.readFileSync(file);
      var json = JSON.parse(data);
    } catch (ex) {
      return callback("error: " + file + " is not a valid json file");
    }
    return callback(undefined,json);
};

this.getName = function (file) {
  file = file || __dirname + "/../../package.json";
  return require(file).name;
   
};


this.install = function (file,callback) {
  var name = this.getName();
  this.read(file, function(err,data){
    if (err) { return callback(err); }
    data.push(name);
    fs.writeFile(file,JSON.stringify(data),callback);
  
  });
};


this.uninstall = function (file,callback) {
  var name = this.getName();
  
  this.read(file, function(err,data){
    if (err) { return callback(err); }
    var index = data.indexOf(name);
    if (index >= 0) {
      data.splice(index,1);
      fs.writeFile(file,JSON.stringify(data),callback);
    } else { callback("Script '" + name + "' not found in" + file); }
    
  });
};