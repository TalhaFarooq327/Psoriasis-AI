/**
 * ImageCropper.jsx
 *
 * A modal-based interactive image cropper using react-easy-crop.
 * Allows the user to pan, zoom, and select a 1:1 square region
 * of their skin image before sending it for AI prediction.
 */
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImage from '../utils/cropImage';

const ImageCropper = ({ imageSrc, onCropDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const onCropComplete = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setIsApplying(true);
    try {
      const croppedFile = await getCroppedImage(imageSrc, croppedAreaPixels);
      onCropDone(croppedFile);
    } catch (err) {
      console.error('Cropping failed:', err);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="sa-cropper-overlay" onClick={onCancel}>
      <div className="sa-cropper-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sa-cropper-header">
          <div className="sa-cropper-header-left">
            <div className="sa-cropper-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6.13 1L6 16a2 2 0 002 2h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 6.13L16 6a2 2 0 012 2v15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="sa-cropper-title">Crop Your Image</h3>
              <p className="sa-cropper-subtitle">Select the affected skin area</p>
            </div>
          </div>
          <button className="sa-cropper-close-btn" onClick={onCancel} aria-label="Close cropper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Tip Banner */}
        <div className="sa-cropper-tip">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Tip: Select only the affected skin area. Avoid including healthy skin, clothing, or background.</span>
        </div>

        {/* Cropper Canvas */}
        <div className="sa-cropper-canvas">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: {
                borderRadius: '12px',
              },
            }}
          />
        </div>

        {/* Zoom Control */}
        <div className="sa-cropper-zoom">
          <div className="sa-cropper-zoom-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Zoom</span>
          </div>
          <input
            type="range"
            className="sa-cropper-slider"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom level"
          />
          <span className="sa-cropper-zoom-value">{zoom.toFixed(1)}×</span>
        </div>

        {/* Action Buttons */}
        <div className="sa-cropper-actions">
          <button className="sa-cropper-btn-cancel" onClick={onCancel} disabled={isApplying}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Cancel
          </button>
          <button className="sa-cropper-btn-apply" onClick={handleApply} disabled={isApplying}>
            {isApplying ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ animation: 'saSpin 1s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Applying...
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Apply Crop
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
