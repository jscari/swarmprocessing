var http=require('http');
var url = require('url');
var fs = require('fs');
var piswarm = require('./piswarm');



/** write the content of the file in path in response */
var staticPage = function(response,path){
	try{
		var fileStream = fs.createReadStream(__dirname + "/"+ path);
		fileStream.on('open', function () {
		    fileStream.pipe(response);
		});
	}catch(e){
		console.error(e);
		return false;
	}
	
    return true;
};

/** return new input to process for a worker*/
var job = function(params){
	var callback = params.callback;
	return callback+"("+piswarm.createJob()+");";
};
/** report outputs from a worker and ask for a new job*/
var report = function(params){
	perfs.served++;
	var results = params.results;
	piswarm.report(results);
	return job(params);
};

/**return current approximation of pi and speed stats*/
var pi = function(params){
	return JSON.stringify({
		pi:piswarm.currentApprox(),
		speed:perfs.speed
	});
};
/** global object to check computation speed*/
var perfs = {served:0,history:[0]};
setInterval(function() {
  	perfs.history.push(perfs.served);
  	perfs.served = 0;
  	if(perfs.history.length>30) perfs.history.shift();
  	var sum = 0;
  	for(var i = 0;i<perfs.history.length;i++) { sum+=perfs.history[i]; };
	perfs.speed = sum / perfs.history.length; 
  	//console.log('Requests per second:' + perfs.speed);
}, 1000);

var pages = [
  {route: '/', type:'static', output: 'index.html',ct:'text/html'},
  {route: '/js/swarm.js', type:'static', output: 'js/swarm.js',ct:'application/javascript'},  
  {route: '/js/worker.js', type:'static', output: 'js/worker.js',ct:'application/javascript'},
  {route: '/js/report.js', type:'dynamic', output: report,ct:'application/javascript'},
  {route: '/js/job.js', type:'dynamic', output: job,ct:'application/javascript'},
  {route: '/pi', type:'dynamic', output: pi,ct:'application/javascript'}
];

var PORT = process.env.PORT || 80;

http.createServer(function (request, response) {
	try{
		var params = url.parse(decodeURI(request.url), true).query;
	  	var lookup = decodeURI(request.url);
	  	lookup = lookup.split('?')[0];
	  	//console.log("requesting : "+lookup);
	  	var found=false;
	  	pages.forEach(function(page) {
		    if (page.route === lookup) {
		      response.writeHead(200, {'Content-Type': page.ct});
		      if(page.type === 'static'){
		      	found=staticPage(response,page.output);
		      }else{
		      	response.end(typeof page.output === 'function' ? page.output(params) : page.output);
		      }
		      found=true;
		    }
		  });
		  if (!found) {
		     response.writeHead(404);
		     response.end('Page Not Found!');
		  }
	}catch(e){
		console.error(e);
	}
	
}).listen(PORT);

console.log("Server listening on port "+PORT);