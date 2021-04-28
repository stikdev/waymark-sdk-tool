import { useState } from "react";
import { useQuery } from "react-query";

import { useAppContext } from "./AppProvider";
import AccountInfoForm from "./AccountInfoForm.js";
import { EditPencilIcon } from "./Icons.js";
import "./AccountPage.css";

const Video = ({ video }) => {
  return <div className="account-video">Video: {video.name}</div>;
};

export default function AccountPage() {
  const {
    waymarkInstance,
    account,
    setAccount,
    openSnackbar,
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

  return (
    <div className="account-page panel">
      <h2>
        Your Account
        <EditPencilIcon
          onClick={() => setIsUpdatingAccount(true)}
          style={{ marginBottom: "-7px" }}
        />
      </h2>

      {!isUpdatingAccount ? (
        <>
          <div className="account-id">
            <strong>ID: </strong>
            {account.id}
            <br />
            <strong>External ID: </strong>
            {account.externalID}
          </div>
          <div className="account-email">
            <strong>Email address: </strong>
            {account.emailAddress}
          </div>
          <div className="account-name">
            {account.firstName} {account.lastName}
          </div>
          <div className="account-company">{account.companyName}</div>
          <div className="account-phone">{account.phone}</div>
          <div className="account-address">
            {account.city}
            {account.city && account.state ? ", " : ""}
            {account.state}
          </div>
        </>
      ) : (
        <>
          <AccountInfoForm
            account={account}
            formTitle="waymark.updateAccountInfo()"
            onSubmit={onSubmitUpdateAccountForm}
            shouldRequirePrivateKey={false}
            submitButtonText="Update Account"
          />
          <button
            className="cancel-button"
            onClick={() => setIsUpdatingAccount(false)}
          >
            Cancel
          </button>
        </>
      )}

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
