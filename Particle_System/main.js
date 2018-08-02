
	
	// Juan Aguirre
	
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
	// set the scene size
	var WIDTH = 1536,
	    HEIGHT = 800;
	
	// set some camera attributes
	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 10000;
	
	// get the DOM element to attach to
	// - assume we've got jQuery to hand
	var $container = $('#container');
	
	// create a WebGL renderer, camera
	// and a scene
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.Camera(  VIEW_ANGLE,
	                                ASPECT,
	                                NEAR,
	                                FAR  );
	var scene = new THREE.Scene();
	
	// the camera starts at 0,0,0 so pull it back
	camera.position.z = 300;
	
	// start the renderer - set the clear colour
	// to a full black
	renderer.setClearColor(new THREE.Color(0, 1));
	renderer.setSize(WIDTH, HEIGHT);
	
	// attach the render-supplied DOM element
	$container.append(renderer.domElement);
	
	// create the particle variables
	var particleCount = 9500,
	    particles = new THREE.Geometry(),
		pMaterial = new THREE.ParticleBasicMaterial({
			color: 0xFFFFFF,
			size: 20,
			map: THREE.ImageUtils.loadTexture(
				"images/bc.png"
			),
			blending: THREE.AdditiveBlending,
			transparent: false
		});
	
	// now create the individual particles
	for(var p = 0; p < particleCount; p++) {
	
		// create a particle with random
		// position values, -250 -> 250
		var pX = Math.random() * 740 - 350,
			pY = Math.random() * 740 - 350,
			pZ = Math.random() * 740 - 350,
		    particle = new THREE.Vertex(
				new THREE.Vector3(pX, pY, pZ)
			);
		// create a velocity vector
		particle.velocity = new THREE.Vector3(
			0,				// x
			-Math.random(),	// y
			0);				// z

		// add it to the geometry
		particles.vertices.push(particle);
	}
	
	// create the particle system
	var particleSystem = new THREE.ParticleSystem(
		particles,
		pMaterial);
	
	particleSystem.sortParticles = true;
	
	// add it to the scene
	scene.addChild(particleSystem);
	
	// animation loop
	function update() {
		
		// add some rotation to the system
		particleSystem.rotation.y += 0.003;
		
		var pCount = particleCount;
		while(pCount--) {
			// get the particle
			var particle = particles.vertices[pCount];
			
			// check if we need to reset
			if(particle.position.y < -90) {
				particle.position.y = 90;
				particle.velocity.y = 0;
			}
			
			// update the velocity
			particle.velocity.y -= Math.random() * .002;
			
			// and the position
			particle.position.addSelf(
				particle.velocity);
		}
		
		// flag to the particle system that we've
		// changed its vertices. This is the
		// dirty little secret.
		particleSystem.geometry.__dirtyVertices = true;
		
		renderer.render(scene, camera);
		
		// set up the next call
		requestAnimFrame(update);
	}
	requestAnimFrame(update);
	