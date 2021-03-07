import { useQuery } from "react-query";

import { useAppContext } from "./AppProvider";
import "./AccountPage.css";

const Video = ({ video }) => {
  return <div className="account-video">Video: {video.name}</div>;
};

export default function AccountPage() {
  const { waymarkInstance, account } = useAppContext();

  const { isLoading, isError, isSuccess, data: videos, error } = useQuery(
    "collections",
    () => waymarkInstance.getVideos(),
    {
      enabled: !!waymarkInstance,
    }
  );

  return (
    <div className="account-page panel">
      <h2>Your Account</h2>
      <div className="account-id">
        ID: {account.id} External ID: {account.externalID}
      </div>
      <div className="account-name">
        {account.firstName} {account.lastName}
      </div>
      <div className="account-company">{account.companyName}</div>
      <div className="account-email">{account.emailAddress}</div>
      <div className="account-phone">{account.phone}</div>
      <div className="account-address">
        {account.city}, {account.state}
      </div>

      <h2>Videos</h2>
      {isLoading && <div className="loading">Loading...</div>}
      {isError && <div className="error">Error: {error}</div>}
      <ul className="videos">
        {isSuccess &&
          videos.map((video) => <Video key={video.id} video={video} />)}
      </ul>
    </div>
  );
}
