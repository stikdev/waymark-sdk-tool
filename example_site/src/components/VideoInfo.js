import "./VideoInfo.css"

/**
 * Renders a video component showing video thumbnail and information
 * 
 * @param {Object} video Video object
 */
const VideoInfo = ({ video }) => {
    var createdDate = (video.createdAt + "").substr(0, 15);
    console.log("created date", createdDate);
    var updatedDate = (video.updatedAt + "").substr(0, 15);
    console.log("updated date", updatedDate);
    if (video.purchasedAt) {
        var purchasedDate = (new Date(video.purchasedAt) + "").substr(0, 15);
        console.log("purchased date", purchasedDate);
    }
    
    return (
        <div className='two-columns' style={{ width: "100%", 'padding-top': '20px'}}>
            <div className='image-container'>
                <img className="fit-picture" src={video.thumbnailURL}/>
            </div>
            <div>
                <div><b>{video.videoName} </b></div>
                <div> Created on {createdDate} </div>
                <div> Updated on {updatedDate} </div>
                <div>
                {video.purchasedAt ? (
                    `Purchased on ${purchasedDate}`
                ) : null} </div>
            </div>
        </div>
    )
};

export default VideoInfo;
