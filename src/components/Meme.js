import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Button, Slider, Tooltip, FormControl, InputLabel, Select, MenuItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ResizableBox } from 'react-resizable';
import { NFTStorage, File } from 'nft.storage';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ethers, Contract } from 'ethers';

const NFTContractABI = [
  'function mint(string memory tokenURI) public returns (uint256)'
];
const NFTContractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address

const apiKey = 'YOUR_NFT_STORAGE_API_KEY';
const client = new NFTStorage({ token: apiKey });

const stickers = [
  { src: 'path_to_trollface.png', name: 'Troll Face' },
  { src: 'path_to_forever-alone.png', name: 'Forever Alone' },
  { src: 'path_to_okay.png', name: 'Okay' },
  // Add more stickers here
];

function useFetchMemes() {
  const [allMemes, setAllMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMemes() {
      try {
        const responses = await Promise.all([
          fetch("https://api.imgflip.com/get_memes"),
          fetch("https://api.memegen.link/templates/")
        ]);
        const imgflipData = await responses[0].json();
        const memegenData = await responses[1].json();

        const imgflipMemes = imgflipData.data.memes.map(meme => ({
          url: meme.url,
          name: meme.name
        }));
        const memegenMemes = memegenData.map(template => ({
          url: `https://api.memegen.link/images/${template.id}.png`,
          name: template.name
        }));

        setAllMemes([...imgflipMemes, ...memegenMemes]);
      } catch (error) {
        console.error("Failed to fetch memes:", error);
        setError(error);
      }
      setLoading(false);
    }

    fetchMemes();
  }, []);

  return { allMemes, loading, error };
}

