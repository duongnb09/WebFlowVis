function AddObject(name2){
	console.log("run");
	var loader = new THREE.ObjectLoader();
	loader.load(name, function ( object ) {
		scene.add( object );},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		alert( 'An error happened' );
	}
	);
};