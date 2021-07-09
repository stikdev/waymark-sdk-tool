import "./VideoInfo.css"

/**
 * Renders a video component showing video thumbnail and information
 * 
 * @param {Object} video Video object
 */
const VideoInfo = ({ video }) => {
    const createdDate = (video.createdAt + "").substr(0, 15);
    const updatedDate = (video.updatedAt + "").substr(0, 15);
    const purchasedDate = 
        (video.purchasedAt ? (new Date(video.purchasedAt) + "").substr(0, 15) : null);
    
    return (
        <div className='two-columns video-column'>
            <div className='image-container'>
                <img className="fit-picture" src={video.thumbnailURL}/>
            </div>
            <div>
                <div><b>{video.videoName} </b></div>
                <div> Created on {createdDate} </div>
                <div> Updated on {updatedDate} </div>
                <div>
                {purchasedDate ? (
                    `Purchased on ${purchasedDate}`
                ) : null} </div>
            </div>
        </div>
    )
};

export default VideoInfo;
