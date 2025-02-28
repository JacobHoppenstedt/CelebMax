import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import styles from "./cropmodal.module.css";

import SaveIcon from "../assets/save.png";
import CloseIcon from "../assets/Close.png";

const CropModal = ({ file, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const imageURL = useMemo(() => file ? URL.createObjectURL(file) : null, [file]);

  const createCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels || !imageURL) return null;
  
    const image = await createImage(imageURL);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    // Set max width/height for downscaling
    const MAX_WIDTH = 1080;
    const MAX_HEIGHT = 1080;
  
    let { width, height } = croppedAreaPixels;
  
    // Scale down if larger than max dimensions
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
      const scaleFactor = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
      width = Math.round(width * scaleFactor);
      height = Math.round(height * scaleFactor);
    }
  
    canvas.width = width;
    canvas.height = height;
  
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      width,
      height
    );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const fileExt = file.name.split(".").pop();
        const croppedFile = new File([blob], `cropped.${fileExt}`, { type: blob.type });
        resolve(croppedFile);
      }, "image/jpeg", 0.85);
    });
  }, [croppedAreaPixels, imageURL, file]);

  const handleSave = async () => {
    const croppedFile = await createCroppedImage();
    onSave(croppedFile);
  };

  // If no file, we don't show anything
  if (!file) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* X button in top-right corner */}
        <button className={styles.closeButton} onClick={onCancel}>
          <img className={styles.closeIcon} src={CloseIcon} alt="Close Icon" />
        </button>

        <h2 className={styles.title}>Crop Your Image</h2>
        <p className={styles.subtitle}>
          Cropping your image around your head will produce the best results!
        </p>
        
        <div className={styles.cropContainer}>
          <Cropper
            image={imageURL}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className={styles.controls}>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        {/* Save Button */}
        <button className={styles.saveButton} onClick={handleSave}>
          <img className={styles.saveIcon} src={SaveIcon} alt="Save Icon" />
          Save
        </button>
      </div>
    </div>
  );
};

async function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    image.src = url;
  });
}

export default CropModal;
