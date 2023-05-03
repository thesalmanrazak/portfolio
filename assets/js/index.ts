import * as THREE from '../build/three.module';
import { GLTFLoader } from './assets/jsm/loaders/GLTFLoader.js';
import { ThreeJSOverlayView } from "https://unpkg.com/@googlemaps/three/dist/index.esm.js";

let map: google.maps.Map;

const mapOptions = {
  tilt: 0,
  heading: 0,
  zoom: 25,
  center: { lat: -33.8929919, lng: 151.2149274 },
  mapId: "15431d2b469f209e",
  // disable interactions due to animation loop and moveCamera
  disableDefaultUI: true,
  gestureHandling: "none",
  keyboardShortcuts: false
};

function initMap(): void {
  const mapDiv = document.getElementById("map") as HTMLElement;

  map = new google.maps.Map(mapDiv, mapOptions);

  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);

  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);

  directionalLight.position.set(0, 10, 50);
  scene.add(directionalLight);

  // Load the model.
  const loader = new GLTFLoader();
  const url =
    "https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf";

  loader.load(url, (gltf) => {
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.rotation.x = Math.PI / 2;
    scene.add(gltf.scene);

    let { tilt, heading, zoom } = mapOptions;

    const animate = () => {
      if (tilt < 50.5) {
        tilt += 0.5;
      } else if (heading <= 360) {
        heading += 0.2;
        zoom -= 0.0005;
      } else {
        // exit animation loop
        return;
      }

      map.moveCamera({ tilt, heading, zoom });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });

  new ThreeJSOverlayView({
    map,
    scene,
    // anchor: { ...mapOptions.center, altitude: 100 },
    THREE
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export { initMap };