function Meme() {
  const { allMemes, loading, error } = useFetchMemes();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImage: "http://i.imgflip.com/1bij.jpg",
    topX: 0,
    topY: 0,
    bottomX: 0,
    bottomY: 0,
    topRotation: 0,
    bottomRotation: 0,
    textColor: "#FFFFFF",
    textFont: "Arial",
    textSize: 16,
    textShadow: "2px 2px 2px black",
    stickers: [],
    history: [],
    future: [],
    customImage: null,
    name: "", // NFT name
    description: "" // NFT description
  });

  const handleMint = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    const imageUrl = meme.customImage || meme.randomImage;
    if (!imageUrl) {
      alert('No image selected for minting!');
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const metadata = {
        name: meme.name,
        description: meme.description,
        image: new File([blob], 'meme.png', { type: 'image/png' })
      };
      const tokenURI = await storeMeme(metadata);

      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const NFTContract = new Contract(NFTContractAddress, NFTContractABI, signer);
      const tx = await NFTContract.mint(tokenURI);
      await tx.wait();
      alert('Meme minted as NFT successfully!');
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      alert('Failed to mint NFT. See console for details.');
    }
  };

  const storeMeme = async (metadata) => {
    try {
      const storedData = await client.store(metadata);
      console.log('Stored data:', storedData);
      return storedData.url;
    } catch (error) {
      console.error('Failed to store meme:', error);
      throw new Error('Failed to store meme');
    }
  };

  const shadows = [ 
    '2px 2px 2px black',
    '2px 2px 2px white',
    '2px 2px 2px red',
    '2px 2px 2px green',
    '2px 2px 2px blue',
    '2px 2px 2px yellow',
    '2px 2px 2px orange',
    '2px 2px 2px purple',
    '2px 2px 2px pink',
    '2px 2px 2px brown',
  ]

  // Display connection status and wallet information
  const connectionStatus = () => {
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
        <p>Wallet Address: {address}</p>
      </div>
    );
  };


  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * allMemes.length);
    setMeme(prevMeme => ({
      ...prevMeme,
      randomImage: allMemes[randomIndex]?.url || "http://i.imgflip.com/1bij.jpg",
      customImage: null
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMeme(prevMeme => ({
          ...prevMeme,
          customImage: e.target.result,
          randomImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMeme(prevMeme => ({
      ...prevMeme,
      [name]: value,
      history: [...prevMeme.history, prevMeme]
    }));
  };

  const handleDragStop = (type, e, data) => {
    if (type.startsWith('sticker')) {
      const index = parseInt(type.split('-')[1], 10);
      const newStickers = [...meme.stickers];
      newStickers[index] = {...newStickers[index], x: data.x, y: data.y};
      setMeme(prevMeme => ({
        ...prevMeme,
        stickers: newStickers,
        history: [...prevMeme.history, prevMeme]
      }));
    } else {
      setMeme(prevMeme => ({
        ...prevMeme,
        [`${type}X`]: data.x,
        [`${type}Y`]: data.y,
        history: [...prevMeme.history, prevMeme]
      }));
    }
  };

  const undo = () => {
    if (meme.history.length > 0) {
      const current = meme.history.pop();
      setMeme(prevMeme => ({
        ...prevMeme,
        future: [prevMeme, ...prevMeme.future],
        ...current
      }));
    }
  };

  const handleResizeStop = (index, resize, { size }) => {
    const newStickers = meme.stickers.map((sticker, i) => {
      if (i === index) {
        return { ...sticker, width: size.width, height: size.height };
      }
      return sticker;
    });
    setMeme({ ...meme, stickers: newStickers });
  };

  const addSticker = (sticker) => {
    setMeme(prev => ({
      ...prev,
      stickers: [...prev.stickers, { ...sticker, width: 150, height: 150, x: 100, y: 100, rotation: 0 }]
    }));
  };

  const removeSticker = (index) => {
    const filteredStickers = meme.stickers.filter((_, i) => i !== index);
    setMeme({ ...meme, stickers: filteredStickers });
  };

 
  if (loading) return <div>Loading memes...</div>;
  if (error) return <div>Error loading memes: {error.message}</div>;
    return (
        <main>
              {connectionStatus()}

            <div className="form">
                <Tooltip title="Enter text for the top of the meme">
                    <input type="text" placeholder="Top text" className="form-input" name="topText" value={meme.topText} onChange={handleChange} />
                </Tooltip>
                <Tooltip title="Enter text for the bottom of the meme">
                    <input type="text" placeholder="Bottom text" className="form-input" name="bottomText" value={meme.bottomText} onChange={handleChange} />
                </Tooltip>
                <Tooltip title="Choose a color for the text">
                    <input type="color" value={meme.textColor} onChange={e => handleChange({ target: { name: "textColor", value: e.target.value } })} />
                </Tooltip>
                <Tooltip title="Adjust text size">
                    <Slider min={8} max={48} value={meme.textSize} onChange={(e, value) => handleChange({ target: { name: 'textSize', value }})} valueLabelDisplay="auto" />
                </Tooltip>
                <Tooltip title="Upload your own image">
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </Tooltip>
                <FormControl fullWidth>
                    <InputLabel id="font-label">Font</InputLabel>
                    <Select
                        labelId="font-label"
                        value={meme.textFont}
                        label="Font"
                        onChange={e => handleChange({ target: { name: 'textFont', value: e.target.value }})}
                    >
                        <MenuItem value="Arial">Arial</MenuItem>
                        <MenuItem value="Comic Neue">Comic Neue</MenuItem>
                        <MenuItem value="Impact">Impact</MenuItem>
                        <MenuItem value="Roboto">Roboto</MenuItem>
                        <MenuItem value="Indie Flower">Indie Flower</MenuItem>
                        <MenuItem value="Permanent Marker">Permanent Marker</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="sticker-label">Choose a Sticker</InputLabel>
                    <Select
                        labelId="sticker-label"
                        value=""
                        onChange={e => addSticker(stickers.find(sticker => sticker.name === e.target.value))}
                        renderValue={selected => `${selected}`}
                    >
                        {stickers.map((sticker, index) => (
                            <MenuItem key={index} value={sticker.name}>
                                <ListItemIcon>
                                    <img src={sticker.src} alt={sticker.name} style={{ width: 30, height: 30 }} />
                                </ListItemIcon><ListItemText primary={sticker.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            
            <FormControl fullWidth>
                <InputLabel id="shadow-label">Text Shadow</InputLabel>
                <Select
                    labelId="shadow-label"
                    value={meme.textShadow}
                    label="Text Shadow"
                    onChange={e => handleChange({ target: { name: 'textShadow', value: e.target.value }})}
                >
                    {shadows.map(shadow => (
                        <MenuItem key={shadow} value={shadow}>{shadow}</MenuItem>
                    ))}
                </Select>
            </FormControl>
             <TextField
        label="NFT Name"
        variant="outlined"
        value={meme.name}
        onChange={e => setMeme({...meme, name: e.target.value})}
        fullWidth
        margin="normal"
      />
      <TextField
        label="NFT Description"
        variant="outlined"
        value={meme.description}
        multiline
        rows={4}
        onChange={e => setMeme({...meme, description: e.target.value})}
        fullWidth
        margin="normal"
      />
            
            <Button className="form-button" onClick={getRandomImage}>Get a new meme image 🖼️</Button>
            <Button className="form-button" onClick={undo}>Undo</Button>
            <Button className="form-button" onClick={handleMint}>Mint your Meme as NFT</Button>
           
        </div>
        <div className="meme">
            <img src={meme.randomImage || meme.customImage} alt="meme" className="meme-image" />
            {meme.stickers.map((sticker, index) => (
                <Draggable
                    key={index}
                    onStop={(e, data) => handleDragStop(`sticker-${index}`, e, data)}
                    defaultPosition={{x: sticker.x, y: sticker.y}}
                >
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <ResizableBox
                            width={sticker.width}
                            height={sticker.height}
                            onResizeStop={(e, data) => handleResizeStop(index, e, data)}
                            resizeHandles={['se']}
                            className="resize-container"
                        >
                            <img src={sticker.src} alt={sticker.name} style={{ width: '100%', height: '100%' }} />
                        </ResizableBox>
                        <DeleteIcon
                            onClick={() => removeSticker(index)}
                            style={{ cursor: 'pointer', position: 'absolute', top: '-10px', right: '-10px', color: 'red', zIndex: 1000 }}
                        />
                    </div>
                </Draggable>
            ))}
            <Draggable onStop={(e, data) => handleDragStop('top', e, data)} defaultPosition={{ x: meme.topX, y: meme.topY }}>
                <h2 className="meme-text top" style={{ color: meme.textColor, fontFamily: meme.textFont, fontSize: `${meme.textSize}px`, textShadow: meme.textShadow }}>{meme.topText}</h2>
            </Draggable>
            <Draggable onStop={(e, data) => handleDragStop('bottom', e, data)} defaultPosition={{ x: meme.bottomX, y: meme.bottomY }}>
                <h2 className="meme-text bottom" style={{ color: meme.textColor, fontFamily: meme.textFont, fontSize: `${meme.textSize}px`, textShadow: meme.textShadow }}>{meme.bottomText}</h2>
            </Draggable>
        </div>
    </main>
);

}

export default Meme;