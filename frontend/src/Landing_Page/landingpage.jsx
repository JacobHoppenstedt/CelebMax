import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Timothee from '../assets/timothee_chalamet.png';
import Brad from '../assets/brad_pit.png';
import Zendaya from '../assets/zendaya.png';
import Taylor from '../assets/taylor_swift.png';
import TheRock from '../assets/the_rock.png';
import RDJ from '../assets/robert_downey_jr.png';
import Logo from '../assets/logo.png';
import Star from '../assets/star.png';
import CropModal from '../Crop_Modal_Page/CropModal';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
// CSS
import styles from "./landingpage.module.css";

const LandingPage = () => {
  const [file, setFile] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // This is called when user clicks the "Upload Photo" button
  function openFileDialog() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Store the file, show crop modal
    setFile(selectedFile);
    setCropping(true);
  }

    // Called when user cancels the cropping
    function handleCropCancel() {
      setCropping(false);
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  
    async function handleCropSave(croppedFile) {
      setCropping(false);
    
      // Start a timer, but don’t immediately set isLoading
      let loadingTimer = null;
      loadingTimer = setTimeout(() => {
        setIsLoading(true);
      }, 100);
    
      const formData = new FormData();
      formData.append("image", croppedFile);
    
      try {
        const response = await fetch("http://localhost:8080/match", {
          method: "POST",
          body: formData
        });
    
        if (!response.ok) {
          const errorData = await response.json(); 
          const errMsg = errorData.error || "Server error";
          toast.error(errMsg);
          setFile(null);
          return;
        }
    
        const data = await response.json();
        console.log("AI Response =>", data);
    
        if (data.error) {
          toast.error(data.error);
          setFile(null);
          return;
        }
    
        // success
        navigate("/results", { state: { userFile: croppedFile, matchData: data } });
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to process image. Please try again.");
        setFile(null);
      } finally {
        if (loadingTimer) {
          clearTimeout(loadingTimer);
        }
        setIsLoading(false);
      }
    }
    
    
  return (
    <div>
    <header className = {styles.header}>
      {/* Website Logo and Header */}

      <h1 className = {styles.title}> CelebMax</h1>
      <img
          style={{width: "115px", height: "100px", marginTop: "-60px", marginRight: "300px"}}
          src={Logo}
          alt="logo"
      />
      <img
          style={{width: "100px", height: "85px", float: "left", marginTop: "-50px"}}
          src={Star}
          alt="star"
      />
      <img
          style={{width: "100px", height: "85px", float: "right", marginTop: "-50px"}}
          src={Star}
          alt="star"
      />
      
    </header>

    <header2 className = {styles.header2}> 
      <br/>
      <h2 className={styles.title2}>Find Your Look, Inspired By Stars.</h2>
    </header2>

    <ruleSection1 className = {styles.ruleSection1}>
      <br/>
      {/* First rule and first two images */}
      <motion.img style={{ width: "110px", height: "130px", float: "left", marginLeft: "40px" }} src={Timothee} alt="Celeb1" initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ delay: .5, duration: 2 }}/>
      <motion.img style={{ width: "110px", height: "130px", float: "right", marginRight: "40px" }} src={Brad} alt="Celeb2" initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ delay: 1, duration: 2 }}/>
      <br/><br />
      <motion.p className={styles.ruleSection}
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ duration: 2 }}
      >

        1. Upload a picture of yourself, and our AI will instantly find celebrities who resemble you.
      </motion.p>
      <br />

    </ruleSection1>

    <ruleSection2 className = {styles.ruleSection2}>
    {/* Second rule and second two images */}
      <motion.img style={{ width: "120px", height: "140px", float: "left", marginTop: "60px", marginLeft: "-60px" }} src={Zendaya} alt="Celeb3" initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ delay: 2, duration: 2 }}/>
      <motion.img style={{ width: "120px", height: "140px", float: "right", marginTop: "60px", marginRight: "-60px" }} src={Taylor} alt="Celeb4" initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ delay: 2.5, duration: 2 }}/>
      <br/><br />
      <motion.p className={styles.ruleSection}
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ delay: 1.5, duration: 2 }}>
        2. Browse through the results and choose a celebrity whose hairstyle you'd like to try.
      </motion.p>
      <br />

    </ruleSection2>

    {/* Third rule and last two images */}
      <motion.img style={{ width: "110px", height: "130px", float: "left", marginTop: "130px", marginLeft: "-40px"}} src={TheRock} alt="Celeb5" initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ delay: 3.5, duration: 2 }}/>
      <motion.img style={{ width: "110px", height: "130px", float: "right", marginTop: "130px", marginRight: "-40px" }} src={RDJ} alt="Celeb6" initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ delay: 4, duration: 2 }}/>
      <br/><br />
      <motion.p className={styles.ruleSection}
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ delay: 3, duration: 2 }}>
        3. Use our AI-powered tool to replace your hairstyle with your selected celebrity’s look and see the transformation!
      </motion.p>
      <br /><br /><br /><br />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        data-testid="file-input"  // Make sure this matches the query in your test
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Single button that opens file explorer */}
      <button style={{ backgroundColor: '#347C9B'}} onClick={openFileDialog}>
        Upload Photo
      </button>

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <h2>Processing your image, please wait...</h2>
        </div>
      )}

      {/* Show CropModal if user is cropping */}
      {cropping && file && (
        <CropModal
          file={file}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default LandingPage;
