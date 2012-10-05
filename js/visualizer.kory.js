var SphereVisualizer = (function() {

	var SPHERECOUNT = 1;
	var SEPARATION = 30;
	var INIT_RADIUS = 50;
	var SEGMENTS = 16;
	var RINGS = 16;
	var VOL_SENS = 1;

	var spheres = [];
	var geoms = [];
	var materials = [];
	var values = [];
	var waves = [];
	var colors = [];
    // var sphereHolder = new THREE.Object3D();
    // var perlin = new ImprovedNoise();
	var noisePos = 0;
	var freqByteData;
	var timeByteData;

	function init(analyser) {

		spheres = [];
		geoms = [];
		materials = [];
		values = [];
		waves = [];
		colors = [];

		////////INIT audio in
		freqByteData = new Uint8Array(analyser.frequencyBinCount);
		timeByteData = new Uint8Array(analyser.frequencyBinCount);

	//  scene.add(sphereHolder);
	// 
	//         var scale = 1;
	//         
	//         var emptyBinData = [];
	//         for(var j = 0; j < SEGMENTS; j++) {
	//             emptyBinData.push(0);
	//         }
	//         
	//         var pointLight = new THREE.PointLight(0xFFFFFF);
	//         
	//         // set its position
	//         pointLight.position.x = 10;
	//         pointLight.position.y = 50;
	//         pointLight.position.z = 200;
	//         
	//         // add to the scene
	//         scene.add(pointLight);
	// 
	//         // make just one sphere for now
	// 
	//         // a lovely red color
	//         var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
	// 
	//         var sphere = new THREE.Mesh(  
	//                                     new THREE.SphereGeometry(INIT_RADIUS, SEGMENTS, RINGS),
	//                                     sphereMaterial
	//                                     );
	//         sphere.position.set( 0, 0, 0 );
	// 
	//         // add it to the list of spheres
	//         spheres.push(sphere);
	//         
	//         // add geoms to list of geoms (for manipulating later)
	//         geoms.push(sphere.geometry);
	//         
	//         // add to the list of materials
	//         materials.push(sphereMaterial);
	// //         scale *= 1.05;
	// //         sphere.scale.x = scale;
	// //         sphere.scale.y = scale;
	// 
	//         // add it to the scene
	//         sphereHolder.add(sphere);
	// 
	//         values.push(0);
	//         waves.push(emptyBinData);
	//         colors.push(0);
	// 
	
		// create multiple spheres
		
		// for(var i = 0; i < RINGCOUNT; i++) {
// 
// 			var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
//
// 					var sphere = new THREE.Mesh(  
// 		                            new THREE.SphereGeometry(INIT_RADIUS, SEGMENTS, RINGS),
//                                     sphereMaterial
//                                     );
// 
// 			spheres.push(line);
// 			geoms.push(sphere.geometry);
// 			materials.push(sphereMaterial);
// 
// 			sphereHolder.add(sphere);
// 
// 			values.push(0);
// 			waves.push(emptyBinData);
// 			colors.push(0);
// 
// 		}
	}

	function remove() {
		if (sphereHolder){
			for(var i = 0; i < SPHERECOUNT; i++) {
				sphereHolder.remove(spheres[i]);
			}
		}
	}

	function update() {
		analyser.smoothingTimeConstant = 0.1;
		analyser.getByteFrequencyData(freqByteData);
		analyser.getByteTimeDomainData(timeByteData);
        graphArrays(timeByteData, freqByteData);

	//  //get average volume level of song at that point
	//         var length = timeByteData.length;
	//         var sum = 0;
	//         for(var j = 0; j < length; ++j) {
	//             sum += timeByteData[j];
	//         }
	//         var aveSoundLevel = sum / length;
	//         var maxVol = Math.max.apply(null, timeByteData);
	//         var normalizedLevel = (aveSoundLevel / maxVol); // normalized to be between 0 and 1 (used to form an HSV color later)
	//         
	//         values.push(normalizedLevel);
	//         waves.push(timeByteData);
	//         
	//         //get average frequency level of song at that point
	//         var length = freqByteData.length;
	//         var sum = 0;
	//         for(var j = 0; j < length; ++j) {
	//             sum += freqByteData[j];
	//         }
	//         var aveFreqLevel = sum / length;
	//         var maxFreq = Math.max.apply(null, freqByteData);
	//         var normalizedLevel = (aveSoundLevel / maxFreq); // normalized to be between 0 and 1 (used to form an HSV color later)
	// 
	// //      colors.push(n);
	// 
	//         values.shift();
	//         waves.shift();
	//         colors.shift();
	// 
	//         for(var ii = 0; ii < SPHERECOUNT ; ii++) {
	// 
	//             var sphereId = SPHERECOUNT - ii - 1;
	// 
	// //          for(var jj = 0; jj < SEGMENTS; jj++) {
	// //              geoms[ii].vertices[jj].position.z = (waves[sphereId][jj])*2;
	// //          }
	// // 
	// //          //link up last segment
	// //          geoms[ii].vertices[SEGMENTS].position.z = geoms[ii].vertices[0].position.z;
	// 
	// //             spheres[ii].scale.x = spheres[ii].scale.x * values[0];
	// //             spheres[ii].scale.y = spheres[ii].scale.y * values[0];
	// //             spheres[ii].scale.z = spheres[ii].scale.z * values[0];
	// 
	//             var hue = colors[sphereId];
	//             var saturation = values[sphereId];
	//             var value = 1;
	//             
	//             //console.log(hue + "\n" + saturation);
	// 
	//             materials[ii].color.setHSV(hue, saturation, value);
	//             materials[ii].opacity = 1;
	//             geoms[ii].dynamic = true;
	//             geoms[ii].__dirtyVertices = true;
	//             geoms[ii].__dirtyColors = true;
        // }
	}

	return {
		init:init,
		update:update,
		remove:remove
        // sphereHolder:sphereHolder
	};
}());

function graphArrays(array1, array2) {
    var c=document.getElementById("visualizer");
    var ctx=c.getContext("2d");
    
    ctx.fillStyle="red";
    ctx.clearRect(0, 0, 1024, 500);

    for (var i = 0; i<array1.length; i++) {
        ctx.fillRect(i, 300 - array1[i], 1, array1[i]);
    }
    ctx.fillStyle="orange";
        for (var i = 0; i<array2.length; i++) {
        ctx.fillRect(512+ i, 300 - array2[i], 1, array2[i]);
    }
}


function animate() {
	// need to do this before rendering
	requestAnimationFrame(animate);
	
	render();
	stats.update();
}

function render() {
	SphereVisualizer.update();
	
	renderer.render(scene, camera);
}

$(window).scroll(function(event, delta) {
	//set camera Z
	camera.position.z -= delta * 50;
});

function startViz(analyser){
    window.analyser = analyser;

	SphereVisualizer.init(analyser);

	animate();
}

if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

			window.setTimeout( callback, 1000 / 60 );

		};

	} )();

}