import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { useAppContext } from "./AppProvider";
import AccountInfoForm from "./AccountInfoForm.js";

import Header from "./Header.js";

function LoginAccountForm() {
  const { register, handleSubmit } = useForm();
  const {
    waymarkInstance,
    setAccount,
    partnerID,
    partnerSecret,
    getSignedJWT,
  } = useAppContext();

  const history = useHistory();
  const onSubmit = async ({ accountID, externalID }) => {
    
    if (accountID && externalID) {
      return;
    }

    if (!(accountID || externalID)) {
      return;
    }

    let accountData;
    if (accountID) {
      accountData = { accountID };
    } else {
      accountData = { externalID };
    }

    try {
      const signedJWT = getSignedJWT(accountData, partnerID, partnerSecret); 
      await waymarkInstance.loginAccount(signedJWT);
      const account = await waymarkInstance.getAccountInfo();
      setAccount(account);
      history.push("/templates");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form data-test="loginAccount-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Log in to existing account</h2>
      <p>
        Find an account with your external ID or Waymark account ID
      </p>

      <label className="form-label" htmlFor="loginAccountExternalID">
        External ID
      </label>
      <input
        type="text" 
        id="loginAccountExternalID"
        name="externalID"
        placeholder="<partner account ID>"
        ref={register}
      />

      <label className="form-label" htmlFor="loginAccountAccountID">
        Account ID
      </label>
      <input
        type="text"  
        id="loginAccountAccountID"
        name="accountID"
        placeholder="eg. 1234-ABCD-1234-ABCD"
        ref={register}
      />

      <button className="submit-button form-button" data-test="loginAccount-button">
        Log In
      </button>
    </form>
  );
}

function CreateAccountForm() {
  const { onSubmitCreateAccount } = useAppContext();

  return (
    <AccountInfoForm
      onFormSubmit={onSubmitCreateAccount}
      formTitle="Create Account"
      subtitle="All fields are optional"
      submitButtonText="Create Account"
      requireInputChange={false}
    />
  );
}

export default function AccountAuthentication() {
  return (
    <div className='center'>
      <Header 
        title="Create an Account or Log In"
        subtitle="To keep track of videos that users have created,
        you can create a Waymark account with any information you
        use to identify users on your end."
      /> 
      <div className='two-columns'>
          <CreateAccountForm />
          <LoginAccountForm />
      </div>
    </div>
  );
}
