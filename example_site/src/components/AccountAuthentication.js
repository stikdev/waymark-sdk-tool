import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import KJUR from "jsrsasign";
import faker from "faker";

import { useAppContext } from "./AppProvider";
import AccountInfoForm from "./AccountInfoForm.js";
import "./AccountAuthentication.css";

const getSignedJWT = (accountData, partnerID, privateKey) => {
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
    privateKey
  );
};

function LoginAccountForm() {
  const { register, handleSubmit } = useForm();
  const {
    waymarkInstance,
    setAccount,
    openSnackbar,
    partnerID,
  } = useAppContext();

  const onSubmit = async ({ privateKey, accountID, externalID }) => {
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
      const signedJWT = getSignedJWT(accountData, partnerID, privateKey);
      await waymarkInstance.loginAccount(signedJWT);
      const account = await waymarkInstance.getAccountInfo();
      setAccount(account);

      console.log("Logged in account");
      openSnackbar("Logged in account");
    } catch (error) {
      console.error(error);
      openSnackbar(error.message);
    }
  };

  return (
    <div className="panel">
      <form data-test="loginAccount-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>waymark.loginAccount()</h2>

        <label className="form-label" htmlFor="loginAccountPrivateKey">
          Partner secret
        </label>
        <input
          type="text"
          className="form-input"
          id="loginAccountPrivateKey"
          name="privateKey"
          defaultValue="test-secret"
          ref={register({ required: true })}
        />

        <p>
          Either account ID or external ID may be used, but only one at a time.
        </p>
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

        <button className="submit-button" data-test="loginAccount-button">
          Login
        </button>
      </form>
    </div>
  );
}

function CreateAccountForm() {
  const {
    waymarkInstance,
    setAccount,
    openSnackbar,
    partnerID,
  } = useAppContext();

  const history = useHistory();

  const onSubmit = async (formData) => {
    if (!(formData.emailAddress || formData.externalID)) {
      openSnackbar("Please provide an email address and external ID.");
      return;
    }

    try {
      const { privateKey } = formData;
      // Remove private key from form data since it's not used in the account creation payload
      delete formData.privateKey;

      const signedJWT = getSignedJWT(formData, partnerID, privateKey);

      const accountID = await waymarkInstance.createAccount(signedJWT);

      history.push("/collections");
      console.log("Created account ID:", accountID);
      openSnackbar(`Created account ID: ${accountID}`);

      const account = await waymarkInstance.getAccountInfo();
      console.log("Account", account);
      setAccount(account);
      openSnackbar(`Created account: ${account.firstName} ${account.lastName}`);
    } catch (error) {
      console.error("createAccount error", error);
      openSnackbar(error.message);
    }
  };

  return (
    <div className="panel">
      <AccountInfoForm
        formTitle="waymark.createAccount()"
        onSubmit={onSubmit}
        shouldRequirePrivateKey={true}
        submitButtonText="Create Account"
      />
    </div>
  );
}

export default function AccountAuthentication() {
  return (
    <>
      <CreateAccountForm />
      <LoginAccountForm />
    </>
  );
}
