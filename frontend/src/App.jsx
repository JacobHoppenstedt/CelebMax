import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './Landing_Page/landingpage.jsx';
import ResultsPage from './Results_Page/resultspage.jsx';
import CelebSearchPage from "./CelebSearchPage/CelebSearchPage.jsx";

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
        <Route path="/celeb-search" element={<CelebSearchPage />} />
      </Routes>
    </Router>
  );
}

export default App
