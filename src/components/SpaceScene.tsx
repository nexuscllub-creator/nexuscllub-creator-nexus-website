'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SpaceScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    // Transparent scene to show the CSS radial gradient


    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x442211, 0.5));
    const sun = new THREE.DirectionalLight(0xffd28a, 1.6);
    sun.position.set(-200, 120, 300);
    scene.add(sun);
    
    const rim = new THREE.PointLight(0xff7733, 1.4, 700);
    rim.position.set(220, -60, 120);
    scene.add(rim);

    // --- Space Dust ---
    // Generate a round glowing texture for particles to remove the square look
    const createRoundTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32; canvas.height = 32;
      const context = canvas.getContext('2d')!;
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    };
    const dustTexture = createRoundTexture();

    const layersConfig = [
        { count: isMobile ? 12000 : 25000, size: 0.6, colorRange: { hue: [0.08, 0.15], sat: [0.8, 1], light: [0.5, 0.8] }, rotationSpeed: 0.0005 },
        { count: isMobile ? 15000 : 30000, size: 0.45, colorRange: { hue: [0.10, 0.18], sat: [0.7, 1], light: [0.4, 0.7] }, rotationSpeed: 0.0003 }
    ];

    const particleLayers: THREE.Points[] = [];
    const dustGroup = new THREE.Group();
    scene.add(dustGroup);

    // Ripple state for interactions
    type Ripple = { x: number; y: number; radius: number; strength: number; maxRadius: number; speed: number; color: THREE.Color };
    const ripples: Ripple[] = [];
    const mouseRadius = 20;
    let settleFrames = 0;

    const createRipple = (x: number, y: number) => {
        ripples.push({
            x, y,
            radius: 0,
            strength: 2.5,
            maxRadius: mouseRadius * 4,
            speed: 4,
            color: new THREE.Color(0xffffff)
        });
        settleFrames = 150; // Keep simulating physics for 150 frames to let particles return to base
    };

    const onMouseClick = (event: MouseEvent) => {
        const clickMouse = new THREE.Vector2();
        clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        const vector = new THREE.Vector3(clickMouse.x, clickMouse.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        createRipple(pos.x, pos.y);
    };
    window.addEventListener('click', onMouseClick);

    layersConfig.forEach(config => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.count * 3);
        const colors = new Float32Array(config.count * 3);
        const velocities = new Float32Array(config.count * 3);
        const basePositions = new Float32Array(config.count * 3);
        const baseColors = new Float32Array(config.count * 3);
        const colorVelocities = new Float32Array(config.count * 3);

        for (let i = 0; i < config.count; i++) {
            const i3 = i * 3;
            // Radius constrained exactly like original for maximum visual density
            const radius = 10 + Math.random() * 110; 
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            basePositions[i3] = x;
            basePositions[i3 + 1] = y;
            basePositions[i3 + 2] = z;

            const dist = Math.sqrt(x * x + y * y + z * z) / 110;
            const hue = THREE.MathUtils.lerp(config.colorRange.hue[0], config.colorRange.hue[1], dist);
            const sat = THREE.MathUtils.lerp(config.colorRange.sat[0], config.colorRange.sat[1], dist);
            const light = THREE.MathUtils.lerp(config.colorRange.light[0], config.colorRange.light[1], dist);

            const color = new THREE.Color().setHSL(hue, sat, light);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            baseColors[i3] = color.r;
            baseColors[i3 + 1] = color.g;
            baseColors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: config.size,
            map: dustTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        points.userData = { 
            rotationSpeed: config.rotationSpeed,
            velocities, basePositions, baseColors, colorVelocities
        };
        particleLayers.push(points);
        dustGroup.add(points);
    });

    // --- Advanced Galaxy Shader (from src2) ---
    const galaxyParameters = {
      count: isMobile ? 30000 : 100000,
      size: 0.015,
      radius: 60,
      branches: 3,
      spin: 1,
      randomness: 0.25,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984'
    };

    const galaxyGeometry = new THREE.BufferGeometry();
    const gPositions = new Float32Array(galaxyParameters.count * 3);
    const gColors = new Float32Array(galaxyParameters.count * 3);
    const gScales = new Float32Array(galaxyParameters.count * 1);
    const colorInside = new THREE.Color(galaxyParameters.insideColor);
    const colorOutside = new THREE.Color(galaxyParameters.outsideColor);

    for(let i=0; i<galaxyParameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * galaxyParameters.radius;
        const spinAngle = radius * galaxyParameters.spin;
        const branchAngle = (i % galaxyParameters.branches) / galaxyParameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * radius;
        const randomY = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.randomness * radius;

        gPositions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        gPositions[i3 + 1] = randomY * 0.5;
        gPositions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / galaxyParameters.radius);
        gColors[i3    ] = mixedColor.r;
        gColors[i3 + 1] = mixedColor.g;
        gColors[i3 + 2] = mixedColor.b;

        gScales[i] = Math.random();
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(gPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(gColors, 3));
    galaxyGeometry.setAttribute('aScale', new THREE.BufferAttribute(gScales, 1));

    const galaxyMaterial = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: 25 * renderer.getPixelRatio() }
        },
        vertexShader: `
            uniform float uTime;
            uniform float uSize;
            attribute float aScale;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                float angle = atan(modelPosition.x, modelPosition.z);
                float distanceToCenter = length(modelPosition.xz);
                float angleOffset = (1.0 / distanceToCenter) * uTime * 0.4;
                angle += angleOffset;
                modelPosition.x = cos(angle) * distanceToCenter;
                modelPosition.z = sin(angle) * distanceToCenter;
                vec4 viewPosition = viewMatrix * modelPosition;
                gl_Position = projectionMatrix * viewPosition;
                gl_PointSize = uSize * aScale;
                gl_PointSize *= (1.0 / -viewPosition.z);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = 1.0 - strength;
                strength = pow(strength, 10.0);
                gl_FragColor = vec4(vColor * strength, 1.0);
            }
        `
    });

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.position.set(-220, 140, -250);
    galaxy.rotation.set(-0.65, 0.45, 0.35);
    scene.add(galaxy);

    // --- Earth with Atmospheric Glow ---
    const earthGroup = new THREE.Group();
    earthGroup.position.set(155, 55, -20);
    scene.add(earthGroup);

    // Earth Texture from part1.html
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("https://upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg");
    // Ensure colors look good
    if (typeof THREE.SRGBColorSpace !== 'undefined') earthTexture.colorSpace = THREE.SRGBColorSpace;
    
    const earthMaterial = new THREE.MeshLambertMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(28, 64, 64), earthMaterial);
    earthGroup.add(earth);

    // Removed Atmospheric Glow Shader

    // --- Saturn ---
    const saturnGroup = new THREE.Group();
    saturnGroup.position.set(-150, 10, -50);
    saturnGroup.rotation.z = 0.35;
    scene.add(saturnGroup);

    const saturn = new THREE.Mesh(
      new THREE.SphereGeometry(15, 48, 48),
      new THREE.MeshStandardMaterial({ color: 0xc8965a, roughness: 0.9 })
    );
    saturnGroup.add(saturn);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(20, 30, 96),
      new THREE.MeshBasicMaterial({ color: 0xd9b173, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
    );
    ring.rotation.x = Math.PI / 2.3;
    saturnGroup.add(ring);

    // --- Professional Cinematic Meteors ---
    type Meteor = { group: THREE.Group; vel: THREE.Vector3; life: number; decay: number };
    const meteors: Meteor[] = [];

    const createHeadTexture = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(255, 255, 255, 1)");
      g.addColorStop(0.15, "rgba(255, 240, 180, 1)");
      g.addColorStop(0.4, "rgba(255, 160, 40, 0.8)");
      g.addColorStop(0.7, "rgba(255, 60, 10, 0.3)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    };

    const createTailTexture = () => {
        const c = document.createElement("canvas");
        c.width = 256; c.height = 32;
        const ctx = c.getContext("2d")!;
        const g = ctx.createLinearGradient(256, 16, 0, 16); 
        g.addColorStop(0, "rgba(255, 255, 255, 1)");
        g.addColorStop(0.1, "rgba(255, 220, 100, 0.9)");
        g.addColorStop(0.4, "rgba(255, 100, 20, 0.5)");
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 256, 32);
        return new THREE.CanvasTexture(c);
    };

    const headTex = createHeadTexture();
    const tailTex = createTailTexture();

    const ANGLES = [
      Math.PI * 1.15, Math.PI * 1.20, Math.PI * 1.25,
      -Math.PI * 0.15, -Math.PI * 0.20, -Math.PI * 0.25,
      Math.PI * 0.85, Math.PI * 0.80,
    ];

    const spawnMeteor = () => {
      const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
      const speed = 4.0 + Math.random() * 3.5; // High speed for cinematic feel
      const fromTop = Math.random() > 0.25;
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 800,
        fromTop ? 250 + Math.random() * 150 : (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 150
      );
      const vx = Math.cos(angle), vy = Math.sin(angle);
      start.x -= vx * 400;
      start.y -= vy * 200;
      const vel = new THREE.Vector3(vx, vy, 0).multiplyScalar(speed);

      const group = new THREE.Group();
      group.position.copy(start);

      // 1. Long Cinematic Tail
      const tailLength = 250 + Math.random() * 200;
      const tailThickness = 8 + Math.random() * 8;
      const tailMat = new THREE.SpriteMaterial({
          map: tailTex,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          rotation: Math.atan2(vy, vx)
      });
      const tail = new THREE.Sprite(tailMat);
      tail.scale.set(tailLength, tailThickness, 1);
      const shiftDir = vel.clone().normalize();
      tail.position.copy(shiftDir.clone().multiplyScalar(-tailLength / 2.1));
      group.add(tail);

      // 2. Wide Glow
      const glowMat = new THREE.SpriteMaterial({ map: headTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8 });
      const glow = new THREE.Sprite(glowMat);
      const glowSize = 50 + Math.random() * 30;
      glow.scale.set(glowSize, glowSize, 1);
      group.add(glow);

      // 3. Hot Core
      const coreMat = new THREE.SpriteMaterial({ map: headTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: 0xffffff });
      const core = new THREE.Sprite(coreMat);
      const coreSize = 14 + Math.random() * 8;
      core.scale.set(coreSize, coreSize, 1);
      group.add(core);

      scene.add(group);
      meteors.push({ group, vel, life: 1, decay: 0.0025 + Math.random() * 0.002 });
    };

    const updateParticles = () => {
        if (ripples.length === 0) {
            if (settleFrames <= 0) return;
            settleFrames--;
        }

        for (let r = ripples.length - 1; r >= 0; r--) {
            const ripple = ripples[r];
            ripple.radius += ripple.speed;
            ripple.strength *= 0.96;
            if (ripple.radius >= ripple.maxRadius) ripples.splice(r, 1);
        }

        particleLayers.forEach(layer => {
            const positions = layer.geometry.attributes.position.array as Float32Array;
            const colors = layer.geometry.attributes.color.array as Float32Array;
            const { velocities, basePositions, baseColors, colorVelocities } = layer.userData;
            const totalParticles = positions.length / 3;

            for (let i = 0; i < totalParticles; i++) {
                const i3 = i * 3;
                const px = positions[i3];
                const py = positions[i3 + 1];
                const pz = positions[i3 + 2];

                let totalForceX = 0, totalForceY = 0;
                let colorShiftX = 0, colorShiftY = 0, colorShiftZ = 0;

                for (let r = 0; r < ripples.length; r++) {
                    const ripple = ripples[r];
                    const dx = px - ripple.x;
                    const dy = py - ripple.y;
                    const rippleDist = Math.sqrt(dx * dx + dy * dy);
                    const rippleWidth = 15;
                    
                    if (Math.abs(rippleDist - ripple.radius) < rippleWidth) {
                        const falloff = 1 - Math.abs(rippleDist - ripple.radius) / rippleWidth;
                        const rippleForce = ripple.strength * falloff * 0.1;
                        
                        const dist2D = rippleDist || 1;
                        totalForceX += (dx / dist2D) * rippleForce;
                        totalForceY += (dy / dist2D) * rippleForce;
                        
                        const rStrength = falloff * ripple.strength;
                        colorShiftX += ripple.color.r * rStrength;
                        colorShiftY += ripple.color.g * rStrength;
                        colorShiftZ += ripple.color.b * rStrength;
                    }
                }

                velocities[i3] += totalForceX;
                velocities[i3 + 1] += totalForceY;

                const returnForce = 0.02;
                velocities[i3] += (basePositions[i3] - px) * returnForce;
                velocities[i3 + 1] += (basePositions[i3 + 1] - py) * returnForce;
                velocities[i3 + 2] += (basePositions[i3 + 2] - pz) * returnForce;

                const damping = 0.94;
                velocities[i3] *= damping;
                velocities[i3 + 1] *= damping;
                velocities[i3 + 2] *= damping;

                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];

                colorVelocities[i3] += colorShiftX;
                colorVelocities[i3 + 1] += colorShiftY;
                colorVelocities[i3 + 2] += colorShiftZ;

                const colorReturnForce = 0.05;
                colorVelocities[i3] += (baseColors[i3] - colors[i3]) * colorReturnForce;
                colorVelocities[i3 + 1] += (baseColors[i3 + 1] - colors[i3 + 1]) * colorReturnForce;
                colorVelocities[i3 + 2] += (baseColors[i3 + 2] - colors[i3 + 2]) * colorReturnForce;

                const colorDamping = 0.9;
                colorVelocities[i3] *= colorDamping;
                colorVelocities[i3 + 1] *= colorDamping;
                colorVelocities[i3 + 2] *= colorDamping;

                colors[i3] += colorVelocities[i3];
                colors[i3 + 1] += colorVelocities[i3 + 1];
                colors[i3 + 2] += colorVelocities[i3 + 2];
            }

            layer.geometry.attributes.position.needsUpdate = true;
            layer.geometry.attributes.color.needsUpdate = true;
        });
    };

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      galaxyMaterial.uniforms.uTime.value = elapsedTime;
      
      updateParticles();

      // Rotate the dust layers for a cosmic feel
      particleLayers.forEach(layer => {
          layer.rotation.y += layer.userData.rotationSpeed;
          layer.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;
      });

      // Subtle camera drift
      camera.position.x = Math.sin(elapsedTime * 0.2) * 2;
      camera.position.y = Math.cos(elapsedTime * 0.3) * 2;
      camera.lookAt(scene.position);

      earth.rotation.y += 0.004;
      saturn.rotation.y += 0.003;
      saturnGroup.rotation.y += 0.001;

      // Professional Meteors Update
      if (Math.random() < 0.012) spawnMeteor(); // spawn rate
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.group.position.add(m.vel);
        m.life -= m.decay;
        
        m.group.scale.setScalar(m.life); // Shrink gracefully as it dies
        
        m.group.children.forEach(child => {
            if (child instanceof THREE.Sprite && child.material) {
                child.material.opacity = m.life;
            }
        });

        if (m.life <= 0) {
          scene.remove(m.group);
          m.group.children.forEach(child => {
              if (child instanceof THREE.Sprite) {
                  child.material.dispose();
              }
          });
          meteors.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
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
      window.removeEventListener("click", onMouseClick);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
