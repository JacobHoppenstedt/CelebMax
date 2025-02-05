import React from 'react';
import styles from "./resultspage.module.css";
import { useNavigate } from 'react-router-dom';

// Image Imports
import Logo from "../assets/logo.png";
import Back from "../assets/Back.png";
import TaylorSwift from "../assets/taylor_swift.png";
import TimotheeChalamet from "../assets/timothee_chalamet.png";


const ResultsPage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
      navigate('/');
  };

  return (
      <div className={styles.resultsPage}>
        {/* Header */}
        <header className={styles.header}>
          <img src={Logo} alt="Logo" className={styles.logo} />
          <h1 className={styles.title}>Your Results</h1>
          <button className={styles.goBackButton} onClick={handleGoBack}>
            <img src={Back} alt="Back" className={styles.backicon}/>
            Go Back
          </button>
        </header>

        {/* Main content container */}
        <div className={styles.content}>
          {/* "Your Picture" Section */}
          <div className={styles.yourPictureSection}>
            <h2>Your Picture</h2>
            <img 
              src={TimotheeChalamet} 
              alt="Your Picture"
              className={styles.yourPicture}
            />
          </div>

          {/* "Matched Celebrities" Section */}
          <div className={styles.matchedCelebsSection}>
            <h2>Matched Celebrities</h2>
            <div className={styles.celebList}>
              {/* Example celeb card #1 */}
              <div className={styles.celebCard}>
                <img 
                  src={TaylorSwift} 
                  alt="Celebrity 1" 
                  className={styles.celebImg} 
                />
                <p className={styles.celebName}>Taylor Swift</p>
                <p className={styles.celebMatch}>84% match</p>
              </div>

              {/* Example celeb card #2 */}
              <div className={styles.celebCard}>
                <img 
                  src={TaylorSwift} 
                  alt="Celebrity 2" 
                  className={styles.celebImg} 
                />
                <p className={styles.celebName}>Taylor Swift</p>
                <p className={styles.celebMatch}>84% match</p>
              </div>

              <div className={styles.celebCard}>
                <img 
                  src={TaylorSwift} 
                  alt="Celebrity 3" 
                  className={styles.celebImg} 
                />
                <p className={styles.celebName}>Taylor Swift</p>
                <p className={styles.celebMatch}>84% match</p>
              </div>

              <div className={styles.celebCard}>
                <img 
                  src={TaylorSwift} 
                  alt="Celebrity 4" 
                  className={styles.celebImg} 
                />
                <p className={styles.celebName}>Taylor Swift</p>
                <p className={styles.celebMatch}>84% match</p>
              </div>

              <div className={styles.celebCard}>
                <img 
                  src={TaylorSwift} 
                  alt="Celebrity 5" 
                  className={styles.celebImg} 
                />
                <p className={styles.celebName}>Taylor Swift</p>
                <p className={styles.celebMatch}>84% match</p>
              </div>

            </div>
          </div>
        </div>
      </div>
  );
};

export default ResultsPage;