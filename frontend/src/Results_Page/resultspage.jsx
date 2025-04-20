import React, {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./resultspage.module.css";

import Logo from "../assets/logo.png";
import Back from "../assets/Back.png";
import HairCut from "../assets/Barbershop.png"
import TimotheeChalamet from "../assets/timothee_chalamet.png";
import { motion, AnimatePresence } from "framer-motion";

import LeftArrow from "../assets/left_arrow.png";
import RightArrow from "../assets/right_arrow.png";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const userFile = state?.userFile;
  const s3UserImageUrl = state?.matchData?.user_image_url;
  
  // Prefer the public S3 URL if present, otherwise fall back to the local blob
  const userImageUrl = s3UserImageUrl || (userFile ? URL.createObjectURL(userFile) : null);

  // The AI response from backend
  const matchData = state?.matchData;
  const topMatches = matchData?.top_matches || [];

  // Track direction for the slide animation
  const [direction, setDirection] = useState("next");

  // 1) Read currentPage from location.state -- fallback to 0 if not provided
  const initialPage = state?.currentPage ?? 0;

  // 2) Use that to initialize the React state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pageSize = 5;

  // The portion of `topMatches` we want to render based on the page
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedMatches = topMatches.slice(startIndex, endIndex);

  function handleGoBack() {
    navigate("/");
  }

  function handleNameClick(celebName) {
    // Navigate to /celeb-search route, passing the celebName
    /*navigate("/celeb-search", {
      state: {
        celebName,
        matchData,
        topMatches,
        userFile,
      },
    });*/

    //takes out the need for the celeb search page
    const query = encodeURIComponent(celebName);
    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank');
  }

  function handleGoToHairstyles() {
    navigate("/hairstyle_customizer", {
      state: {
        userFile,
        userImageUrl,
        matchData,
        currentPage,
      },
    });
  }

  // Go to next "page" of results
  function handleNext() {
    setDirection("next");
    setCurrentPage((prevPage) => prevPage + 1);
  }

  // Go to previous "page" of results
  function handlePrev() {
    setDirection("prev");
    setCurrentPage((prevPage) => prevPage - 1);
  }

  // Framer Motion variants to slide the entire card group
  const slideVariants = {
    enter: (direction) => {
      return {
        x: direction === "next" ? 300 : -300, // Start off-screen
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        x: direction === "next" ? -300 : 300, // Slide out opposite side
        opacity: 0
      };
    }
  };

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
          <motion.img
            src={userImageUrl || TimotheeChalamet}
            alt="Your Picture"
            className={styles.yourPicture}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />
        </div>

        {/* "Matched Celebrities" */}
        <div className={styles.matchedCelebsSection}>
          <h2>Matched Celebrities</h2>

          {/* Carousel wrapper containing left arrow, celebList, and right arrow */}
          <div className={styles.carouselWrapper}>
            {/* Left Arrow Button */}
            <button
              onClick={handlePrev}
              className={`${styles.arrowButton} ${
                currentPage === 0 ? styles.disabledArrow : ""
              } ${styles.arrowButtonLeft}`}
              disabled={currentPage === 0}
            >
              <img src={LeftArrow} alt="Left arrow" />
            </button>

            {/* AnimatePresence is used to animate out the old page & in the new page */}
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentPage}
                className={styles.celebList}
                variants={slideVariants}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                {displayedMatches.map((match, index) => {
                  const fullImageUrl = `http://localhost:5001${match.image_url}`;

                  // Convert distance to "match%"
                  const matchPercent = ((1 - match.distance) * 100).toFixed(2);

                  // Derive display name from filename
                  const rawName = match.image_url
                    .split("/")
                    .pop()
                    .replace(/\.[^/.]+$/, "")
                    .replace(/_/g, " ");
                  const displayName = rawName.replace(/\b\w/g, (c) =>
                    c.toUpperCase()
                  );

                  return (
                    <div className={styles.celebCard} key={index}>
                      <div className={styles.celebNumber}>
                        {startIndex + index + 1}
                      </div>
                      <img
                        src={fullImageUrl}
                        alt={`Celebrity ${startIndex + index}`}
                        className={styles.celebImg}
                      />
                      {/* Name as clickable text */}
                      <a
                        href="#"
                        className={styles.celebNameLink}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNameClick(displayName);
                        }}
                      >
                        {displayName}
                      </a>
                      <p className={styles.celebMatch}>{matchPercent}% match</p>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Right Arrow Button */}
            <button
              onClick={handleNext}
              className={`${styles.arrowButton} ${
                endIndex >= topMatches.length ? styles.disabledArrow : ""
              } ${styles.arrowButtonRight}`}
              disabled={endIndex >= topMatches.length}
            >
              <img src={RightArrow} alt="Right arrow" />
            </button>
          </div>

          {/* “Try A Celebrity's Hairstyle” Button */}
          <button
            className={styles.hairstylesButton}
            onClick={handleGoToHairstyles}
          >
            <img src={HairCut} alt="" className={styles.hairicon} />
            Try A Celebrity's Hairstyle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;