var https = require('https')
  , path = require('path')
  , log = require('./simplelog')
  , Ofuda = require('ofuda');

var opts = {}, ofuda = {}, http_options = {};

var httpClient = https;
var initialized = false;

init = function() {
  ofuda = new Ofuda( { headerPrefix:'Srs', 
                         hash: 'sha1', 
                         serviceLabel: 'MBO', 
                         debug: false } );

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
  log.setDebug(false);
}

config = function(options) {
  opts = options;
  init();
}

readConfig = function(fname) {
  if (!fname) {
    fname = __dirname+'/config.json';
  }
  log.debug("Client SDK reading config from " + path.resolve(fname));
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
    res.setEncoding('utf8');
    var body = "";
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      try {
        var resData = JSON.parse(body);
      } catch (e) {
        console.log("Unable to parse response:");
        console.log(e.message);
        console.log("response body is");
        console.log(body);
        var resData = e;
      }
      cb(resData);
     });
  });

  if (data) {
    req.end(JSON.stringify(data));
  } else {
    req.end();
  }
}

checkInit = function(cb) {
  if (!initialized) {
    readConfig();  
    cb();
  } else {
    cb();
  }
}

backup = function(cb) {
  checkInit(function() {
    doReq('POST', 'backup', null, null, function(res) {
      cb(res.key);
    });
  });
}

listBackups = function(key) {
  checkInit(function() {

  });    
}

backupStatus = function(key) {
  checkInit(function() {

  });    
}

generalStatus = function(cb) {
  checkInit(function() {
    doReq('GET', 'stats', null,null,function(res) {
      cb(res);        
    });
  });
}

QRImageLink = function(key, cb) {
  checkInit(function() {

  });
}

exports.backup = backup;
exports.listBackups = listBackups;
exports.backupStatus = backupStatus;
exports.generalStatus = generalStatus;
exports.QRImageLink = QRImageLink;
exports.config = config;
exports.readConfig = readConfig;

