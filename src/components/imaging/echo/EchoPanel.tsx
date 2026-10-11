import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import HeartViewer from '../../hearts/HeartViewer';
import EchoViewer, { type EchoView } from './EchoViewer';
import './EchoPanel.css';

const totalFrames = 30;

export default function EchoPanel() {
  const [activeView, setActiveView] = useState<EchoView>('4CH');
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrame(previous => (previous + 1) % totalFrames);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const externalClipPlane = useMemo(() => new THREE.Plane(
    activeView === '4CH'
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(1, 0, 0),
    0,
  ), [activeView]);

  return (
    <section className="echo-panel">
      <h2 id="echo-panel-title">Echo</h2>
      <div className="echo-panel-viewers">
        <div className="echo-panel-viewer heart-viewer">
          <span>Heart Viewer</span>
          <HeartViewer
            showControls={false}
            cameraView="frontal"
            externalClipPlane={externalClipPlane}
            animationPhase={frame / totalFrames}
          />
        </div>
        <div className="echo-panel-viewer echo-viewer">
          <span className="echo-panel-header">
            <span>Echo Viewer</span>
            <span className="echo-mode-label">CAMUS B-MODE {activeView}</span>
          </span>
          <EchoViewer activeView={activeView} frame={frame} totalFrames={totalFrames} />
        </div>
      </div>

      <div className="echo-panel-controls">
        <div className="controller-row">
          <span className="view-label">Acoustic View:</span>
          <div className="echo-view-buttons">
            <button
              type="button"
              aria-pressed={activeView === '4CH'}
              onClick={() => setActiveView('4CH')}
            >
              Apical 4-Chamber (4CH)
            </button>
            <button
              type="button"
              aria-pressed={activeView === '2CH'}
              onClick={() => setActiveView('2CH')}
            >
              Apical 2-Chamber (2CH)
            </button>
          </div>
        </div>
        <div className="controller-row">
          <span className="frame-label">
            Frame: {frame + 1} / {totalFrames}
          </span>
          <input
            type="range"
            aria-label="Echo frame"
            min={0}
            max={totalFrames - 1}
            value={frame}
            onChange={(e) => {
              setIsPlaying(false);
              setFrame(Number(e.target.value));
            }}
            className="frame-slider"
          />
          <button
            type="button"
            aria-pressed={isPlaying}
            onClick={() => setIsPlaying(previous => !previous)}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </section>
  );
}
