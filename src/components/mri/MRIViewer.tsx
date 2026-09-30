import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { HeartModel } from '../../HeartModel';

type ViewMode = '3d' | 'mri';

export const MRIViewer: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('mri');
  const [slice, setSlice] = useState<number>(5);
  const [frame, setFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const totalSlices = 10;
  const totalFrames = 30;
  const sliceSpacing = 10;

  const paddedSlice = String(slice).padStart(2, '0');
  const paddedFrame = String(frame).padStart(2, '0');
  const activeImagePath = `/mri_cine/slice_${paddedSlice}_frame_${paddedFrame}.png`;

  // Memory Preloading Engine
  // Keeps Image objects alive in memory across renders so the browser doesn't refetch or flash white
  const preloadedCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    // Preload all 30 frames for the current slice as soon as the slice changes
    for (let f = 0; f < totalFrames; f++) {
      const frameStr = String(f).padStart(2, '0');
      const src = `/mri_cine/slice_${paddedSlice}_frame_${frameStr}.png`;

      if (!preloadedCache.current.has(src)) {
        const img = new Image();
        img.src = src;
        preloadedCache.current.set(src, img);
      }
    }
  }, [slice, totalFrames, paddedSlice]);

  // Synchronized Cardiac Playback Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, totalFrames]);

  // Synchronized clipping plane for 3D View: cuts along Z at the current slice position
  const clipPlane = useMemo(() => {
    return new THREE.Plane(new THREE.Vector3(0, 0, -1), slice * sliceSpacing);
  }, [slice, sliceSpacing]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0a0a0c', overflow: 'hidden' }}>
      {/* 3D Viewport (Synchronized with frame & slice) */}
      {mode === '3d' && (
        <Canvas
          camera={{ position: [0, -300, 150], up: [0, 0, 1], fov: 45 }}
          gl={{ localClippingEnabled: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[100, 100, 200]} intensity={1.5} />
          
          {/* Frame prop allows your HeartModel to select or interpolate deformation state */}
          <HeartModel clippingPlanes={[clipPlane]} frame={frame} />
          
          <OrbitControls enableDamping dampingFactor={0.05} />
        </Canvas>
      )}

      {/* Locked 2D Cine MRI Player (Zero 3D pan/zoom/orbit) */}
      {mode === 'mri' && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          touchAction: 'none'
        }}>
          <div style={{
            position: 'relative',
            width: 'min(65vh, 480px)',
            height: 'min(65vh, 480px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            background: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
          }}>
            <img
              src={activeImagePath}
              alt={`Cine MRI Slice ${slice + 1} Frame ${frame + 1}`}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none'
              }}
            />
            {/* Standard Radiological Orientation Labels */}
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 700 }}>R</span>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 700 }}>L</span>
          </div>
        </div>
      )}

      {/* Bottom Shared Playback & Slice Controls */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        background: 'rgba(20, 20, 25, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '14px 24px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: 'min(90vw, 520px)'
      }}>
        {/* Slice Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: 'white', fontSize: 13, minWidth: '90px' }}>
            Slice: {slice + 1} / {totalSlices}
          </span>
          <input
            type="range"
            min={0}
            max={totalSlices - 1}
            value={slice}
            onChange={(e) => setSlice(Number(e.target.value))}
            style={{ flex: 1, cursor: 'pointer' }}
          />
        </div>

        {/* Temporal Frame & Play/Pause Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: 'none',
              background: isPlaying ? '#e11d48' : '#16a34a',
              color: 'white',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: '65px'
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, minWidth: '85px' }}>
            Frame: {frame + 1} / {totalFrames}
          </span>

          <input
            type="range"
            min={0}
            max={totalFrames - 1}
            value={frame}
            onChange={(e) => {
              setIsPlaying(false);
              setFrame(Number(e.target.value));
            }}
            style={{ flex: 1, cursor: 'pointer' }}
          />
        </div>
      </div>

    </div>
  );
};

export default MRIViewer;