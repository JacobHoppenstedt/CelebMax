import React from 'react';
import Timothee from '../assets/timothee_chalamet.png'
import Brad from '../assets/brad_pit.png'
import Zendaya from '../assets/zendaya.png'
import Taylor from '../assets/taylor_swift.png'
import TheRock from '../assets/the_rock.png'
import RDJ from '../assets/robert_downey_jr.png'
import Logo from '../assets/logo.png'
import Camera from '../assets/camera.png'
import styles from "./landingpage.module.css"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [ file, setFile ] = useState(null);

    const navigate = useNavigate();

    function handleUpload() {
        if (!file) {
            console.log("No file selected");
            return;
        }

        const fd = new FormData();
        fd.append('file', file);

    }

    function handleClick() {
        navigate('/results');
    }

    

    return (
        <div>
            <img style={{ width: "125px", height: "110px", textAlign: "left" }} src={Logo} alt='logo'/>
            <h1 className={styles.title}>CelebMax</h1>
            <br />

            <h2 className={styles.title2}>Find Your Look, Inspired By Stars.</h2>

            <img style={{ width: "110px", height: "130px", float: "left" }} src={Timothee} alt='Celeb1'/>
            <img style={{ width: "110px", height: "130px", float: "right" }} src={Brad} alt='Celeb2'/>
            <br />
            <br />
            {/*<h3 style = {{fontFamily: 'Poppins, sans-serif' }}>1. Add a picture of yourself and let us find celebrities who look like you.</h3>*/}
            <p className={styles.ruleSection}>1. Add a picture of yourself and let us find celebrities who look like you.</p>
            <br />
            
            
            <img style={{ width: "120px", height: "140px", float: "left" }} src={Zendaya} alt='Celeb3'/>
            <img style={{ width: "120px", height: "140px", float: "right" }} src={Taylor} alt='Celeb4'/>
            <br/>
            <br />
            <p className = {styles.ruleSection}>2. Discover their iconic hairstyles and outfit inspirations tailored to your look.</p>
            <br />

            <img style={{ width: "110px", height: "130px", float: "left" }} src={TheRock} alt='Celeb5'/>
            <img style={{ width: "110px", height: "130px", float: "right" }} src={RDJ} alt='Celeb5'/>
            <br/>
            <br/>
            <p className = {styles.ruleSection}>3. Discover their iconic hairstyles and outfit inspirations tailored to your look!</p>
            <br />
            <br />
            <br />

            <input onChange={ handleUpload } type="file"/>
            <button style={{ backgroundColor: '#347C9B'}}  onClick={ handleClick } >Upload Photo</button>
        
        </div>

        
        
    );
    
};

function FileUpload() {
    const [file, setFile] = use()

    function handleFile(event) {
        setFile(event.target.files[0])
            console.log(file)
    }
    return (
        <div>
            <form>
                <input type = "file" name = "file" onChange = {handleFile} />
                <button>Upload</button>
            </form>
        </div>
    )
}


export default LandingPage;