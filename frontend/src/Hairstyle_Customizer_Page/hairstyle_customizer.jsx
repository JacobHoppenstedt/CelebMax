import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./hairstyle_customizer.module.css";

import Logo from "../assets/logo.png";
import Back from "../assets/Back.png";
import ArrowDown from "../assets/Arrow.png";
import TaylorSwift from "../assets/taylor_swift.png";

const HairstyleCustomizer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // If you need the user's file or its URL:
  const userFile = state?.userFile;
  const userImageUrl =
    state?.userImageUrl || (userFile ? URL.createObjectURL(userFile) : null);
  const matchData = state?.matchData;
  const currentPage = state?.currentPage;

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

  const dummyCelebs = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: "Taylor Swift",
    image: TaylorSwift,
  }));

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
          <div className={styles.transformationContainer}>
            
            {/* "Your Original Picture" section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Your Original Picture</h2>
              {userImageUrl && (
                <img
                  src={userImageUrl}
                  alt="Original"
                  className={styles.userPicture}
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
                  className={styles.userPicture}
                />
              )}
            </div>

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
            {dummyCelebs.map((celeb, index) => (
              <div
                key={celeb.id}
                className={styles.celebCard}
                onClick={() => {
                  // TODO: handle the "apply hairstyle" logic
                  console.log(`Clicked on celeb #${celeb.id}`);
                }}
              >
                <div className={styles.celebNumber}>{index + 1}</div>
                <img
                  src={celeb.image}
                  alt={celeb.name}
                  className={styles.celebImg}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HairstyleCustomizer;
