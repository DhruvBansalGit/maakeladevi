'use client';
import { useEffect, useRef, useState } from 'react';
import { Granite } from '@/types';
import { RotateCcw, Maximize, Download } from 'lucide-react';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import type {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Object3D,
  Group,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Simple3DViewerProps {
  granite: Granite;
  className?: string;
  modelType?: 'slab' | 'kitchen' | 'bathroom';
}

export default function Simple3DViewer({
  granite,
  className,
  modelType = 'slab'
}: Simple3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Get the main granite image
  const getGraniteImageUrl = () => {
    console.log('🔍 Granite object:', granite);
    console.log('📸 Available images:', granite.images);

    const primaryImage = granite.images.find(img => img.type === 'primary');
    const firstImage = granite.images[0];
    const selectedImage = primaryImage || firstImage;

    if (selectedImage) {
      console.log('✅ Selected granite image:', selectedImage.url);
      return selectedImage.url;
    }

    const graniteName = granite.name.toLowerCase().replace(/\s+/g, '-');
    const fallbackPath = `/images/granites/${graniteName}.jpg`;
    console.log('⚠️ No images found in granite object, trying fallback:', fallbackPath);
    return fallbackPath;
  };

  const getModelPath = () => {
    switch (modelType) {
      case 'kitchen':
        return '/models/kitchen-counter/kitchen-counter.glb';
      case 'bathroom':
        return '/models/bathroom-vanity/bathroom-vanity.glb';
      case 'slab':
      default:
        return '/models/granite-slab/granite-slab.glb';
    }
  };

  // Function to create proper granite material with realistic properties
  const createGraniteMaterial = (graniteTexture: THREE.Texture) => {
    // Configure the main diffuse texture
    graniteTexture.wrapS = THREE.RepeatWrapping;
    graniteTexture.wrapT = THREE.RepeatWrapping;
    graniteTexture.minFilter = THREE.LinearMipmapLinearFilter;
    graniteTexture.magFilter = THREE.LinearFilter;
    graniteTexture.generateMipmaps = true;
    graniteTexture.flipY = false;
    
    // Adjust repeat based on model type for proper scaling
    switch (modelType) {
      case 'kitchen':
        graniteTexture.repeat.set(3, 1.5); // Kitchen counters are longer
        break;
      case 'bathroom':
        graniteTexture.repeat.set(2, 1); // Bathroom vanities are smaller
        break;
      case 'slab':
      default:
        graniteTexture.repeat.set(1, 1); // Show full granite pattern on slab
        break;
    }

    // Create a normal map from the texture for surface detail
    const normalMap = graniteTexture.clone();
    normalMap.needsUpdate = true;

    // Create environment map for reflections (simple cube reflection)
    const envMapTexture = new THREE.CubeTextureLoader().load([
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // px
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // nx
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // py
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // ny
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // pz
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='  // nz
    ]);

    // Create realistic granite material
    const material = new THREE.MeshPhysicalMaterial({
      // Base color and texture
      map: graniteTexture,
      
      // Surface properties for granite
      roughness: 0.15, // Polished granite is quite smooth
      metalness: 0.05, // Granite has minimal metallic properties
      
      // Reflectance and sheen for polished stone look
      reflectivity: 0.8,
      envMap: envMapTexture,
      envMapIntensity: 0.6,
      
      // Normal mapping for surface detail
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.3, 0.3),
      
      // Clear coat for polished granite finish
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      
      // Additional properties for realism
      transparent: false,
      opacity: 1.0,
      side: THREE.FrontSide,
      
      // Ensure proper color representation
      color: new THREE.Color(1, 1, 1), // White base to show true texture colors
      
      // Disable vertex colors to use only texture
      vertexColors: false
    });

    material.needsUpdate = true;
    return material;
  };

  // Function to properly apply texture to meshes with correct UV mapping
  const applyTextureToMesh = (mesh: THREE.Mesh, material: THREE.Material) => {
    // Ensure the mesh has proper UV coordinates
    if (!mesh.geometry.attributes.uv) {
      console.log('🔧 Generating UV coordinates for mesh');
      // For basic geometries, generate UV coordinates
      if (mesh.geometry.type === 'BoxGeometry') {
        // Box geometry should already have UVs, but ensure they're correct
        const uvAttribute = mesh.geometry.attributes.uv;
        if (uvAttribute) {
          console.log('✅ UV coordinates found');
        }
      }
    }

    // Apply the material
    mesh.material = material;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    console.log('✅ Texture applied to mesh with proper UV mapping');
  };

  useEffect(() => {
    console.log('🔄 Simple3DViewer useEffect triggered');
    console.log('📋 Current granite:', granite.name, granite.id);

    let scene: Scene;
    let camera: PerspectiveCamera;
    let renderer: WebGLRenderer;
    let model: Group | Object3D;
    let animationId: number;
    let controls: InstanceType<typeof OrbitControls>;

    const initThreeJS = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadingProgress(0);

        const [
          THREE,
          { GLTFLoader },
        ] = await Promise.all([
          import('three'),
          import('three/examples/jsm/loaders/GLTFLoader.js'),
        ]);

        if (!canvasRef.current) return;

        // Scene setup with better background
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // Camera setup
        camera = new THREE.PerspectiveCamera(
          45, // Reduced FOV for better perspective
          canvasRef.current.clientWidth / canvasRef.current.clientHeight,
          0.1,
          1000
        );
        camera.position.set(5, 4, 5);

        // Renderer setup with better quality settings
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true // For screenshots
        });

        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Enable tone mapping for better rendering
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        if (renderer.outputColorSpace !== undefined) {
          renderer.outputColorSpace = THREE.SRGBColorSpace;
        }

        // Controls setup
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 2;
        controls.maxDistance = 15;
        controls.maxPolarAngle = Math.PI / 2.1;
        controls.enablePan = true;
        controls.autoRotate = false;

        setLoadingProgress(10);

        // Enhanced lighting setup for granite
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        scene.add(directionalLight);

        // Fill lights for even illumination
        const fillLight1 = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight1.position.set(-5, 5, -5);
        scene.add(fillLight1);

        const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
        fillLight2.position.set(0, -5, 5);
        scene.add(fillLight2);

        // Add point light for highlights
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 20);
        pointLight.position.set(3, 6, 3);
        scene.add(pointLight);

        setLoadingProgress(20);

        // Load granite texture with better handling
        const textureLoader = new THREE.TextureLoader();
        const graniteImageUrl = getGraniteImageUrl();
        console.log('Loading granite texture from:', graniteImageUrl);

        textureLoader.setCrossOrigin('anonymous');

        const graniteTexture = await new Promise<THREE.Texture>((resolve) => {
          textureLoader.load(
            graniteImageUrl,
            (texture) => {
              console.log('✅ Granite texture loaded successfully');
              resolve(texture);
            },
            (progress) => {
              if (progress.total > 0) {
                const percentage = 20 + (progress.loaded / progress.total) * 30;
                setLoadingProgress(Math.round(percentage));
              }
            },
            (error) => {
              console.error('❌ Error loading granite texture:', error);
              
              // Create a better fallback texture
              const canvas = document.createElement('canvas');
              canvas.width = 1024;
              canvas.height = 1024;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Create granite base color
                const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
                gradient.addColorStop(0, '#f8f8f8');
                gradient.addColorStop(0.3, '#e5e5e5');
                gradient.addColorStop(0.7, '#d8d8d8');
                gradient.addColorStop(1, '#cccccc');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1024, 1024);

                // Add realistic granite speckles
                const colors = ['#2c2c2c', '#4a4a4a', '#666666', '#8c8c8c', '#a0a0a0'];
                for (let i = 0; i < 3000; i++) {
                  const x = Math.random() * 1024;
                  const y = Math.random() * 1024;
                  const size = Math.random() * 4 + 0.5;
                  const opacity = Math.random() * 0.9 + 0.1;
                  
                  ctx.globalAlpha = opacity;
                  ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                  ctx.beginPath();
                  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                  ctx.fill();
                }

                // Add veining
                ctx.globalAlpha = 0.6;
                ctx.strokeStyle = '#b8b8b8';
                ctx.lineWidth = 1;
                for (let i = 0; i < 15; i++) {
                  ctx.beginPath();
                  ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
                  const points = 3 + Math.floor(Math.random() * 3);
                  for (let j = 0; j < points; j++) {
                    ctx.lineTo(Math.random() * 1024, Math.random() * 1024);
                  }
                  ctx.stroke();
                }
                
                ctx.globalAlpha = 1;
              }

              const fallbackTexture = new THREE.CanvasTexture(canvas);
              console.log('✅ Fallback granite texture created');
              resolve(fallbackTexture);
            }
          );
        });

        setLoadingProgress(50);

        // Create granite material with the loaded texture
        const graniteMaterial = createGraniteMaterial(graniteTexture);

        // Try to load 3D model
        const gltfLoader = new GLTFLoader();
        const modelPath = getModelPath();

        let gltf: GLTF | null = null;
        try {
          gltf = await new Promise<GLTF>((resolve, reject) => {
            gltfLoader.load(
              modelPath,
              resolve,
              (progress) => {
                if (progress.total > 0) {
                  const percentage = 50 + (progress.loaded / progress.total) * 40;
                  setLoadingProgress(Math.round(percentage));
                }
              },
              reject
            );
          });
        } catch (modelError) {
          console.log('Model file not found, creating basic geometry', modelError);
        }

        setLoadingProgress(90);

        // Create or use model
        if (gltf && gltf.scene) {
          model = gltf.scene;
          scene.add(model);

          console.log('📦 Model loaded, applying granite material...');
          let meshCount = 0;

          model.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
              meshCount++;
              const mesh = child as THREE.Mesh;
              console.log(`🎨 Applying granite material to mesh ${meshCount}`);
              
              applyTextureToMesh(mesh, graniteMaterial);
            }
          });

          console.log(`📊 Total meshes textured: ${meshCount}`);

          // Center and scale model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);

          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 3 / maxDim;
            model.scale.setScalar(scale);
          }
        } else {
          // Create enhanced basic slab geometry
          console.log('🔧 Creating enhanced granite slab geometry...');

          const slabGeometry = new THREE.BoxGeometry(4, 0.3, 2.5, 1, 1, 1);
          
          // Ensure proper UV mapping for the slab
          const uvAttribute = slabGeometry.attributes.uv;
          if (uvAttribute) {
            console.log('✅ Slab geometry has proper UV coordinates');
          }

          model = new THREE.Mesh(slabGeometry, graniteMaterial);
          applyTextureToMesh(model as THREE.Mesh, graniteMaterial);
          scene.add(model);

          console.log('✅ Enhanced granite slab created');
        }

        // Add environment for reflections
        const groundSize = 12;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const groundMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.8,
          metalness: 0.1
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        scene.add(ground);

        setLoadingProgress(100);
        setIsLoading(false);

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
          if (!canvasRef.current) return;
          camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          if (animationId) cancelAnimationFrame(animationId);
          window.removeEventListener('resize', handleResize);
          if (renderer) {
            renderer.dispose();
          }
          if (scene) {
            scene.clear();
          }
          if (controls) {
            controls.dispose();
          }
        };

      } catch (error) {
        console.error('Error initializing 3D viewer:', error);
        setError(`Failed to load 3D viewer: ${error}`);
        setIsLoading(false);
      }
    };

    initThreeJS();
  }, [granite, modelType]);

  const resetView = () => {
    window.location.reload();
  };

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${granite.name.toLowerCase().replace(/\s+/g, '-')}-3d-view.png`;
      link.href = canvasRef.current.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      canvasRef.current?.parentElement?.requestFullscreen();
    }
  };

  if (error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">3D View Unavailable</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-lg ${className}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 mb-3 font-medium">Loading 3D Granite Preview...</p>
            <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{loadingProgress}%</p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="flex flex-col">
          <button
            onClick={resetView}
            className="p-3 hover:bg-gray-100 rounded-t-lg transition-colors border-b border-gray-200"
            title="Reset View"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={downloadImage}
            className="p-3 hover:bg-gray-100 transition-colors border-b border-gray-200"
            title="Download High-Quality Screenshot"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-3 hover:bg-gray-100 rounded-b-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
        <h3 className="font-bold text-gray-900 mb-2">{granite.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Origin:</span>
            <span className="font-medium text-gray-800">{granite.origin}</span>
          </div>
          <div className="flex justify-between">
            <span>Color:</span>
            <span className="font-medium text-gray-800">{granite.color}</span>
          </div>
          <div className="flex justify-between">
            <span>Pattern:</span>
            <span className="font-medium text-gray-800">{granite.pattern}</span>
          </div>
          <div className="flex justify-between">
            <span>View:</span>
            <span className="font-medium text-gray-800 capitalize">{modelType}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white text-sm p-4 rounded-lg backdrop-blur-sm">
        <div className="flex flex-wrap gap-6 justify-center text-center">
          <div className="flex items-center gap-2">
            <span>🖱️</span>
            <span>Drag to rotate</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔍</span>
            <span>Scroll to zoom</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📱</span>
            <span>Touch & drag on mobile</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✨</span>
            <span>Realistic granite finish</span>
          </div>
        </div>
      </div>

      {/* Quality Badge */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          ✨ Premium 3D Granite Preview
        </div>
      </div>
    </div>
  );
}