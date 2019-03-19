var loading = false;

var three = $("<div id = 'three'></div>");
$("body").append(three);
$(three).innerHeight(window.innerHeight);
$(three).innerWidth(window.innerWidth*.8);
var taxis = $("<div id = 'inset'></div>");
$("body").append(taxis);

//-----Three.js Setup-----//
container = document.createElement( 'div' );
document.getElementById( 'three' ).appendChild( container );
stats = new Stats();
container.appendChild( stats.dom );
//Scene Setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, (window.innerWidth*.8)/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( window.innerWidth*.8, window.innerHeight );
renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.gammaInput = true;
renderer.gammaOutput = true;
scene.background = new THREE.Color('white');
container.appendChild( renderer.domElement );

var circleRadius = .01;
var circleShape = new THREE.Shape();
circleShape.moveTo( 0, circleRadius );
circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
circleShape.quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius );
circleShape.quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 );
circleShape.quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );

var geometryP = new THREE.PlaneGeometry(9,9);
var materialP = new THREE.MeshPhongMaterial( { color: 0x888888, dithering: true } );
materialP.transparent = true;
var plane = new THREE.Mesh( geometryP, materialP );
plane.position.set(0, 0, -1);
plane.receiveShadow = true;
plane.name = "surface";
scene.add( plane );
materialP.opacity = 0;

var light = new THREE.AmbientLight(0x777777);
scene.add(light);
var light2 = new THREE.PointLight(0xffffff);
light2.position.set(0,-10,10);
light2.castShadow = true;
light2.shadowMapWidth = 2048;
light2.shadowMapHeight = 2048; 
scene.add(light2);

var controls = new THREE.TrackballControls( camera, document.getElementById("three"));
controls.enableKeys = false;

//axis
var axes = document.getElementById( 'inset' );
var renderer2 = new THREE.WebGLRenderer();
renderer2.setClearColor( 0x000000, 1 );
renderer2.setSize( 100, 100 );
axes.appendChild( renderer2.domElement );
var scene2 = new THREE.Scene();
var camera2 = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
camera2.up = camera.up;
var axesHelper = new THREE.AxesHelper( 5 );
scene2.add( axesHelper );

//box
var geometry = new THREE.BoxGeometry( 10, 5, 10);
var edge = new THREE.EdgesGeometry( geometry );
var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
var wireframe = new THREE.LineSegments( edge, mat );
wireframe.name = "plane";
scene.add( wireframe );

camera.position.set( 0, 0, 2);
controls.update();

var animate = function () {
	if(loading){
		$("#loading").addClass('spinner-border');
	}
	else{
		$("#loading").removeClass('spinner-border');
	}
	requestAnimationFrame( animate );
	controls.update();
	camera2.position.copy( camera.position );
	camera2.position.sub( controls.target );
	camera2.position.setLength( 15 );
    camera2.lookAt( scene2.position );
	stats.begin();
	renderer.render( scene, camera );
	stats.end();
	renderer2.render( scene2, camera2 );
};
animate();