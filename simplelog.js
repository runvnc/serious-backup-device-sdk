var doDebug = false;

exports.setDebug = function(enable) {
  doDebug = enable;
}

exports.debug = function(msg) {
  if (doDebug) {
    console.log(msg);
  }
}
