import "./VideoInfo.css"
import { getFormattedDate } from "../utils/date";

/**
 * @param {String} url
 * @returns the numerical value of an image's width given url source
 */
function getThumbnailWidth(url) {
    var img = new Image();
    img.src = url;
    return img.width;
}

/**
 * @param {String} url
 * @returns the numerical value of an image's height given url source
 */
function getThumbnailHeight(url) {
    var img = new Image();
    img.src = url;
    return img.height;
}

/**
 * Renders a video component showing video thumbnail and information
 * 
 * @param {Object} video Video object
 */
const VideoInfo = ({video}) => {
    const createdDate = getFormattedDate(video.createdAt);
    const updatedDate = getFormattedDate(video.updatedAt);
    const purchasedDate = 
        (video.purchasedAt ? getFormattedDate(new Date(video.purchasedAt)) : null);
    const width = getThumbnailWidth(video.thumbnailURL);
    const height = getThumbnailHeight(video.thumbnailURL);
    
    return (
        <div className='two-columns video-column'>
            <div className='image-container'>
                <img 
                    style={{
                        width: width > height ? '100px' :
                            `${(width/(height/100))}`,
                        height: height > width ? '100px' : 
                            `${(height/(width/100))}`,
                        objectFit: 'contain',
                        borderRadius: '4px',
                      }}
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
