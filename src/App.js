import Header from "./components/Header";
import Meme from "./components/Meme";
import Footer from "./components/Footer";
import { web3Modal } from './utils/web3ModalConfig.js'; // Adjust the import path as necessary
import Hero from "./components/Hero";
import "./styles/App.css";

function App() {
    return (
        <div className="App">
                <web3Modal> {/* Wrap your components with Web3ModalProvider */}

            <Header />
            <Hero />
            <Meme />
            <Footer />
            </web3Modal>
        </div>
    );
}

export default App;
