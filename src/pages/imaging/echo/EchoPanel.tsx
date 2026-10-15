import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import HeartViewer from '../../../components/hearts/HeartViewer';
import EchoViewer, { type EchoView } from './EchoViewer';
import './EchoPanel.css';
import { HEART_FRAME_COUNT } from '../../../components/hearts/heartRendering';

const totalFrames = 30;
const modelFrameOffsets: Record<EchoView, number> = {
  '4CH': 28, // Adjust this number for 4CH
  '2CH': 29, // Adjust this number for 2CH
};

export default function EchoPanel() {
  const [activeView, setActiveView] = useState<EchoView>('4CH');
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const currentOffset = modelFrameOffsets[activeView];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrame(previous => (previous + 1) % totalFrames);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const externalClipPlane = useMemo(() => {
    const settings = activeView === '4CH'
        ? { pitch: 0, yaw: 40, depth: 0 }
        : { pitch: 0, yaw: 324, depth: 14 };

    const pitch = THREE.MathUtils.degToRad(settings.pitch);
    const yaw = THREE.MathUtils.degToRad(settings.yaw);

    const normal = new THREE.Vector3(
        Math.cos(pitch) * Math.sin(yaw),
        Math.sin(pitch),
        Math.cos(pitch) * Math.cos(yaw),
    ).normalize();

    return new THREE.Plane(normal, settings.depth);
  }, [activeView]);

  return (
    <section className="echo-panel">
      <h2 id="echo-panel-title">Echo</h2>
      <div className="echo-panel-viewers">
        <div className="echo-panel-viewer heart-viewer">
          <span>Heart Viewer</span>
          <HeartViewer
            showControls={false}
            cameraView={activeView === '4CH' ? 'fourCH' : 'twoCH'}
            externalClipPlane={externalClipPlane}
            animationPhase={(frame / totalFrames + currentOffset / HEART_FRAME_COUNT) % 1}
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
