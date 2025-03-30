import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./resultspage.module.css";

import Logo from "../assets/logo.png";
import Back from "../assets/Back.png";
import HairCut from "../assets/Barbershop.png"
import TimotheeChalamet from "../assets/timothee_chalamet.png";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // The user's original file
  const userFile = state?.userFile;
  const userImageUrl = userFile ? URL.createObjectURL(userFile) : null;

  // The AI response from backend
  const matchData = state?.matchData;
  const topMatches = matchData?.top_matches || [];

  function handleGoBack() {
    navigate("/");
  }
  function handleNameClick(celebName) {
    // Navigate to /celeb-search route, passing the celebName
    navigate("/celeb-search", { state: { celebName } });
  }
  function handleGoToHairstyles() {
    navigate("/hairstyle_customizer", {
      state: { 
        userFile,
        userImageUrl,
        matchData
      },
    });
  }

  return (
    <div className={styles.resultsPage}>
      {/* Header */}
      <header className={styles.header}>
        <img src={Logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Your Results</h1>
        <button className={styles.goBackButton} onClick={handleGoBack}>
          <img src={Back} alt="Back" className={styles.backicon} />
          Go Back
        </button>
      </header>

      {/* Main content container */}
      <div className={styles.content}>
        {/* "Your Picture" */}
        <div className={styles.yourPictureSection}>
          <h2>Your Picture</h2>
          <img
            src={userImageUrl || TimotheeChalamet}
            alt="Your Picture"
            className={styles.yourPicture}
          />
        </div>

        {/* "Matched Celebrities" */}
        <div className={styles.matchedCelebsSection}>
          <h2>Matched Celebrities</h2>
          <div className={styles.celebList}>
            {topMatches.slice(0, 5).map((match, index) => {
              const fullImageUrl = `http://localhost:5001${match.image_url}`;
              // Convert distance to "match%" (distance is from 0 to 1, so 1 - distance = similarity)
              const matchPercent = ((1 - match.distance) * 100).toFixed(2);

              // Derive display name from filename
              const rawName = match.image_url
                .split('/')
                .pop()
                .replace(/\.[^/.]+$/, '')   // Remove file extension
                .replace(/_/g, ' ');       // Replace underscores
              const displayName = rawName.replace(/\b\w/g, c => c.toUpperCase());

              return (
                <div className={styles.celebCard} key={index}>
                  <div className={styles.celebNumber}>{index + 1}</div>
                  <img
                    src={fullImageUrl}
                    alt={`Celebrity ${index}`}
                    className={styles.celebImg}
                  />
                  {/* Name as clickable text */}
                  <button
                    className={styles.celebNameButton}
                    onClick={() => handleNameClick(displayName)}
                  >
                    {displayName}
                  </button>
                  <p className={styles.celebMatch}>{matchPercent}% match</p>
                </div>
              );
            })}
          </div>

          <button className={styles.hairstylesButton} onClick={handleGoToHairstyles}>
            <img src={HairCut} alt="" className={styles.hairicon} />
            Try A Celebrity's Hairstyle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
