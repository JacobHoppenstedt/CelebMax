import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./hairstyle_customizer.module.css";
import { motion } from 'framer-motion';

import Logo from "../assets/logo.png";
import Back from "../assets/Back.png";
import ArrowDown from "../assets/Arrow.png";

const HairstyleCustomizer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Grab user file / URL from router state
  const userFile = state?.userFile;
  const userImageUrl = state?.userImageUrl || null;

  const matchData = state?.matchData;
  const topMatches = matchData?.top_matches || [];
  const topTenCelebs = topMatches.slice(0, 10);

  // Which celeb the user clicked
  const [selectedCelebIndex, setSelectedCelebIndex] = useState(null);

  // Hairstyle generation state
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [error, setError] = useState(null);

  // Helper to convert File → base64 data URL
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Whenever selectedCelebIndex changes, kick off the model call
  
useEffect(() => {
  if (selectedCelebIndex === null) return;
  if (loading) return;

  (async () => {
    setLoading(true); setError(null); setGeneratedUrl(null);
    try {
      // Use the public S3 URL directly:
      const faceImagePayload = userImageUrl;

      // Build the celeb’s S3 URL as before...
      const celebMatch = topTenCelebs[selectedCelebIndex];
      const key = celebMatch.image_url.replace(/^\/celebrity_images\//, "");
      const celebImageUrl =
        `https://celebmax.s3.us-east-2.amazonaws.com/${key}`;

      // Call your hairstyle endpoint:
      const res = await fetch("http://localhost:5002/generate-hairstyle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceImageUrl: faceImagePayload, celebImageUrl })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setGeneratedUrl(
        data.hairstyleUrl
          ? data.hairstyleUrl
          : `data:image/png;base64,${data.hairstyleBase64}`
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  })();
}, [selectedCelebIndex]);

  const handleGoBack = () => {
    navigate("/results", { state: { userFile, matchData: matchData, currentPage: state?.currentPage } });
  };

  return (
    <div className={styles.hairstyleCustomizer}>
      {/* Header */}
      <header className={styles.header}>
        <img src={Logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Hairstyle Customizer</h1>
        <button className={styles.goBackButton} onClick={handleGoBack}>
          <img src={Back} alt="Back" className={styles.backicon} />
          Go Back
        </button>
      </header>

      {/* Main content */}
      <div className={styles.content}>
        <div className={styles.modifiedHairstyleDiv}>
          {/* Original */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Original Picture</h2>
            {userImageUrl && (
              <motion.img
                src={userImageUrl}
                alt="Original"
                className={styles.userOriginalPicture}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              />
            )}
          </div>

          <div className={styles.arrow}>
            <img src={ArrowDown} alt="Arrow" className={styles.arrowIcon} />
          </div>

          {/* Modified */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Modified Hairstyle</h2>

            {/* 1) Loading spinner */}
            {loading && (
              <div className={styles.spinnerContainer}>
                <div className={styles.spinner} />
                <p>Generating...</p>
              </div>
            )}

            {/* 2) Error only after a click */}
            {selectedCelebIndex !== null && error && (
              <p className={styles.error}>Error: {error}</p>
            )}

            {/* 3) Show the generated image if we have one */}
            {!loading && !error && generatedUrl && (
              <img
                src={generatedUrl}
                alt="Generated Hairstyle"
                className={styles.userModifiedPicture}
              />
            )}

            {/* 4) Placeholder before any click */}
            {selectedCelebIndex === null && !loading && !generatedUrl && (
              <p className={styles.placeholder}>
                Your result will show up here
              </p>
            )}

          </div>
        </div>

        {/* Celebrity picker */}
        <div className={styles.chooseCelebrityDiv}>
          <h2 className={styles.chooseTitle}>Choose a Celebrity</h2>
          <p className={styles.chooseSubtitle}>
            Click on a celebrity’s image to switch your hairstyle
          </p>

          <div className={styles.celebScrollContainer}>
            {topTenCelebs.map((match, index) => {
              const key = match.image_url.replace(/^\/celebrity_images\//, "");
              const fullImageUrl = `https://celebmax.s3.us-east-2.amazonaws.com/${key}`;
              const rawName = match.image_url
                .split("/")
                .pop()
                .replace(/\.[^/.]+$/, "")
                .replace(/_/g, " ");
              const displayName = rawName.replace(/\b\w/g, (c) =>
                c.toUpperCase()
              );
              const isSelected = selectedCelebIndex === index;

              return (
                <div
                  key={index}
                  className={`${styles.celebCard} ${
                    isSelected ? styles.selectedCelebCard : ""
                  }`}
                  onClick={() => {
                    setSelectedCelebIndex(index);
                  }}
                >
                  <div className={styles.celebNumber}>{index + 1}</div>
                  <motion.img
                    src={fullImageUrl}
                    alt={displayName}
                    className={styles.celebImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75, duration: 2 }}
                  />
                  <div className={styles.celebTooltip}>{displayName}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HairstyleCustomizer;
