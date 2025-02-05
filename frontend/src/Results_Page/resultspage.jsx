import React from 'react';
import styles from "./resultspage.module.css";
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png";
import Back from "../assets/Back.png";

const ResultsPage = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/');
    }

    return (
        <div className={styles.resultsPage}>
          <header className={styles.header}>
            <img src={Logo} alt="Logo" className={styles.logo} />
            <h1 className={styles.title}>Results Page</h1>
            <button className={styles.goBackButton} onClick={handleGoBack}>
              <img src={Back} alt="Back" className={styles.backicon}/>
              Go Back
            </button>
          </header>
          <p>This is the results page.</p>
        </div>
      );
    };

export default ResultsPage;