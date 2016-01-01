/** PI distributed computation with montecarlo*/
"use strict";


var SAMPLE_SIZE=100;

var TOTAL_TESTS=1;
var TOTAL_INSIDE=3000;//SOMETHING REALLY WRONG TO START (Changes will be more impressive)

var PI_APPROX=3;

module.exports = {
	createJob:function(){
		return "{task_id:'pi',data:{points:"+SAMPLE_SIZE+"}}";
	},
	report:function(results){
		try{
			var inside = parseInt(results);
			TOTAL_TESTS++;
			TOTAL_INSIDE+=inside;
			PI_APPROX=4*(TOTAL_INSIDE/TOTAL_TESTS)/SAMPLE_SIZE;
			//console.log(PI_APPROX);
		}catch(e){
			console.error(e);
		}
	},
	currentApprox:function(){
		return PI_APPROX;
	},
}