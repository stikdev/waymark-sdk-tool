import { useState } from "react";
import { useQuery } from "react-query";

import { useAppContext } from "./AppProvider";
import AccountInfoForm from "./AccountInfoForm.js";
import Header from "./Header.js";
import VideoInfo from "./VideoInfo.js";
import "./AccountPage.css";
import { videos } from "./constants";

export default function AccountPage() {
  const {
    waymarkInstance,
    setWaymarkInstance,
    account,
    setAccount,
    openSnackbar,
    setPurchasedVideo,
  } = useAppContext();

  {/* Commented out code because getVideos is not implemented yet
    const { isLoading, isError, isSuccess, data: videos, error } = useQuery(
      "videos",
      () => waymarkInstance.getVideos(),
      {
        enabled: !!waymarkInstance,
      }
    );*/}

  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  const onSubmitUpdateAccountForm = async (formData) => {
    try {
      const account = await waymarkInstance.updateAccountInfo(formData);

      console.log("Account successfully updated ", account);
      openSnackbar("Account successfully updated");

      setAccount(account);
    } catch (error) {
      console.error("updateAccountInfo error", error);
      openSnackbar(error.message);
    }

    setIsUpdatingAccount(false);
  };

  async function onResetWaymarkInstance () {
    await waymarkInstance.cleanup();
    setWaymarkInstance(null);
    setAccount(null);
    setPurchasedVideo(null);
  }

  /* Format video dates and sort by most recent date */
  videos.map((video) => {
    video.createdAt = new Date(video.createdAt);
    video.updatedAt = new Date(video.updatedAt);
  })
  videos.sort((a, b) => {return b.createdAt - a.createdAt})

  return (
    <div className="account-page">
      <Header 
        title="You Did It"
        subtitle="You just created a custom video with the Waymark
        SDK! Send users to a confirmation page or keep them moving
        through a larger flow. You can also get a list of all the 
        user's videos, as shown below."
      />

      <button 
        className="submit-button configuration-submit-button"
        onClick={onResetWaymarkInstance}>
        Back To Start
      </button>

      <div className='two-columns' style={{ width: "80%" }}>
        <div>
          <h2>
            {account.firstName ? (
                account.firstName + "'s Account"
            ) : 'Your Account'}
          </h2>

          <AccountInfoForm
            account={account}
            updateAccount={onSubmitUpdateAccountForm}
            submitButtonText="Save"
            canUpdate={true}
          />
        </div>
        
        <div>
          {videos.map((video) => (
            <VideoInfo video={video}/>
          ))}

          {/* Commented out code because getVideos is not implemented yet
            {isLoading && <div className="loading">Loading...</div>}
            {isError && <div className="error">Error: {error}</div>}
            <ul className="videos">
              {isSuccess &&
                videos.map((video) => <Video key={video.id} video={video} />)}
              </ul> */}

        </div>
      </div>
    </div>
  );
}
