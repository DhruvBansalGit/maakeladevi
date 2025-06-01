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
    // Debug: Log what granite images we have
    console.log('🔍 Granite object:', granite);
    console.log('📸 Available images:', granite.images);

    // Try to find primary image first, then fallback to first image
    const primaryImage = granite.images.find(img => img.type === 'primary');
    const firstImage = granite.images[0];

    const selectedImage = primaryImage || firstImage;

    if (selectedImage) {
      console.log('✅ Selected granite image:', selectedImage.url);
      console.log('🏷️ Image alt text:', selectedImage.alt);
      return selectedImage.url;
    }

    // If no images found, create a granite-specific fallback path
    const graniteName = granite.name.toLowerCase().replace(/\s+/g, '-');
    const fallbackPath = `/images/granites/${graniteName}.jpg`;

    console.log('⚠️ No images found in granite object, trying fallback:', fallbackPath);
    console.log('📋 Granite name:', granite.name);
    console.log('🔧 Generated filename:', graniteName);

    return fallbackPath;
  };

  // Get the 3D model path
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

  useEffect(() => {
    console.log('🔄 Simple3DViewer useEffect triggered');
    console.log('📋 Current granite:', granite.name, granite.id);
    console.log('📸 Granite images:', granite.images);

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

        // Dynamic import of Three.js to avoid SSR issues
        const [
          THREE,
          { GLTFLoader },
          { OrbitControls }
        ] = await Promise.all([
          import('three'),
          import('three/examples/jsm/loaders/GLTFLoader.js'),
          import('three/examples/jsm/controls/OrbitControls.js')
        ]);

        if (!canvasRef.current) return;

        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f9fa);

        // Camera setup
        camera = new THREE.PerspectiveCamera(
          50,
          canvasRef.current.clientWidth / canvasRef.current.clientHeight,
          0.1,
          1000
        );
        camera.position.set(4, 3, 4);

        // Renderer setup
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: true
        });

        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Handle different Three.js versions
        if (renderer.outputColorSpace !== undefined) {
          renderer.outputColorSpace = THREE.SRGBColorSpace;
        }

        // Controls setup
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 2;
        controls.maxDistance = 15;
        controls.maxPolarAngle = Math.PI / 2.2;
        controls.enablePan = true;

        setLoadingProgress(10);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 3);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-3, 2, -3);
        scene.add(fillLight);

        setLoadingProgress(20);

        // Load granite texture with better error handling
        const textureLoader = new THREE.TextureLoader();
        const graniteImageUrl = getGraniteImageUrl();

        console.log('Loading granite texture from:', graniteImageUrl);

        // Enable CORS for cross-origin images
        textureLoader.setCrossOrigin('anonymous');

        const graniteTexture = await new Promise<THREE.Texture>((resolve) => {
          textureLoader.load(
            graniteImageUrl,
            (texture) => {
              console.log('✅ Granite texture loaded successfully:', texture);

              // Configure texture immediately after loading
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.repeat.set(2, 2); // Increased repeat for better visibility
              texture.flipY = false;
              texture.needsUpdate = true;

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
              console.log('🔄 Creating fallback texture with granite pattern');

              // Create a more realistic granite fallback texture
              const canvas = document.createElement('canvas');
              canvas.width = 1024;
              canvas.height = 1024;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Create granite-like base
                const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
                gradient.addColorStop(0, '#f5f5f5');
                gradient.addColorStop(0.5, '#e8e8e8');
                gradient.addColorStop(1, '#d0d0d0');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1024, 1024);

                // Add granite speckles
                for (let i = 0; i < 2000; i++) {
                  const x = Math.random() * 1024;
                  const y = Math.random() * 1024;
                  const size = Math.random() * 3 + 1;
                  const opacity = Math.random() * 0.8 + 0.2;

                  ctx.globalAlpha = opacity;
                  ctx.fillStyle = Math.random() > 0.5 ? '#333' : '#666';
                  ctx.fillRect(x, y, size, size);
                }
                ctx.globalAlpha = 1;

                // Add veining
                ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
                ctx.lineWidth = 2;
                for (let i = 0; i < 10; i++) {
                  ctx.beginPath();
                  ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
                  ctx.quadraticCurveTo(
                    Math.random() * 1024, Math.random() * 1024,
                    Math.random() * 1024, Math.random() * 1024
                  );
                  ctx.stroke();
                }
              }

              const fallbackTexture = new THREE.CanvasTexture(canvas);
              fallbackTexture.wrapS = THREE.RepeatWrapping;
              fallbackTexture.wrapT = THREE.RepeatWrapping;
              fallbackTexture.repeat.set(2, 2);
              fallbackTexture.needsUpdate = true;

              console.log('✅ Fallback texture created');
              resolve(fallbackTexture);
            }
          );
        });

        setLoadingProgress(50);

        // Try to load 3D model, fallback to basic geometry
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
          console.log('Model file not found, creating basic slab geometry', modelError);
        }

        setLoadingProgress(90);

        // Create or use model
        if (gltf && gltf.scene) {
          // Use loaded model
          model = gltf.scene;
          scene.add(model);

          console.log('📦 Model loaded, applying granite texture to meshes...');
          let meshCount = 0;

          // Apply granite texture to all meshes
          model.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
              meshCount++;
              console.log(`🎨 Applying texture to mesh ${meshCount}:`, child.name || 'unnamed');

              // Create new material with granite texture
              const material = new THREE.MeshStandardMaterial({
                map: graniteTexture,
                roughness: 0.3,
                metalness: 0.1,
                normalScale: new THREE.Vector2(0.5, 0.5)
              });

              // Ensure the material uses the texture
              material.needsUpdate = true;
              child.material = material;
              child.castShadow = true;
              child.receiveShadow = true;

              console.log('✅ Texture applied to mesh:', child.name || 'unnamed');
            }
          });

          console.log(`📊 Total meshes found and textured: ${meshCount}`);

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
          // Create basic slab geometry
          console.log('🔧 Creating basic granite slab geometry...');

          const slabGeometry = new THREE.BoxGeometry(4, 0.2, 2.5);

          // Create material with granite texture
          const slabMaterial = new THREE.MeshStandardMaterial({
            map: graniteTexture,
            roughness: 0.3,
            metalness: 0.1,
            side: THREE.DoubleSide // Ensure texture is visible from all angles
          });

          slabMaterial.needsUpdate = true;

          model = new THREE.Mesh(slabGeometry, slabMaterial);
          model.castShadow = true;
          model.receiveShadow = true;
          scene.add(model);

          console.log('✅ Basic granite slab created with texture');
        }

        // Add ground plane for shadows
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.ShadowMaterial({
          transparent: true,
          opacity: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
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

        // Cleanup function
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
      link.href = canvasRef.current.toDataURL();
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
            <p className="text-gray-700 mb-3 font-medium">Loading 3D View...</p>
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
            title="Download Screenshot"
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
            <span>🎨</span>
            <span>Your granite texture applied</span>
          </div>
        </div>
      </div>

      {/* Debug Info Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-20 left-4 bg-black/90 text-white text-xs p-4 rounded-lg backdrop-blur-sm max-w-sm">
          <div className="space-y-2">
            <div className="text-yellow-300 font-bold">🐛 Debug Info:</div>
            <div>🏷️ Granite: <span className="text-green-300">{granite.name}</span></div>
            <div>🆔 ID: <span className="text-blue-300">{granite.id}</span></div>
            <div>🖼️ Image: <span className="text-orange-300">{getGraniteImageUrl().split('/').pop()}</span></div>
            <div>📦 Model: <span className="text-purple-300">{modelType}</span></div>
            <div>⚡ Status: <span className={isLoading ? 'text-yellow-300' : 'text-green-300'}>{isLoading ? 'Loading...' : 'Ready'}</span></div>
            <div>📊 Progress: <span className="text-cyan-300">{loadingProgress}%</span></div>
            <div>📸 Images count: <span className="text-pink-300">{granite.images?.length || 0}</span></div>
            {granite.images && granite.images.length > 0 && (
              <div className="text-xs mt-2 border-t border-gray-600 pt-2">
                <div className="text-gray-300">Available images:</div>
                {granite.images.map((img, idx) => (
                  <div key={idx} className="text-gray-400 truncate">
                    {idx + 1}. {img.url?.split('/').pop()} ({img.type})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quality Badge */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          ✨ Live 3D Preview
        </div>
      </div>
    </div>
  );
}