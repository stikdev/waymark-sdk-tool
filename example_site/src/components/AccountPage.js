import { useState } from "react";
import { useQuery } from "react-query";

import { useAppContext } from "./AppProvider";
import AccountInfoForm from "./AccountInfoForm.js";
import Header from "./Header.js";
import "./AccountPage.css";

const Video = ({ video }) => {
  return <div className="account-video">Video: {video.name}</div>;
};

export default function AccountPage() {
  const {
    waymarkInstance,
    setWaymarkInstance,
    account,
    setAccount,
    openSnackbar,
    setPurchasedVideo,
  } = useAppContext();

  const { isLoading, isError, isSuccess, data: videos, error } = useQuery(
    "videos",
    () => waymarkInstance.getVideos(),
    {
      enabled: !!waymarkInstance,
    }
  );

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
            onSubmit={onSubmitUpdateAccountForm}
            submitButtonText="Save"
          />

          {/*<button
            className="cancel-button"
            onClick={() => setIsUpdatingAccount(false)}
          >
            Cancel
          </button>*/}
        </div>
        
        <div>
        <h2>Videos</h2>
        {isLoading && <div className="loading">Loading...</div>}
        {isError && <div className="error">Error: {error}</div>}
        <ul className="videos">
          {isSuccess &&
            videos.map((video) => <Video key={video.id} video={video} />)}
        </ul>
        </div>
      </div>
    </div>
  );
}
