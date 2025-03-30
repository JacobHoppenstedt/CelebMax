import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./celebsearchpage.module.css";

import Logo from "../assets/logo.png";
import Back from "../assets/Back.png";

const CelebSearchPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const celebName = state?.celebName || "Unknown Celebrity";

  const searchQuery = celebName.replace(/\s+/g, "+") + "+photos";
  const googleUrl = `https://www.google.com/search?q=${searchQuery}&tbm=isch`;

  // Handler to open Google Images in a new tab
  const handleOpenGoogleSearch = () => {
    window.open(googleUrl, "_blank");
  };

  return (
    <div className={styles.searchPage}>
      {/* Header */}
      <header className={styles.header}>
        <img src={Logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Celebrity Search</h1>
        <button className={styles.goBackButton} onClick={() => navigate(-1)}>
          <img src={Back} alt="Back" className={styles.backicon} />
          Go Back
        </button>
      </header>

      {/* Main content */}
      <div className={styles.searchContainer}>
        <h2 className={styles.searchHeading}>
          Searching for: {celebName}
        </h2>

        {/* Button that opens Google Images in a new tab */}
        <button className={styles.openGoogleButton} onClick={handleOpenGoogleSearch}>
          Open Google Images
        </button>
      </div>
    </div>
  );
};

export default CelebSearchPage;
