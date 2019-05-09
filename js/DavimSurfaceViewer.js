$(document).ready(function () {

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}
    
    var FizzyText = function() {
      this.message = 'dat.gui';
      this.speed = 0.8;
      this.displayOutline = false;
    };




  
    //var stats = new Stats();
    //stats.showPanel( 0 );
    //$('#surface_view').append( stats.dom );


 

    /* Initialize */
    var container = document.getElementById("surface_view");
    
    /* Scence */
    var scene = new THREE.Scene();
    
    /* Camera */
    console.log($(".col-sm-8").width());
    var VIEW_WIDTH = $(".col-sm-8").width();
    var VIEW_HEIGHT = 550;
    var camera = new THREE.PerspectiveCamera(75, VIEW_WIDTH / VIEW_HEIGHT, 0.001, 10000);
    camera.position.set(1, 1, 1);
   
    //camera.up = new THREE.Vector3(0, 0, 1);
    //camera.lookAt(new THREE.Vector3(0,0, 0));
    
    /* Renderer */
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(VIEW_WIDTH,VIEW_HEIGHT);
    renderer.setClearColor(new THREE.Color("rgb(218, 222, 229)"));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.domElement.id = 'threejs-renderer';
    
    container.appendChild(renderer.domElement);
    
    /* Controls */
    
    
    var controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 4;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.target.set( 0.5, 0.5, 0.5 );


    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.addEventListener( 'change', render ); 
    
   var mesh_objects = [];
    
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2(),INTERSECTED;
    var canvasBounds = renderer.context.canvas.getBoundingClientRect();

    var options = {
  velx: 0,
  vely: 0,
  camera: {
    speed: 0.0001
  },
  stop: function() {
    this.velx = 0;
    this.vely = 0;
  },
  reset: function() {
    this.velx = 0.1;
    this.vely = 0.1;
    camera.position.z = 75;
    camera.position.x = 0;
    camera.position.y = 0;
    cube.scale.x = 1;
    cube.scale.y = 1;
    cube.scale.z = 1;
    cube.material.wireframe = true;
  }
};
    var gui;
    function onDocumentMouseDown( event ) {

        event.preventDefault();

        mouse.x = (( event.clientX - canvasBounds.left) / (canvasBounds.right-canvasBounds.left) ) * 2 - 1;
        mouse.y = - (( event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        console.log(mesh_objects);
        var intersects = raycaster.intersectObjects( mesh_objects,true ); 

        console.log(intersects);
        if ( intersects.length > 0 ) {
            if ( INTERSECTED != intersects[ 0 ].object ) {
                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex( 0xff0000 );
            }
            intersects[0].object.callback();
           
          gui = new dat.GUI({ autoPlace: false });
          gui.domElement.id = 'gui';

          var cam = gui.addFolder('Camera');
        cam.add(options.camera, 'speed', 0, 0.0010).listen();
        cam.add(camera.position, 'y', 0, 100).listen();
        cam.open();
        $('#surface_view').append(gui.domElement);
        console.log(gui)
          //renderer.domElement.appendChild(gui.domElement);

            

        }
        else {
            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = null;
           
             $('#gui').remove();

		}

    }

    /* Add some data*/
   
    
    /* Load obj */
    // instantiate a loader
    var objLoader = new THREE.OBJLoader();
    
    
    objLoader.load(
        'assets/surface1_1.obj',
        function(object){
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var phongMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, specular: 0xd75353, reflectivity: 100, shininess: 40, opacity: 1, transparent: true, shading: THREE.SmoothShading, side: THREE.DoubleSide });
                    
                    console.log(child.geometry);
                    child.material = phongMaterial;
                    child.castShadow = true;
                    console.log("something here");
                    child.callback = function(){ 
                        console.log("This is a callback");
                            /* GUI interface */
      
                        
                        }
                    child.name = "surface1";
                    console.log(child);
                    mesh_objects.push(child)
                    scene.add(child);
                }
            });
           
            
        },
        //called when loading is in progresses
        function ( xhr ){
            console.log( (xhr.loaded/xhr.total*100) + '% loaded');
        },
        // called when loading has errors
        function ( error ){
            console.log( 'An error happened' );
        }
    ); 
    
    /* Create ground plane */
    
    var planeGeometry = new THREE.PlaneBufferGeometry( 4, 4, 8, 8 );
    var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xb69a77, side: THREE.DoubleSide } );
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add( plane );


    
    // Lighting 
	/*var ambientLight = new THREE.AmbientLight( 0xf0e3e3 );
	scene.add( ambientLight ); */
    
    
    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 0 ].castShadow = true;

    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 1 ].castShadow = true;
    
    lights[ 2 ].position.set( - 100, - 200, - 100 );
    lights[ 2 ].castShadow = true;

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] ); 
    
    /* Lighting Setup 2*/
    /*
     var spotLight = new THREE.SpotLight( 0xFFFFFF, 2);
     spotLight.position.set( 10, 20, 10 );
     spotLight.target.position.set( 0.5, 0.5, 0.5 );
     spotLight.castShadow = true;
     scene.add( spotLight.target );
     scene.add( spotLight );
     //Set up shadow properties for the spotLight
     spotLight.shadow.mapSize.width = 32;  // default
     spotLight.shadow.mapSize.height = 32; // default
     spotLight.shadow.camera.near = 0.05;    // default
     spotLight.shadow.camera.far = 150;     // default
     //var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    //scene.add( spotLightHelper );
    */
     
     var ambientLight = new THREE.AmbientLight( 0x404040 );
     scene.add(ambientLight);
                
    /* Animate */
    var animate = function(){
        //stats.begin();
        requestAnimationFrame(animate);
        controls.update();
       
        renderer.render(scene,camera);
        //stats.end();
    };
    
    
    /**
     * @param  {} {renderer.render(scene
     * @param  {} camera
     */
    function render() {
		renderer.render( scene, camera );
	  }
    
    function onWindowResize() {
        canvasBounds = renderer.context.canvas.getBoundingClientRect();
		camera.aspect = VIEW_WIDTH / VIEW_HEIGHT;

		camera.updateProjectionMatrix();
		renderer.setSize(VIEW_WIDTH, VIEW_HEIGHT);
		

	}
    
    
    /* Animate */
    animate();

});