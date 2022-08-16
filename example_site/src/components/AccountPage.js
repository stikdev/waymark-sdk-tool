import { useMemo } from "react";

import { useAppContext } from "./AppProvider";
import AccountInfoForm from "./AccountInfoForm.js";
import Header from "./Header.js";
import VideoInfo from "./VideoInfo.js";
import "./AccountPage.css";
import { accountVideos } from "../constants/app";

export default function AccountPage() {
  const {
    waymarkInstance,
    onResetWaymarkInstance,
    account,
    setAccount,
  } = useAppContext();

  // Commented out code because getVideos is not implemented yet
  //
  // const { isLoading, isError, isSuccess, data: videos, error } = useQuery(
  //   "videos",
  //   () => waymarkInstance.getVideos(),
  //   {
  //     enabled: !!waymarkInstance,
  //   }
  // );

  const onSubmitUpdateAccountForm = async (formData) => {
    try {
      const account = await waymarkInstance.updateAccountInfo(formData);

      console.log("Account successfully updated ", account);

      setAccount(account);
    } catch (error) {
      console.error("updateAccountInfo error", error);
    }
  };

  /**
   * Format video dates and sort by most recent date
   */
  const formattedVideos = useMemo(() => {
    const intermediateVideos = accountVideos.map((video) => ({
      ...video,
      createdAt: new Date(video.createdAt),
      updatedAt: new Date(video.updatedAt),
    }));
    return intermediateVideos.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
  }, []);

  return (
    <div data-testid="editorClosedPage">
      <Header
        title="You Did It"
        subtitle="You just created a custom video with the Waymark
        SDK! Send users to a confirmation page or keep them moving
        through a larger flow. You can also get a list of all the 
        user's videos, as shown below."
        isAdPortalFlow={false}
      />

      <button
        className="submit-button configuration-submit-button"
        onClick={async () => await onResetWaymarkInstance()}
      >
        Back To Start
      </button>

      <div className="two-columns" style={{ width: "80%" }}>
        <div className="push-right">
          <h2>
            {account.firstName
              ? account.firstName + "'s Account"
              : "Your Account"}
          </h2>

          <AccountInfoForm
            account={account}
            onFormSubmit={onSubmitUpdateAccountForm}
            submitButtonText="Save"
            requireInputChange={true}
          />
        </div>

        <div>
          {formattedVideos.map((video) => (
            <VideoInfo key={video.videoName} video={video} />
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
