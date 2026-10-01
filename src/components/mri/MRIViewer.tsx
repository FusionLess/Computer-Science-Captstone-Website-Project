import { useEffect, useRef } from 'react';
import "./MRIViewer.css"

type MRIViewerProps = {
  slice: number
  frame: number
  totalFrames: number
}

export const MRIViewer = ({ slice, frame, totalFrames }: MRIViewerProps) => {

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


  return (
    <div className="mri-viewer">
      <div className="viewer-container">
          <img
              src={activeImagePath}
              alt={`Cine MRI Slice ${slice + 1} Frame ${frame + 1}`}
              draggable={false}
              className="mri-viewer-image"
          />
          {/* Standard Radiological Orientation Labels */}
          <span className="mri-viewer-label mri-right">R</span>
          <span className="mri-viewer-label mri-left">L</span>
      </div>

    </div>
  );
};

export default MRIViewer;
