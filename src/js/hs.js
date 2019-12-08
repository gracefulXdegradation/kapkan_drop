import * as THREE from '../lib/three.module.js';
import { TTFLoader } from '../lib/TTFLoader.js';

function hs() {
	var container;
	var camera, cameraTarget, scene, renderer;
	var group, textMesh1, textMesh2, textGeo, material;
	var firstLetter = true;
	var text = 'HIGH SNOB IETY',
		height = 30,
		size = 70,
		hover = 0,
		curveSegments = 4,
		bevelThickness = 2,
		bevelSize = 1.5;
	var font = null;
	var mirror = false;
	var targetRotation = 0;
	var targetRotationOnMouseDown = 0;
	var mouseX = 0;
	var mouseXOnMouseDown = 0;
	var windowHalfX = window.innerWidth / 2;

	var uniforms, clock, w = 480, h = 320;

	init();
	animate();
	function init() {
		container = document.getElementById( 'hs-box' );
		// document.body.appendChild( container );

		// CAMERA
		camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
		camera.position.set( 0, 400, 700 );
		cameraTarget = new THREE.Vector3( 0, 150, 0 );

		// SCENE
		scene = new THREE.Scene();
		// scene.background = new THREE.Color( 0xFA00F0 );
		// scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

		// LIGHTS
		var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
		dirLight.position.set( 0, 0, 1 ).normalize();
		scene.add( dirLight );
		var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
		pointLight.position.set( 0, 100, 90 );
		pointLight.color.setHSL( 0.9, 0.68, 0.59 );
		// pointLight.color.setRGB(235, 76, 152);
		scene.add( pointLight );





		clock = new THREE.Clock();
		var textureLoader = new THREE.TextureLoader();

		uniforms = {

			"fogDensity": { value: 0.45 },
			"fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
			"time": { value: 1.0 },
			"uvScale": { value: new THREE.Vector2( 3.0, 1.0 ) },
			"texture1": { value: textureLoader.load( 'images/cloud.png' ) },
			"texture2": { value: textureLoader.load( 'images/lavatile.jpg' ) }

		};

		uniforms[ "texture1" ].value.wrapS = uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
		uniforms[ "texture2" ].value.wrapS = uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;

		material = new THREE.ShaderMaterial( {

			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent

		} );







		// material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

		group = new THREE.Group();
		group.position.y = 100;
		scene.add( group );
		var loader = new TTFLoader();
		loader.load( './fonts/OGJ_Type_Design__Shapiro_97_Air_Extd.otf', function ( json ) {
			font = new THREE.Font( json );
			createText('IETY', - (size + 20));
			createText('SNOB', 0);
			createText('HIGH', size + 20);
		} );
		// var plane = new THREE.Mesh(
		// 	new THREE.PlaneBufferGeometry( 10000, 10000 ),
		// 	new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0, transparent: true } )
		// );
		// plane.position.y = 100;
		// plane.rotation.x = - Math.PI / 2;
		// scene.add( plane );
		// RENDERER
		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( w, h );
		container.appendChild( renderer.domElement );
		// EVENTS
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		// document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		// document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		// document.addEventListener( 'keypress', onDocumentKeyPress, false );
		// document.addEventListener( 'keydown', onDocumentKeyDown, false );
		// window.addEventListener( 'resize', onWindowResize, false );
	}
	// function onWindowResize() {
	// 	windowHalfX = window.innerWidth / 2;
	// 	camera.aspect = window.innerWidth / window.innerHeight;
	// 	camera.updateProjectionMatrix();
	// 	renderer.setSize( window.innerWidth, window.innerHeight );
	// }
	// function onDocumentKeyDown( event ) {
	// 	if ( firstLetter ) {
	// 		firstLetter = false;
	// 		text = '';
	// 	}
	// 	var keyCode = event.keyCode;
	// 	// backspace
	// 	if ( keyCode === 8 ) {
	// 		event.preventDefault();
	// 		text = text.substring( 0, text.length - 1 );
	// 		refreshText();
	// 		return false;
	// 	}
	// }
	// function onDocumentKeyPress( event ) {
	// 	var keyCode = event.which;
	// 	// backspace
	// 	if ( keyCode === 8 ) {
	// 		event.preventDefault();
	// 	} else {
	// 		var ch = String.fromCharCode( keyCode );
	// 		text += ch;
	// 		refreshText();
	// 	}
	// }
	function createText(text, offsetY) {
		textGeo = new THREE.TextBufferGeometry( text, {
			font: font,
			size: size,
			height: height,
			curveSegments: curveSegments,
			bevelThickness: bevelThickness,
			bevelSize: bevelSize,
			bevelEnabled: true
		} );
		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();
		var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
		textMesh1 = new THREE.Mesh( textGeo, material );
		textMesh1.position.x = centerOffset;
		// textMesh1.position.y = hover;
		textMesh1.position.y = offsetY;
		textMesh1.position.z = 0;
		textMesh1.rotation.x = 0;
		textMesh1.rotation.y = Math.PI * 2;
		group.add( textMesh1 );
		// if ( mirror ) {
		// 	textMesh2 = new THREE.Mesh( textGeo, material );
		// 	textMesh2.position.x = centerOffset;
		// 	textMesh2.position.y = - hover;
		// 	textMesh2.position.z = height;
		// 	textMesh2.rotation.x = Math.PI;
		// 	textMesh2.rotation.y = Math.PI * 2;
		// 	group.add( textMesh2 );
		// }
	}
	// function refreshText() {
	// 	group.remove( textMesh1 );
	// 	if ( mirror ) group.remove( textMesh2 );
	// 	if ( ! text ) return;
	// 	createText();
	// }
	function onDocumentMouseDown( event ) {
		event.preventDefault();
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'mouseout', onDocumentMouseOut, false );
		mouseXOnMouseDown = event.clientX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
	}
	function onDocumentMouseMove( event ) {
		mouseX = event.clientX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
	}
	function onDocumentMouseUp() {
		document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	}
	function onDocumentMouseOut() {
		document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	}
	// function onDocumentTouchStart( event ) {
	// 	if ( event.touches.length === 1 ) {
	// 		event.preventDefault();
	// 		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
	// 		targetRotationOnMouseDown = targetRotation;
	// 	}
	// }
	// function onDocumentTouchMove( event ) {
	// 	if ( event.touches.length === 1 ) {
	// 		event.preventDefault();
	// 		mouseX = event.touches[ 0 ].pageX - windowHalfX;
	// 		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
	// 	}
	// }
	function animate() {
		var delta = 5 * clock.getDelta();
		uniforms[ "time" ].value += 0.2 * delta;

		requestAnimationFrame( animate );
		group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
		camera.lookAt( cameraTarget );
		renderer.render( scene, camera );
	}
}

export default hs;