// Three.js type declarations for better TypeScript support

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  export class GLTFLoader {
    constructor();
    load(
      url: string,
      onLoad: (gltf: any) => void,
      onProgress?: (progress: ProgressEvent) => void,
      onError?: (error: any) => void
    ): void;
  }
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  export class OrbitControls {
    constructor(camera: any, domElement: HTMLElement);
    enableDamping: boolean;
    dampingFactor: number;
    minDistance: number;
    maxDistance: number;
    maxPolarAngle: number;
    enablePan: boolean;
    update(): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/loaders/RGBELoader.js' {
  export class RGBELoader {
    constructor();
    load(
      url: string,
      onLoad: (texture: any) => void,
      onProgress?: (progress: ProgressEvent) => void,
      onError?: (error: any) => void
    ): void;
  }
}

// Extend the global Three namespace if needed
declare global {
  namespace THREE {
    // Add any specific THREE types that might be missing
  }
}