import React, { useRef, useState } from "react";
import './imageGenerator.css';
import default_img from '../assets/default-img.jpg';

const ImageGenerator = () => {
    const [image_url, setImg_url] = useState(default_img);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    const imageGenerator = async () => {
        if (inputRef.current.value === '') {
            alert('Please enter a description');
            return 0;
        } 
        let apikey = process.env.REACT_APP_OPENAI_API_KEY;

        setIsLoading(true);

        try {
            const response = await fetch(
                'https://api.openai.com/v1/images/generations',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apikey}`,
                        "User-Agent": 'Chrome',
                    },
                    body: JSON.stringify({
                        prompt: inputRef.current.value,
                        n: 1,
                        size: '1024x1024',
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            let data_array = data.data;
            setImg_url(data_array[0].url);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h2>AI image <span>Generator</span></h2>
                <div className="img-loading">
                    {isLoading ? (
                        <div class="loader">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                      </div>
                    ) : (
                        <div className="image">
                            <img src={image_url} alt="ai-img" />
                        </div>
                    )}
                </div>
            </div>
            <div className="search-box">
                <input type="text" ref={inputRef} placeholder="Describe what you want" />
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
            </div>
        </div>
    );
};

export default ImageGenerator;
