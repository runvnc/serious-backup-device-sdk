/* @flow weak */

var https = require('https')
  , path = require('path')
  , qrCode = require('qrcode-npm')
  , bunyan = require('bunyan')
  , log = bunyan.createLogger({name:'sdk'});

log.level('debug');

var opts = {}, http_options = {};

var httpClient = https;
var initialized = false;

init = function() {

  http_options = {
      host: opts.remoteHost,
      port: opts.remotePort,
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      }
  };
}

config = function(options) {
  opts = options;
  init();
}

readConfig = function(fname) {
  if (!fname) {
    fname = __dirname+'/config.json';
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

  var req = httpClient.request(http_options, function(res) {
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
      cb(res);
    });
  });
}

restore = function(time, cb) {
  checkInit(function() {
    doReq('POST', 'restore', time, null, function(res) {
      cb(true);
    });
  });
}

listBackups = function(cb) {
  checkInit(function() {
    doReq('GET', 'backups', null, null, function(res) {
      cb(res);
    });
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

QRImageTag = function(key, cb) {
  checkInit(function() {
    var qr = qrCode.qrcode(4,'M');
    qr.addData(key);
    qr.make();
    cb(qr.createImgTag(4));
  });
}

exports.backup = backup;
exports.restore = restore;
exports.listBackups = listBackups;
exports.backupStatus = backupStatus;
exports.generalStatus = generalStatus;
exports.QRImageTag = QRImageTag;
exports.config = config;
exports.readConfig = readConfig;

