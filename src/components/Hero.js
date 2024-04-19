// src/components/Hero.js
import React from 'react';
import '../styles/App.css'; // Import the global styles
function Hero() {
    // Example using an online URL, replace it with your actual image URL
    const backgroundImageUrl = "https://images.unsplash.com/photo-1558981359-219d6364c9c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80";

    return (
        <div className="hero" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
            <h1>Welcome to MemeNFT!</h1>
            <p>Create, share, and mint your memes into NFTs directly from your browser.</p>
            <button className="hero-button">Get Started</button>
        </div>
    );
}

export default Hero;