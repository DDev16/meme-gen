// ConnectButton.js
import Web3Modal from '../utils/web3ModalConfig.js';


const ConnectButton = () => {
  const handleConnect = async () => {
    try {
      const provider = await Web3Modal.connect();
      console.log('Connected to:', provider);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return <w3m-button onClick={handleConnect}></w3m-button>;
};

export default ConnectButton;
