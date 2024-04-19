import trollFace from "../images/troll-face.png";
import React, { useState } from 'react';
import ConnectButton from '../components/ConnectButton.js';

function Header() {
    const [active, setActive] = useState('meme-generator');

    return (
        <header className="header">
            <img src={trollFace} className="header-image" alt="troll face" />
            <nav className="navbar">
                <ul className="nav-links">
                    <li className={active === 'meme-generator' ? 'active' : ''} onClick={() => setActive('meme-generator')}>
                        <a href="#meme-generator">Meme Generator</a>
                    </li>
                    <li className={active === 'meme-market' ? 'active' : ''} onClick={() => setActive('meme-market')}>
                        <a href="#meme-market">Meme Market</a>
                    </li>
                    <li className={active === 'gaming-market' ? 'active' : ''} onClick={() => setActive('gaming-market')}>
                        <a href="#gaming-market">Gaming Market</a>
                    </li>
                    <li className={active === 'connect' ? 'active' : ''} onClick={() => setActive('connect')}>
                        <ConnectButton />
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
