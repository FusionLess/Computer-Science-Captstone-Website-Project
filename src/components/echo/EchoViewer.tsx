import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';
import { HeartModel as RawHeartModel } from '../hearts/HeartModel';
import { SliceCap } from '../hearts/SliceCap';

const HeartModel = RawHeartModel as React.FC<{
  bpm?: number;
  showEpi?: boolean;
  clipPlane?: THREE.Plane | null;
  isPaused?: boolean;
  animationPhase?: number;
  rotation?: [number, number, number];
  [key: string]: any;
}>;

type EchoView = '4CH' | '2CH';
type ViewMode = '3d' | 'echo';

export const EchoViewer: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('echo');
  const [activeView, setActiveView] = useState<EchoView>('4CH');
  const [frame, setFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const capStyleRef = useRef(null);

  const totalFrames = 30;

  const paddedFrame = String(frame).padStart(2, '0');
  const activeImagePath = `/echo/${activeView}/frame_${paddedFrame}.png`;

  // Preloading cache to prevent image flashing
  const preloadedCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    for (let f = 0; f < totalFrames; f++) {
      const frameStr = String(f).padStart(2, '0');
      const src = `/echo/${activeView}/frame_${frameStr}.png`;

      if (!preloadedCache.current.has(src)) {
        const img = new Image();
        img.src = src;
        preloadedCache.current.set(src, img);
      }
    }
  }, [activeView, totalFrames]);

  // Synchronized playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, totalFrames]);

  // Slicing plane matching the 4CH / 2CH anatomical cuts
  const clipPlane = useMemo(() => {
    if (activeView === '4CH') {
      return new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    } else {
      return new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    }
  }, [activeView]);

  return (
    <main style={{ width: '100%', flex: 1, minHeight: 620, position: 'relative', background: '#0a0a0c', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 20, display: 'flex', gap: 8 }}>
        <button type="button" aria-pressed={mode === 'echo'} onClick={() => setMode('echo')}>
          Ultrasound
        </button>
        <button type="button" aria-pressed={mode === '3d'} onClick={() => setMode('3d')}>
          3D heart
        </button>
      </div>

      {/* 3D Viewport */}
      {mode === '3d' && (
        <Canvas
          camera={{ position: [-225, -20, -200], fov: 45 }}
          gl={{
            localClippingEnabled: true,
            stencil: true,
          }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[300, 300, 350]} intensity={1.2} />
          <directionalLight position={[-250, -250, 200]} intensity={0.6} />

          <Suspense fallback={null}>
            <Center>
              <HeartModel
                clipPlane={clipPlane}
                animationPhase={frame / totalFrames}
                capStyleRef={capStyleRef}
                rotation={[-Math.PI / 12, -Math.PI / 3, 0]}
              />
            </Center>
            <SliceCap clipPlane={clipPlane} capStyleRef={capStyleRef} />
          </Suspense>

          <OrbitControls enableDamping dampingFactor={0.05} />
        </Canvas>
      )}

      {/* 2D Ultrasound Viewport */}
      {mode === 'echo' && (
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
            width: 'min(70vh, 520px)',
            height: 'min(70vh, 520px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            background: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)'
          }}>
            <img
              src={activeImagePath}
              alt={`Echocardiogram ${activeView} Frame ${frame + 1}`}
              draggable={false}
              onError={(e) => {
                // If PNG sequence has not been extracted yet, show a clean indicator rather than crashing
                (e.target as HTMLElement).style.display = 'none';
              }}
              onLoad={(e) => {
                (e.target as HTMLElement).style.display = 'block';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
                filter: 'contrast(1.1) brightness(1.05)'
              }}
            />

            {/* Clinical Ultrasound HUD Overlay */}
            <span style={{ position: 'absolute', top: 12, left: 16, color: '#38bdf8', fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
              CAMUS B-MODE {activeView}
            </span>
            <span style={{ position: 'absolute', top: 30, left: 16, color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace' }}>
              FPS: 20 | DEPTH: 16cm
            </span>

            {/* Depth Markers */}
            <div style={{ position: 'absolute', right: 8, top: '20%', bottom: '20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'rgba(255,255,255,0.35)', fontSize: 9, fontFamily: 'monospace' }}>
              <span>- 4cm</span>
              <span>- 8cm</span>
              <span>- 12cm</span>
              <span>- 16cm</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Playback & View Controls */}
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
        {/* Modality View Toggle (4-Chamber vs 2-Chamber) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: 'white', fontSize: 13, minWidth: '90px' }}>
            Acoustic View:
          </span>
          <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
            <button
              type="button"
              onClick={() => setActiveView('4CH')}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                background: activeView === '4CH' ? '#38bdf8' : '#2c2c30',
                color: 'white',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Apical 4-Chamber (4CH)
            </button>
            <button
              type="button"
              onClick={() => setActiveView('2CH')}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                background: activeView === '2CH' ? '#38bdf8' : '#2c2c30',
                color: 'white',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Apical 2-Chamber (2CH)
            </button>
          </div>
        </div>

        {/* Temporal Frame Slider & Play/Pause */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <button
            type="button"
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
            style={{ flex: 1, cursor: 'pointer', accentColor: '#38bdf8' }}
          />
        </div>
      </div>

    </main>
  );
};

export default EchoViewer;
