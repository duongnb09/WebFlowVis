class SRObject{
	object;
	constructor(scene){
		this.object = new THREE.Object3D();
	}
	position(x,y,z){
		this.object.position.set(x, y, z);
	}
	rotate(x,y,z){
		this.object.rotation.set(x,y,z);
	}
	shadow(onoff){
		console.log(this.object.castShadow);
		this.object.castShadow = onoff;
	}
	get Position(){
		return this.object.position;
	}
	get Rotation(){
		return this.object.rotation;
	}
	get Shadow(){
		return this.object.castShadow;
	}
	loadSettings(){
	}
}
class SRLight extends SRObject{
	constructor(scene){
		super(scene);
		this.object = new THREE.AmbientLight(0x777777);
		this.object.position.set(0, 0, 0);
		scene.add( this.object );
	}
	intensity(x){
		this.object.intensity = x;
	}
	type(x){
		var temp = this.object;
		if(x = "Point"){
			this.object = new THREE.PointLight(0xffffff);
			this.object.castShadow = true;
			this.object.shadowMapWidth = 2048;
			this.object.shadowMapHeight = 2048; 
		}
		else{
			this.object = new THREE.AmbientLight(0x777777);
		}
		this.object.position.set(temp.position);
		scene.add( this.object );
		this.object.opacity = temp.opacity;
		
	}
	color(hue){
		this.object.color.setHSL(hue/100, 1, .5);
	}
	getIntensity(){
		return this.object.intensity;
	}
	getType(){
		if (this.object.isAmbientLight){
			return "Ambient";
		}
		else{
			return "Point";
		}
	}
	getColor(){
		return this.object.color.getHex();
	}
}
class SRMesh extends SRObject{
	geo;
	mat;
	constructor(scene, shape){
		super(scene);
		this.geo = new THREE.PlaneGeometry(9,9,32);
		this.mat = new THREE.MeshPhongMaterial( { color: 0x888888, dithering: true } );
		if(shape == "Sphere"){
			this.geo = new THREE.SphereGeometry(5,32,32);
		}
		else if(shape == "Box"){
			this.geo = new THREE.BoxGeometry(5,5,5);
		}
		this.mat.transparent = true;
		this.mat.opacity = 1;
		this.object = new THREE.Mesh( this.geo, this.mat);
		this.object.position.set(0, 0, -1);
		this.object.castShadow = true;
		this.object.receiveShadow = true;
	}
	add(newobject){
		
	}
	color(hue){
		this.mat.color.setHSL(hue, 1, .5);
	}
	material(x){
		var oldMat = this.mat;
        switch(x){
			case 0:
				this.mat = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );
				break;
			case 1:
				this.mat = new THREE.MeshBasicMaterial( { color: 0x808080, dithering: true } );
				break;
			case 2:
				this.mat = new THREE.MeshLambertMaterial( { color: 0x808080, dithering: true } );
				break;
		}
		this.mat.side = THREE.BackSide;
        this.mat.color = new THREE.Color(oldMat.color);
		this.mat.transparent = true;
		this.mat.opacity = oldMat.opacity;
		this.mat.map = oldMat.map;
		this.object.material = this.mat;
	}
	texture(onoff){
		var loader = new THREE.TextureLoader();
		loader.load(
			"data/graniteTXT.jpg",
			function ( texture ) {
				texture.repeat.set(.01,.01); 
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				this.object.traverse( function ( child ) {
				if(child.material.map == null)
					child.material.map = texture;
				else
					child.material.map = null;
				child.material.needsUpdate = true;
				});
			},
			undefined,
			function ( err ) {
				console.error( 'An error happened.' );
			}
		);
		
	}
	reflective(onoff, scene){
		var path = "data/skybox/";
		var urls = [
			path + "px.jpg", path + "nx.jpg",
			path + "py.jpg", path + "ny.jpg",
			path + "pz.jpg", path + "nz.jpg"
		];
		var textureCube = new THREE.CubeTextureLoader().load( urls );
		textureCube.format = THREE.RGBFormat;
		this.object.traverse( function ( child ) {
			if(onoff){
				scene.background = textureCube;
				child.material.envMap = textureCube;
				child.material.needsUpdate = true;
			}
			else{
				scene.background = null;
				child.material.envMap = null;
				child.material.needsUpdate = true;
				scene.background = new THREE.Color('white');
			}
		});
	}
	transparency(x){
		this.mat.opacity = num/100;
	}
	Wireframe(onoff){
		
	}
	updateMesh(mesh){
		this.geo = mesh.geometry;
		this.mat = mesh.material;
		this.mat.transparent = true;
		this.mat.opacity = 0.5;
		this.object = new THREE.Mesh( this.geo, this.mat);
		this.object.receiveShadow = mesh.receiveShadow;
		this.object.name = mesh.name;
		console.log(this.object.receiveShadow);
		scene.add(this.object);
		objects.push(this.object);
	};
	getColor(){
		
	}
	getMaterial(){
		
	}
	getTexture(){
		
	}
	getRefletive(){
		
	}
	getTransparency(){
		
	}
	getWireframe(){
		
	}
}
class SRBoundingBox extends SRObject{
	constructor(scene){
		super(scene);
	}
	Resize(){
		
	}
}
class SRSurface extends SRMesh{
	constructor(scene){
		super(scene);
	}
}
class SRSeedingCurve extends SRMesh{
	constructor(filename, scene){
		super(scene);
	}
}