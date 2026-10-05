import React, { useEffect, useRef } from 'react';
import './EchoViewer.css';

export type EchoView = '4CH' | '2CH';

type EchoViewerProps = {
  activeView: EchoView;
  frame: number;
  totalFrames: number;
};

export const EchoViewer: React.FC<EchoViewerProps> = ({ activeView, frame, totalFrames }) => {
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

  return (
    <div className="echo-viewer-container">
      <div className="echo-viewer-content">
        <div className="echo-viewer-frame">
          <img
            src={activeImagePath}
            alt={`Echocardiogram ${activeView} Frame ${frame + 1}`}
            draggable={false}
            onError={(e) => {
              // If PNG sequence has not been extracted yet, show a clean indicator rather than crashing
              e.currentTarget.classList.add('echo-viewer-image-hidden');
            }}
            onLoad={(e) => {
              e.currentTarget.classList.remove('echo-viewer-image-hidden');
            }}
            className="echo-viewer-image"
          />

          {/* Clinical Ultrasound HUD Overlay */}
          <span className="echo-viewer-title">
            CAMUS B-MODE {activeView}
          </span>
          <span className="echo-viewer-details">
            FPS: 20 | DEPTH: 16cm
          </span>

          {/* Depth Markers */}
          <div className="echo-viewer-depth-markers">
            <span>- 4cm</span>
            <span>- 8cm</span>
            <span>- 12cm</span>
            <span>- 16cm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EchoViewer;
