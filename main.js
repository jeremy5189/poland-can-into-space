var renderer	= new THREE.WebGLRenderer({
	antialias	: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled	= true

var updateFcts	= [];
var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(
	45, window.innerWidth / window.innerHeight, 0.01, 100 
);

var radius = 3
camera.position.z = radius;

// 增加整體光
var light	= new THREE.AmbientLight(0x999999, 2)
scene.add(light)

// 加入地球
var earthMesh	= THREEx.Planets.createEarth()
scene.add(earthMesh)

// 讓地球轉 
updateFcts[0]=function(delta, now){
	earthMesh.rotation.y += 1/8 * delta;		
	earthMesh.rotation.x += 1/16 * delta;	
}


//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
var mouse	= {x : 0, y : 0, oldX : 0, oldY : 0}
document.addEventListener('wheel', function(event){
	//scroll down
	if(event.wheelDelta<0){
		camera.position.x *= (radius+0.2)/radius
		camera.position.y *= (radius+0.2)/radius
		camera.position.z *= (radius+0.2)/radius
		radius+=0.2;
	}
	//scroll up
	else{
		camera.position.x *= (radius-0.2)/radius
		camera.position.y *= (radius-0.2)/radius
		camera.position.z *= (radius-0.2)/radius
		radius-=0.2
	}
})

var onMouseDownPhi=0,onMouseDownTheta=0;
var theta,phi;
document.addEventListener('mousedown', function(event){
	updateFcts[0]=function(delta, now){
		earthMesh.rotation.y = earthMesh.rotation.y;		
		earthMesh.rotation.x = earthMesh.rotation.x;
	}
	
	document.onmousemove = function(eveny){
		mouse.x	= (event.screenX / window.outerWidth )
		mouse.y	= (event.screenY / window.outerHeight)
		theta = ( ( mouse.x - mouse.oldX ) * 3 ) + onMouseDownTheta;
        phi = -( ( mouse.y - mouse.oldY ) * 3 ) + onMouseDownPhi;
		
		// console.log(phi)

		if(phi >= Math.PI/2){
			console.log(phi)
			phi-=(Math.PI)
		}
		else if(phi <= -(Math.PI/2)){
			phi+=Math.PI
		}

        camera.position.x = radius * Math.sin( theta) * Math.cos( phi );
        camera.position.y = radius * Math.sin( phi );
        camera.position.z = radius * Math.cos( theta) * Math.cos( phi );

		camera.lookAt(scene.position)
	}
})
document.addEventListener('mouseup', function(event){
	updateFcts[0]=function(delta, now){
		earthMesh.rotation.y += 1/8 * delta;		
		earthMesh.rotation.x += 1/16 * delta;	
	}
	updateFcts[2]=function(delta,now){}
	document.onmousemove = null;
	onMouseDownPhi=phi;
	onMouseDownTheta=theta;
})
document.addEventListener('mousemove', function(event){
	mouse.oldX = (event.screenX / window.outerWidth )
	mouse.oldY = (event.screenY / window.outerHeight)
}, false)

//////////////////////////////
//		render the scene
/////////////////////////////
updateFcts[1]=function(){
	renderer.render( scene, camera );		
}

//////////////////////////////
//		looper runner
/////////////////////////////
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
	// keep looping
	requestAnimationFrame( animate );
	// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec
	// call each update function
	updateFcts.forEach(function(updateFn){
		updateFn(deltaMsec/1000, nowMsec/1000)
	})
})