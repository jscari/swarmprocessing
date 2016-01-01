"use strict";

var loadJSONP = (function(){
  var unique = 0;
  return function(url, callback, context) {
    // INIT
    var name = "_jsonp_" + unique++;
    if (url.match(/\?/)) url += "&callback="+name;
    else url += "?callback="+name;
    
    // Create script
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    
    // Setup handler
    window[name] = function(data){
      callback.call((context || window), data);
      document.getElementsByTagName('head')[0].removeChild(script);
      script = null;
      delete window[name];
    };
    
    // Load JSON
    document.getElementsByTagName('head')[0].appendChild(script);
  };
})();


var askJob = function(){
	var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "/js/job.js?callback=window._swarmWorker.postMessage&_="+Date.now();    
    document.getElementsByTagName('head')[0].appendChild(script);
    console.log(script.src);
};
var report = function(results){
	var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "/js/report.js?results="+results+"&callback=window._swarmWorker.postMessage&_="+Date.now();    
    document.getElementsByTagName('head')[0].appendChild(script);
    console.log(script.src);
};

if (window.Worker) {
	window._swarmWorker = new Worker('js/worker.js');
	//loadJSONP("/js/job.js", window._swarmWorker.postMessage);
	askJob();	

    window._swarmWorker.onmessage = function(e) {
	  report(e.data);
	};
}


