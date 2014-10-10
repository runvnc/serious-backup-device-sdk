var https = require('https')
  , Ofuda = require('ofuda');

var opts = {}, ofuda = {}, http_options = {};

var httpClient = https;

init = function() {
  ofuda = new Ofuda( { headerPrefix:'Srs', 
                         hash: 'sha1', 
                         serviceLabel: 'MBO', 
                         debug: true } );

  credentials = { accessKeyId: opts.accessKeyId, 
                  accessKeySecret: opts.accessKeySecret };

  http_options = {
      host: opts.remoteHost,
      port: opts.remotePort,
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      }
      //'Content-MD5': 'ee930827ccb58cd846ca31af5faa3634'
  };
}

config = function(options) {
  opts = options;
  init();
}

readConfig = function(fname) {
  if (!fname) {
    fname = './config.json';
  }
  opts = require(fname);
  init();
}

doReq = function(method, entity, id, data, cb) {
  http_options.path = '/'+entity;
  if (id != null) {
    http_options.path += '/'+id;
  }
  http_options.method = method;
  signedOptions = ofuda.signHttpRequest(credentials, http_options);

  var req = httpClient.request(signedOptions, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    var resData = JSON.parse(res.body);
    cb(resData);
  });

  if (data) {
    req.end(JSON.stringify(data));
  } else {
    req.end();
  }
}

backup = function() {
  
  // returns key;
}

listBackups = function(key) {
      
}

getBackupStatus = function(key) {
    
}

getGeneralStatus = function() {
  
}

getQRImageLink = function(key) {

}

exports.backup = backup;
exports.listBackups = listBackups;
exports.backupStatus = backupStatus;
exports.generalStatus = generalStatus;
exports.QRImageLink = QRImageLink;
exports.config = config;
exports.readConfig = readConfig;

