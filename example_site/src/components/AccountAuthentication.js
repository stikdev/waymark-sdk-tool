import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import KJUR from "jsrsasign";
import faker from "faker";

import { useAppContext } from "./AppProvider";
import AccountInfoForm from "./AccountInfoForm.js";
import "./AccountAuthentication.css";

import Header from "./Header.js";

const getSignedJWT = (accountData, partnerID, partnerSecret) => {
  // Header
  const header = { alg: "HS256", typ: "JWT" };
  // Payload
  const payload = {
    jti: faker.random.uuid(),
    iss: partnerID,
    aud: "waymark.com",
    iat: KJUR.jws.IntDate.get("now"),
    exp: KJUR.jws.IntDate.get("now + 1hour"),
    "https://waymark.com/sdk/account": accountData,
  };

  // Sign JWT with our secret
  return KJUR.jws.JWS.sign(
    "HS256",
    JSON.stringify(header),
    JSON.stringify(payload),
    partnerSecret
  );
};

function LoginAccountForm() {
  const { register, handleSubmit } = useForm();
  const {
    waymarkInstance,
    setAccount,
    openSnackbar,
    partnerID,
    partnerSecret,
  } = useAppContext();

  const history = useHistory();
  const onSubmit = async ({ accountID, externalID }) => {
    
    if (accountID && externalID) {
      openSnackbar("Only one of either account ID or external ID may be used.");
      return;
    }

    if (!(accountID || externalID)) {
      openSnackbar("One of either account ID or external ID must be used.");
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
      history.push("/collections");
    } catch (error) {
      console.error(error);
      openSnackbar(error.message);
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
        className="form-input"
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
        className="form-input"
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
  const {
    waymarkInstance,
    setAccount,
    openSnackbar,
    partnerID,
    partnerSecret,
  } = useAppContext();

  const history = useHistory();

  const onSubmit = async (formData) => {
    try {
      const signedJWT = getSignedJWT(formData, partnerID, partnerSecret);

      const accountID = await waymarkInstance.createAccount(signedJWT);

      history.push("/collections");
      openSnackbar(`Created account ID: ${accountID}`);

      const account = await waymarkInstance.getAccountInfo();
      setAccount(account);
      openSnackbar(`Created account: ${account.firstName} ${account.lastName}`);
    } catch (error) {
      openSnackbar(error.message);
    }
  };

  return (
    <AccountInfoForm
      onFormSubmit={onSubmit}
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
