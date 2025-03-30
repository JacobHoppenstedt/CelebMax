import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './Landing_Page/landingpage.jsx';
import ResultsPage from './Results_Page/resultspage.jsx';
import HairstyleCustomizer from "./Hairstyle_Customizer_Page/hairstyle_customizer.jsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/hairstyle_customizer" element={<HairstyleCustomizer />} />
      </Routes>
    </Router>
  );
}

export default App
