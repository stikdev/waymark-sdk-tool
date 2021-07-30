import "./VideoInfo.css"
import { months, days } from "./constants";

/**
 * Renders a video component showing video thumbnail and information
 * 
 * @param {Object} video Video object
 */

function getThumbnailWidth(url) {
    var img = new Image();
    img.src = url;
    return img.width;
}

function getThumbnailHeight(url) {
    var img = new Image();
    img.src = url;
    return img.height;
}

function getMonthName(videoDate){
    const monthName = months[videoDate.getMonth()];
    return monthName;
}

function getWeekdayName(videoDate){
    const dayName = days[videoDate.getDay()];
    return dayName;
}

function getFormattedDate(videoDate){
    return `${getWeekdayName(videoDate)} ${getMonthName(videoDate)} ${videoDate.getDate()}, ${videoDate.getFullYear()}`;
}

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
                    src={video.thumbnailURL}/>
            </div>
            <div className='info-container'>
                <div className='video-name'>{video.videoName}</div>
                <div className='video-info'> Created on {createdDate} </div>
                <div className='video-info'> Updated on {updatedDate} </div>
                <div className='video-info'>
                {purchasedDate ? (
                    `Purchased on ${purchasedDate}`
                ) : null} </div>
            </div>
        </div>
    )
};

export default VideoInfo;
