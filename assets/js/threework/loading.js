import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { HDRIs } from './assets/hdri/snow_field_puresky_4k.hdr';

const container = document.getElementById('container');

const div = document.querySelector("div#div1");

let cube, scene, camera, renderer, controls, car;
let object;

init().then( animate );

async function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.set(0,5,5);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    new RGBELoader().load( HDRIs, function ( texture ) {                
        texture.mapping = THREE.EquirectangularReflectionMapping; //scene.background = texture;
        scene.environment = texture;
    });





    
    
    function loadModel() {
        object.position.y = 0;
        scene.add( object );
    }



    const manager = new THREE.LoadingManager( loadModel );


    function onProgress( xhr ) {
        if ( xhr.lengthComputable ) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
            div.innerHTML = Math.round( percentComplete, 2 );
        }
    }
    function onError() {}

    const loader = new GLTFLoader( manager );

    loader.load( './assets/models/car.gltf', function ( obj ) {
        object = obj.scene;
    }, onProgress, onError );


    





    controls = new OrbitControls( camera, renderer.domElement );

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    requestAnimationFrame( animate );

    controls.update();
    
    renderer.render( scene, camera );
}