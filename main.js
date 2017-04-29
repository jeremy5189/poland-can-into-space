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

camera.position.z = 3; // 越小畫面越大

// 增加整體光
var light	= new THREE.AmbientLight(0x999999, 2)
scene.add(light)

// 加入地球
var earthMesh	= THREEx.Planets.createEarth()
scene.add(earthMesh)

// 讓地球轉 
updateFcts.push(function(delta, now){
	earthMesh.rotation.y += 1/8 * delta;		
	earthMesh.rotation.x += 1/16 * delta;	
})


//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
// var mouse	= {x : 0, y : 0}
document.addEventListener('wheel', function(event){
	console.log(event.wheelDelta)
	//scroll down
	if(event.wheelDelta<0){
		camera.position.z += 0.2
	}
	//scroll up
	else{
		camera.position.z -= 0.2
	}
})

//////////////////////////////
//		render the scene
/////////////////////////////
updateFcts.push(function(){
	renderer.render( scene, camera );		
})

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