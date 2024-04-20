

export const connectionStatus = () => {
  if (!isConnected) {
    return <p>Please connect to your wallet.</p>;
  }
  return (
    <div>
      <p>Connected to {chainId === 1 ? "Ethereum Mainnet" :
        chainId === 19 ? "songbird mainnet" :
        chainId === 14 ? "flare mainnet" :
        chainId === 16 ? "Coston Testnet" :
        "an unknown network"}. </p>
              </div>
  );
};