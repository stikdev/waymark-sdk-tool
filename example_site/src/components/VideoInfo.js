import { useState, useEffect } from "react";
import "./VideoInfo.css"
import { getFormattedDate } from "../utils/date";

/**
 * Renders a video component showing video thumbnail and information
 * 
 * @param {Object} video Video object
 */
const VideoInfo = ({video}) => {
    const [imageDimensions, setImageDimensions] = useState({width: 1, height: 1});
    const createdDate = getFormattedDate(video.createdAt);
    const updatedDate = getFormattedDate(video.updatedAt);
    const purchasedDate = 
        (video.purchasedAt ? getFormattedDate(new Date(video.purchasedAt)) : null);

    useEffect(() => {
        const getImageDimensions = async () => {
            const loadingImage = new Promise((resolve, reject) => {
                let image = new Image();
                image.onload = () => {
                    const dimensions = {
                        width: image.width,
                        height: image.height,
                    };
                    image.remove();
                    image = null;
                    resolve(dimensions);
                    };
                    image.onerror = (error) => reject(error);
                    image.src = video.thumbnailURL;
            });
            const imageDimensions = await loadingImage;
            setImageDimensions(imageDimensions);
        }
        getImageDimensions();
    }, [video.thumbnailURL])

    return (
        <div className='two-columns video-column'>
            <div className='image-container'>
                <img 
                    style={{
                        width: imageDimensions.width > imageDimensions.height ? '100px' :
                            (imageDimensions.width/(imageDimensions.height/100)),
                        height: imageDimensions.height > imageDimensions.width ? '100px' : 
                            (imageDimensions.height/(imageDimensions.width/100)),
                        objectFit: 'contain',
                        borderRadius: '4px',
                    }}
                    alt={`${video.videoName} thumbnail`}
                    src={video.thumbnailURL}
                />
            </div>
            <div className='info-container'>
                <div className='video-name'> {video.videoName} </div>
                <div className='video-info'> Created on {createdDate} </div>
                <div className='video-info'> Updated on {updatedDate} </div>
                <div className='video-info'>
                    {purchasedDate ? (
                        `Purchased on ${purchasedDate}`
                    ) : null} 
                </div>
            </div>
        </div>
    )
};

export default VideoInfo;
