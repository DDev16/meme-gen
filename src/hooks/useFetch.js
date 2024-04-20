// Filename: useFetchMemes.js
import { useState, useEffect } from 'react';

const useFetchMemes = () => {
    const [allMemes, setAllMemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemes = async () => {
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
        };

        fetchMemes();
    }, []);

    return { allMemes, loading, error };
}

export default useFetchMemes;