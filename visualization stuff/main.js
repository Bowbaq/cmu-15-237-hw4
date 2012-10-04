
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
// variables for drawing stuff
var camera, scene, renderer, material, container;
// variables for audio stuff
var source, analyser, buffer, audioBuffer, audioContext, source, processor, xhr;
// is this needed?
var dropArea;

var started = false;

$(document).ready(function() {

	//Chrome is only browser to currently support Web Audio API
	var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	var is_webgl = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();

	if(!is_chrome){
		$('#loading').html("This demo requires <a href='https://www.google.com/chrome'>Google Chrome</a>.");
	// } else if(!is_webgl){
// 		$('#loading').html('Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />' +
// 		'Find out how to get it <a href="http://get.webgl.org/">here</a>, or try restarting your browser.');
	}else {
		$('#loading').html('<a id="loadsample">load sample mp3</a>');
		init();
	}

});

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	
	//init 3D scene
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000);
	camera.position.z = 2000;
	scene = new THREE.Scene();
	scene.add(camera);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	//container.appendChild(renderer.domElement);

	//add cool stats stuff for fps and ms to render each frame! cool!
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.left = '0px';
	container.appendChild(stats.domElement);

	//event listeners
	$("#loadsample").click( loadSampleAudio);
	$(window).resize(onWindowResize);

	onWindowResize(null);
	audioContext = new window.webkitAudioContext();
}

function loadSampleAudio() {
	$('#loading').text("loading...");

	source = audioContext.createBufferSource();
	analyser = audioContext.createAnalyser();
	analyser.fftSize = 1024;

	// Connect audio processing graph
	source.connect(analyser);
	analyser.connect(audioContext.destination);

	loadAudioBuffer("test.mp3");
}

function loadAudioBuffer(url) {
	// Load asynchronously
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
		audioBuffer = audioContext.createBuffer(request.response, false );
		finishLoad();
	};

	request.send();
}

function finishLoad() {
	source.buffer = audioBuffer;
	source.looping = true;
	source.noteOn(0.0);
	startViz();
}

function onWindowResize(event) {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
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

function startViz(){
	$('#loading').hide();

	SphereVisualizer.init();

	if (!started){
		started = true;
		animate();
	}

}