var width;
var height;
var center_x;
var center_y;
function DrawChart(Chart){
	var viewWidth = parseInt($('#chart').attr('viewBox').split(/\s+|,/)[3]);
	var circleSlices='';
	width = parseInt($('#chart').attr('width'));
	height = parseInt($('#chart').attr('height'));
	var centering=(viewWidth-width)/2;
    center_x = (width/2);
    center_y = (height/2);
	var max_num_persons = Chart.sections.length * Chart.maxItemsBySection;
	var pi2 = -Math.PI*2 ;
	var z=0;
	var j=0;
	var annotation='';
	var labels='';


	var data = new Array(Chart.sections.length)
	for(var i=0;i<Chart.sections.length;i++){
		data [i] = new Array(Chart.maxItemsBySection);
		z=j;
		for( j=z;j<Chart.maxItemsBySection+z;j++){
			data [i] [j] = (pi2 / max_num_persons) * j;
		}
	}	

	var step=0;	
	for(var i=0;i<Chart.sections.length;i++){
		var x1= line_x1_step(data[i][step],0);
		var y1 = line_y1_step(data[i][step],0);
		var x2 = line_x1_step(data[i][step+Chart.maxItemsBySection - 1],0);
		var y2 = line_y1_step(data[i][step+Chart.maxItemsBySection - 1],0);

		var xa= line_x1_step(data[i][step],centering);
		var ya = line_y1_step(data[i][step],centering);
		var xaa = line_x1_step(data[i][step+Chart.maxItemsBySection - 1],centering);
		var yaa = line_y1_step(data[i][step+Chart.maxItemsBySection - 1],centering);
		var centerX = (xa+xaa)/2;
		var centerY = (ya+yaa)/2;
		if(centerX<0){centerX-=90}else{centerX-=10}
			circleSlices += '<path id="p'+i+'" d="M '+ x1 +' '+ y1 +'A'+width/2+' '+height/2+' 0 0 1 '+x2 +' '+ y2 +'" stroke="'+Chart.arcColor+'"  stroke-width="2"/>';
		var phrase = Chart.sections[i].split(/\s+|,/);
		var str = "";
		for(var p = 1; p < phrase.length;p++){
			str += '<tspan x="'+centerX+'" dy="1.2em">'+phrase[p]+'</tspan>' 
		}
		labels += '<text  font-size="20" x="'+centerX+'" y="'+centerY+'" fill="white"> \
		<tspan x="'+centerX+'" dy="0">'+phrase[0]+'</tspan>'+str+'</text>';
		step+=Chart.maxItemsBySection;

	}
	for(var i=0;i<Chart.sections.length;i++){
		var colors=[];
		var items =0;
		for(var j=0;j<Chart.groups.length;j++){
			items += Chart.data[i][j];
			for(var m=0;m< Chart.data[i][j];m++){
				colors.push(Chart.colors[j]);
			}
		}
		colors = shuffle(colors);
		var margin = (Chart.maxItemsBySection*i)+(Chart.maxItemsBySection/2);
		var pivot=0;

		for(var c = 0; c < items; c++ ){
			if(c%2==0){
				pivot=c/2;
			}
			else{
				pivot=Math.ceil(c/2) * -1;
			}
			var fetch = data[i][margin+pivot];
			var x1 =line_x1(fetch);
			var x2 =line_x2(fetch);
			var y1 =line_y1(fetch);
			var y2 =line_y2(fetch);
			var style= "stroke: "+colors[c]+"; stroke-width: 2;";
			$('svg#chart').append('<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="'+style+'"></line>');
		}

	}


	for(var k = 0;k<Chart.groups.length;k++){
		annotation +='<circle cx="'+(k*viewWidth/Chart.groups.length)+'" cy="'+(height+Chart.annotationDistance)+'" r="10" stroke="black" fill="'+Chart.colors[k]+'" /><text x="'+(k*viewWidth/Chart.groups.length+20)+'" y="'+(height+Chart.annotationDistance+5)+'" fill="white">'+Chart.groups[k]+'</text>'
	}

	$('svg#chart').append('<circle cx="'+width/2+'" cy="'+height/2+'" r="30" stroke="'+Chart.centerStroke+'" stroke-width="10" fill="'+Chart.centerColor+'" />' + annotation);

	$('svg#chart').prepend('<g transform="translate('+width/2+','+height/2+')" >'+circleSlices+' '+ labels +'</g> ');

	$("#SVGcontainer").html($("#SVGcontainer").html());

}




var line_x1_step = function(d,a) {
	return  - Math.sin(d) * ((width +a) / 2);
};
var line_y1_step = function(d,a) {
	return - Math.cos(d) * ((height+a) / 2);
};
var line_x1 = function(d) {
	return center_x - Math.sin(d) * (width / 2.1);
};
var line_x2 = function(d) {
	return (width/2);
};

var line_y1 = function(d) {
	return center_y - Math.cos(d) * (height / 2.1);
};

var line_y2 = function(d) {
	return (height/2);
};



function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {

		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}
