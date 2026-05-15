'use client';

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function BinarySystemScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [orbitSpeedFactor, setOrbitSpeedFactor] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [selectedBody, setSelectedBody] = useState("");
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Expose these refs for the UI to interact with
  const bodiesRef = useRef<{ [key: string]: THREE.Object3D | null }>({
    blueGiantSun: null,
    sunSphere: null,
    mercurySphere: null,
    venusSphere: null,
    earthSphere: null,
    moonSphere: null,
    marsSphere: null,
    jupiterSphere: null,
    saturnSphere: null,
    uranusSphere: null,
    neptuneSphere: null,
    plutoSphere: null,
  });

  const orbitsRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
    cameraRef.current = camera;
    const defaultCameraPosition = new THREE.Vector3(0, 250, 1100);
    camera.position.copy(defaultCameraPosition);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const clock = new THREE.Clock();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI;
    controls.maxDistance = 12000;
    controls.target.set(0, 0, 0);

    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const moonGeometry = new THREE.SphereGeometry(2, 32, 32);
    const mercuryGeometry = new THREE.SphereGeometry(3, 32, 32);
    const venusGeometry = new THREE.SphereGeometry(4, 32, 32);
    const jupiterGeometry = new THREE.SphereGeometry(8, 64, 64);
    const saturnGeometry = new THREE.SphereGeometry(7, 64, 64);
    const uranusGeometry = new THREE.SphereGeometry(6, 64, 64);
    const neptuneGeometry = new THREE.SphereGeometry(6, 64, 64);
    const plutoGeometry = new THREE.SphereGeometry(1, 32, 32);

    const imageUrlEarth = "https://upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg";
    const imageUrlMoon = "https://upload.wikimedia.org/wikipedia/commons/d/d1/Solarsystemscope_texture_8k_moon.jpg";
    const imageUrlMars = "https://upload.wikimedia.org/wikipedia/commons/7/70/Solarsystemscope_texture_8k_mars.jpg";
    const imageUrlSun = "https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg";
    const imageUrlMercury = "https://upload.wikimedia.org/wikipedia/commons/2/27/Solarsystemscope_texture_8k_mercury.jpg";
    const imageUrlVenus = "https://upload.wikimedia.org/wikipedia/commons/1/1c/Solarsystemscope_texture_8k_venus_surface.jpg";
    const imageUrlBlueGiantSun = "https://upload.wikimedia.org/wikipedia/commons/9/99/Blue_sun_map.png";
    const imageUrlJupiter = "https://upload.wikimedia.org/wikipedia/commons/5/5e/Solarsystemscope_texture_8k_jupiter.jpg";
    const imageUrlSaturn = "https://upload.wikimedia.org/wikipedia/commons/1/1e/Solarsystemscope_texture_8k_saturn.jpg";
    const imageUrlUranus = "https://upload.wikimedia.org/wikipedia/commons/9/95/Solarsystemscope_texture_2k_uranus.jpg";
    const imageUrlNeptune = "https://upload.wikimedia.org/wikipedia/commons/1/1e/Solarsystemscope_texture_2k_neptune.jpg";
    const imageUrlPluto = "https://upload.wikimedia.org/wikipedia/commons/3/30/Pluto-map-sept-16-2015.jpg";

    const textureLoader = new THREE.TextureLoader();
    const texturesToLoad = {
        earth: imageUrlEarth, moon: imageUrlMoon, mars: imageUrlMars, sun: imageUrlSun,
        mercury: imageUrlMercury, venus: imageUrlVenus, blueGiantSun: imageUrlBlueGiantSun,
        jupiter: imageUrlJupiter, saturn: imageUrlSaturn, uranus: imageUrlUranus,
        neptune: imageUrlNeptune, pluto: imageUrlPluto
    };

    const loadTexture = (url: string) => new Promise<THREE.Texture>((resolve) => textureLoader.load(url, resolve));

    let orbits = new THREE.Group();
    orbitsRef.current = orbits;
    scene.add(orbits);

    const planetData: any[] = [];
    let moonOrbitGroup: THREE.Object3D | null = null;
    let blueGiantSunObject: THREE.Mesh | null = null;
    let sunSphereObject: THREE.Mesh | null = null;

    Promise.all(Object.values(texturesToLoad).map(loadTexture)).then((textures) => {
      const [
          earthTexture, moonTexture, marsTexture, sunTexture, mercuryTexture, venusTexture,
          blueGiantSunTexture, jupiterTexture, saturnTexture, uranusTexture, neptuneTexture, plutoTexture
      ] = textures;

      const blueGiantMass = 20;
      const sunMass = 10;
      const totalMass = blueGiantMass + sunMass;
      const distanceBetweenSuns = 100;

      const barycenter = new THREE.Object3D();
      scene.add(barycenter);

      // Blue Giant Sun
      const blueGiantSun = new THREE.Mesh(new THREE.SphereGeometry(20, 128, 128), new THREE.MeshBasicMaterial({ map: blueGiantSunTexture }));
      blueGiantSun.position.x = -(distanceBetweenSuns * sunMass) / totalMass;
      barycenter.add(blueGiantSun);
      blueGiantSunObject = blueGiantSun;
      bodiesRef.current.blueGiantSun = blueGiantSun;

      // Sun
      const sunSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 64), new THREE.MeshBasicMaterial({ map: sunTexture }));
      sunSphere.position.x = (distanceBetweenSuns * blueGiantMass) / totalMass;
      barycenter.add(sunSphere);
      sunSphereObject = sunSphere;
      bodiesRef.current.sunSphere = sunSphere;

      const createPlanet = (name: string, geom: THREE.BufferGeometry, tex: THREE.Texture, radX: number, radZ: number, speed: number) => {
        const mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({ map: tex }));
        const data = {
          mesh, orbitInclination: Math.random() * 0.5,
          orbitRadiusX: radX * (1 + (Math.random() - 0.5) * 0.9),
          orbitRadiusZ: radZ * (1 + (Math.random() - 0.5) * 0.9),
          orbitSpeed: speed, orbitalAngle: Math.random() * Math.PI * 2,
          orbitLine: null as THREE.Line | null
        };
        scene.add(mesh);
        bodiesRef.current[name] = mesh;
        planetData.push(data);
        return data;
      };

      createPlanet('mercurySphere', mercuryGeometry, mercuryTexture, 300, 300, 2.5);
      createPlanet('venusSphere', venusGeometry, venusTexture, 450, 450, 1.8);
      const earthData = createPlanet('earthSphere', geometry, earthTexture, 600, 600, 1.0);
      createPlanet('marsSphere', geometry, marsTexture, 750, 750, 0.8);
      createPlanet('jupiterSphere', jupiterGeometry, jupiterTexture, 850, 850, 0.4);
      
      const saturnData = createPlanet('saturnSphere', saturnGeometry, saturnTexture, 1000, 1000, 0.2);
      const saturnRings = new THREE.Mesh(new THREE.RingGeometry(9, 14, 64), new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide }));
      saturnRings.rotation.x = Math.PI / 2;
      saturnData.mesh.add(saturnRings);

      createPlanet('uranusSphere', uranusGeometry, uranusTexture, 1150, 1150, 0.1);
      createPlanet('neptuneSphere', neptuneGeometry, neptuneTexture, 1250, 1250, 0.05);
      createPlanet('plutoSphere', plutoGeometry, plutoTexture, 1350, 1350, 0.02);

      // Moon
      moonOrbitGroup = new THREE.Object3D();
      earthData.mesh.add(moonOrbitGroup);
      const moonSphere = new THREE.Mesh(moonGeometry, new THREE.MeshLambertMaterial({ map: moonTexture }));
      moonSphere.position.set(10, 0, 0);
      moonOrbitGroup.add(moonSphere);
      bodiesRef.current.moonSphere = moonSphere;

      // Draw Initial Orbits
      planetData.forEach(p => {
        const points = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 4;
          const x = Math.cos(p.orbitalAngle + theta) * p.orbitRadiusX;
          const z = Math.sin((p.orbitalAngle + theta) * 1.05) * p.orbitRadiusZ;
          const y = z * Math.tan(p.orbitInclination);
          points.push(new THREE.Vector3(x, y, z));
        }
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 }));
        orbits.add(line);
        p.orbitLine = line;
      });
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    let isReturningToCenter = false;
    let targetObj: THREE.Object3D | null = null;

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      // We read the latest ref values since they might change from React state
      // (Actually better to use a ref for speed to avoid re-binding)
      const currentSpeedFactor = document.getElementById("speed-data")?.dataset.speed ? parseFloat(document.getElementById("speed-data")!.dataset.speed!) : 1;
      const currentSelected = document.getElementById("target-data")?.dataset.target || "";

      if (currentSelected && bodiesRef.current[currentSelected]) {
        targetObj = bodiesRef.current[currentSelected];
        isReturningToCenter = false;
      } else {
        targetObj = null;
        if (currentSelected === "") isReturningToCenter = true; // only return if unselected
      }

      if (orbitsRef.current) {
         orbitsRef.current.visible = document.getElementById("orbits-data")?.dataset.show === 'true';
      }

      if (orbitsRef.current?.visible) {
        planetData.forEach(p => {
            if (p.orbitLine) {
                const positions = p.orbitLine.geometry.attributes.position.array;
                for (let i = 0; i <= 128; i++) {
                    const theta = (i / 128) * Math.PI * 4;
                    positions[i * 3] = Math.cos(p.orbitalAngle + theta) * p.orbitRadiusX;
                    positions[i * 3 + 2] = Math.sin((p.orbitalAngle + theta) * 1.05) * p.orbitRadiusZ;
                    positions[i * 3 + 1] = positions[i * 3 + 2] * Math.tan(p.orbitInclination);
                }
                p.orbitLine.geometry.attributes.position.needsUpdate = true;
            }
        });
      }

      if (blueGiantSunObject && sunSphereObject) {
          blueGiantSunObject.parent!.rotation.y -= 0.01 * currentSpeedFactor;
      }

      planetData.forEach(p => {
          p.orbitalAngle += delta * p.orbitSpeed * currentSpeedFactor;
          p.mesh.position.x = Math.cos(p.orbitalAngle) * p.orbitRadiusX;
          p.mesh.position.z = Math.sin(p.orbitalAngle * 1.05) * p.orbitRadiusZ;
          p.mesh.position.y = p.mesh.position.z * Math.tan(p.orbitInclination);
          p.mesh.rotation.y += p.orbitSpeed * 0.05 * currentSpeedFactor;
      });

      if (moonOrbitGroup && bodiesRef.current.moonSphere) {
          moonOrbitGroup.rotation.y += 0.03 * currentSpeedFactor;
          bodiesRef.current.moonSphere.rotation.y = -moonOrbitGroup.rotation.y;
      }

      if (targetObj) {
          const targetPosition = new THREE.Vector3();
          targetObj.getWorldPosition(targetPosition);
          const objectRadius = (targetObj as any).geometry?.parameters?.radius || 20;
          const cameraOffset = new THREE.Vector3(0, objectRadius * 1.5, objectRadius * 5);
          camera.position.lerp(targetPosition.clone().add(cameraOffset), 0.04);
          controls.target.lerp(targetPosition, 0.04);
      } else if (isReturningToCenter) {
          camera.position.lerp(defaultCameraPosition, 0.04);
          controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.04);
          if (camera.position.distanceTo(defaultCameraPosition) < 1) {
              isReturningToCenter = false;
          }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[url('https://images.alphacoders.com/104/1047578.jpg')] bg-cover bg-center overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Hidden data elements to pass state to the ThreeJS closure */}
      <div id="speed-data" data-speed={orbitSpeedFactor} className="hidden" />
      <div id="target-data" data-target={selectedBody} className="hidden" />
      <div id="orbits-data" data-show={showOrbits} className="hidden" />

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/20 text-white font-sans flex flex-col gap-3 shadow-2xl">
        <h1 className="text-lg font-bold text-gold-bright mb-1 border-b border-white/20 pb-2">Chaos Binary System</h1>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/80" htmlFor="body-select">Find Body:</label>
          <select 
            id="body-select"
            className="bg-black/80 border border-white/30 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-gold"
            value={selectedBody}
            onChange={(e) => setSelectedBody(e.target.value)}
          >
            <option value="">-- View All --</option>
            <option value="blueGiantSun">Blue Giant Sun</option>
            <option value="sunSphere">Sun</option>
            <option value="mercurySphere">Mercury</option>
            <option value="venusSphere">Venus</option>
            <option value="earthSphere">Earth</option>
            <option value="moonSphere">Moon</option>
            <option value="marsSphere">Mars</option>
            <option value="jupiterSphere">Jupiter</option>
            <option value="saturnSphere">Saturn</option>
            <option value="uranusSphere">Uranus</option>
            <option value="neptuneSphere">Neptune</option>
            <option value="plutoSphere">Pluto</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mt-1">
          <input 
            type="checkbox" 
            className="accent-gold w-4 h-4"
            checked={showOrbits}
            onChange={(e) => setShowOrbits(e.target.checked)}
          />
          <span className="text-sm">Show Orbits</span>
        </label>

        <div className="flex flex-col gap-1 mt-1">
          <label className="text-sm text-white/80 flex justify-between">
            Orbit Speed: <span className="text-gold">{orbitSpeedFactor.toFixed(1)}x</span>
          </label>
          <input 
            type="range" 
            min="0.1" max="5" step="0.1" 
            className="accent-gold"
            value={orbitSpeedFactor}
            onChange={(e) => setOrbitSpeedFactor(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
