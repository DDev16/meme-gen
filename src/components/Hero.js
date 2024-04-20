// src/components/Hero.js
import React from 'react';
import '../styles/App.css'; // Import the global styles
import mme from "../images/mme.webp";
function Hero() {
    // Example using an online URL, replace it with your actual image URL
    const backgroundImageUrl = mme; 

    return (
        <div className="hero" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>         
            <h1>Welcome to MemeNFT!</h1>
            <p>Create, share, and mint your memes into NFTs directly from your browser.</p>
            <button className="hero-button">Get Started</button>
        </div>
    );
}

export default Hero;