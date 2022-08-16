import "./VideoInfo.css";
import { getFormattedDate } from "../utils/date";

/**
 * Renders a video component showing video thumbnail and information
 *
 * @param {Object} video Video object
 */
const VideoInfo = ({ video }) => {
  const createdDate = getFormattedDate(video.createdAt);
  const updatedDate = getFormattedDate(video.updatedAt);
  const purchasedDate = video.purchasedAt
    ? getFormattedDate(new Date(video.purchasedAt))
    : null;

  const { width, height } = video;

  return (
    <div className="two-columns video-column">
      <div className="image-container">
        <img
          style={{
            width: width > height ? 100 : 100 * (width / height),
            height: height > width ? 100 : 100 * (height / width),
            objectFit: "contain",
            borderRadius: "4px",
          }}
          alt={`${video.videoName} thumbnail`}
          src={video.thumbnailURL}
        />
      </div>
      <div className="info-container">
        <div className="video-name"> {video.videoName} </div>
        <div className="video-info"> Created on {createdDate} </div>
        <div className="video-info"> Updated on {updatedDate} </div>
        <div className="video-info">
          {purchasedDate ? `Purchased on ${purchasedDate}` : null}
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
