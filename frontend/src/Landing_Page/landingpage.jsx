import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Timothee from '../assets/timothee_chalamet.png';
import Brad from '../assets/brad_pit.png';
import Zendaya from '../assets/zendaya.png';
import Taylor from '../assets/taylor_swift.png';
import TheRock from '../assets/the_rock.png';
import RDJ from '../assets/robert_downey_jr.png';
import Logo from '../assets/logo.png';
import styles from "./landingpage.module.css";

const LandingPage = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // This is called when user clicks the "Upload Photo" button
  function openFileDialog() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  // When the user picks a file
  async function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Build FormData to send to Go
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Send image to the Go backend (/match)
      const response = await fetch("http://localhost:8080/match", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      // AI response from Go (which calls Python)
      const data = await response.json();
      console.log("AI Response =>", data);

      // Navigate to /results, passing userFile & matchData
      navigate("/results", { state: { userFile: selectedFile, matchData: data } });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to process image. Please try again.");
    }
  }

  return (
    <div>
      {/* Website Logo and Header */}
      <img
        style={{ width: "125px", height: "110px", textAlign: "left" }}
        src={Logo}
        alt="logo"
      />
      <h1 className={styles.title}>CelebMax</h1>
      <br />
      <h2 className={styles.title2}>Find Your Look, Inspired By Stars.</h2>

      {/* First rule and first two images */}
      <img style={{ width: "110px", height: "130px", float: "left" }} src={Timothee} alt="Celeb1" />
      <img style={{ width: "110px", height: "130px", float: "right" }} src={Brad} alt="Celeb2" />
      <br/><br />
      <p className={styles.ruleSection}>
        1. Add a picture of yourself and let us find celebrities who look like you.
      </p>
      <br />

      {/* Second rule and second two images */}
      <img style={{ width: "120px", height: "140px", float: "left" }} src={Zendaya} alt="Celeb3" />
      <img style={{ width: "120px", height: "140px", float: "right" }} src={Taylor} alt="Celeb4" />
      <br/><br />
      <p className={styles.ruleSection}>
        2. Discover their iconic hairstyles and outfit inspirations tailored to your look.
      </p>
      <br />

      {/* Third rule and last two images */}
      <img style={{ width: "110px", height: "130px", float: "left" }} src={TheRock} alt="Celeb5" />
      <img style={{ width: "110px", height: "130px", float: "right" }} src={RDJ} alt="Celeb6" />
      <br/><br />
      <p className={styles.ruleSection}>
        3. Discover their iconic hairstyles and outfit inspirations tailored to your look!
      </p>
      <br /><br /><br />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Single button that opens file explorer */}
      <button
        style={{ backgroundColor: '#347C9B'}}
        onClick={openFileDialog}
      >
        Upload Photo
      </button>
    </div>
  );
};

export default LandingPage;
