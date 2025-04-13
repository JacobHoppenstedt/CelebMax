import React, {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./hairstyle_customizer.module.css";

import Logo from "../assets/logo.png";
import Back from "../assets/Back.png";
import ArrowDown from "../assets/Arrow.png";

const HairstyleCustomizer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // If you need the user's file or its URL:
  const userFile = state?.userFile;
  const userImageUrl =
    state?.userImageUrl || (userFile ? URL.createObjectURL(userFile) : null);
  const matchData = state?.matchData;
  const currentPage = state?.currentPage;

  const topMatches = matchData?.top_matches || [];
  const topTenCelebs = topMatches.slice(0, 10);

  // Track which celeb is selected (store the index)
  const [selectedCelebIndex, setSelectedCelebIndex] = useState(null);

  // Go back to the Results page
  function handleGoBack() {
    navigate("/results", {
      state: {
        userFile,
        matchData,
        currentPage,
      }
    });
  }

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

      {/* Content with two large rounded divs */}
      <div className={styles.content}>
        <div className={styles.modifiedHairstyleDiv}>
          {/* "Your Original Picture" section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Original Picture</h2>
            {userImageUrl && (
              <img
                src={userImageUrl}
                alt="Original"
                className={styles.userOriginalPicture}
              />
            )}
          </div>

          <div className={styles.arrow}>
            <img src={ArrowDown} alt="Arrow" className={styles.arrowIcon} />
          </div>

          {/* "Modified Hairstyle" section (currently same image) */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Modified Hairstyle</h2>
            {userImageUrl && (
              <img
                src={userImageUrl}
                alt="Modified"
                className={styles.userModifiedPicture}
              />
            )}
          </div>
        </div>

        {/* ---------- Right Div: Choose Celebrity Div ---------- */}
        <div className={styles.chooseCelebrityDiv}>
          {/* Title and subtitle */}
          <h2 className={styles.chooseTitle}>Choose a Celebrity</h2>
          <p className={styles.chooseSubtitle}>
            Click on a celebrity’s image to switch your hairstyle
          </p>

          {/* Scrollable container of celebrity cards */}
          <div className={styles.celebScrollContainer}>
            {topTenCelebs.map((match, index) => {
              // Same logic you used in the results page to build the image URL
              const fullImageUrl = `http://localhost:5001${match.image_url}`;

              // Derive a display name from the filename
              const rawName = match.image_url
                .split("/")
                .pop()
                .replace(/\.[^/.]+$/, "")
                .replace(/_/g, " ");
              const displayName = rawName.replace(/\b\w/g, (c) => c.toUpperCase());

              // Determine if this card is selected
              const isSelected = selectedCelebIndex === index;

              return (
                <div
                  key={index}
                  className={`${styles.celebCard} ${
                    isSelected ? styles.selectedCelebCard : ""
                  }`}
                  onClick={() => {
                    setSelectedCelebIndex(index);
                    console.log(`Clicked on celeb #${index + 1}: ${displayName}`);
                  }}
                >
                  {/* The numbered circle */}
                  <div className={styles.celebNumber}>{index + 1}</div>

                  {/* The celeb image */}
                  <img
                    src={fullImageUrl}
                    alt={displayName}
                    className={styles.celebImg}
                  />

                  {/* A hidden tooltip that shows on hover */}
                  <div className={styles.celebTooltip}>
                    {displayName}
                  </div>
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
