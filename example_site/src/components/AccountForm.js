import { JsonEditor } from "jsoneditor-react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import KJUR from "jsrsasign";
import faker from "faker";

import { useAppContext } from "./AppProvider";
import "./AccountForm.css";

export default function AccountForm ({ openSnackbar }) {
  const {waymarkInstance, setAccount} = useAppContext();

  // Default account JSON data for the editor.
  const [accountData, setAccountData] = useState(() => ({
    firstName: "Mabel",
    lastName: "Tierney",
    emailAddress: "mtierney@example.com",
    companyName: "Tierney Auto, Inc.",
    phone: "248-555-1212",
    city: "Dearborn",
    state: "MI",
    externalID: "ABC123",
  }));

  const history = useHistory();

  return (
    <form
      data-test="createAccount-form"
      onSubmit={async (event) => {
        event.preventDefault();

        const formElement = event.target;

        try {
          const privateKey = formElement.privateKey.value;
          const partnerID = formElement.partnerID.value;

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
          const signedJWT = KJUR.jws.JWS.sign(
            "HS256",
            JSON.stringify(header),
            JSON.stringify(payload),
            privateKey
          );

          const accountID = await waymarkInstance.createAccount(signedJWT);

          history.push("/collections");
          console.log("Created account ID:", accountID);
          openSnackbar(`Created account ID: ${accountID}`);

          const account = await waymarkInstance.getAccountInfo();
          console.log("Account", account);
          setAccount(account);
          openSnackbar(`Created account: ${account.firstName} ${account.lastName}`);

        } catch (error) {
          console.error('createAccount error', error);
          openSnackbar(error.message);
        }
      }}
    >
      <h2>waymark.createAccount()</h2>
      <label className="form-label" htmlFor="createAccountPrivateKey">
        JWT Private Key -- the accepted test harness secret is "test-secret";
        changing it to anything else will cause the call will be rejected
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountPrivateKey"
        name="privateKey"
        defaultValue="test-secret"
      />
      <label className="form-label" htmlFor="createAccountPartnerID">
        JWT Partner ID -- if this does not match the Partner ID used to
        initialize the Waymark instance, the call will be rejected
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountPartnerID"
        name="partnerID"
        defaultValue="spectrum-reach"
      />
      <label className="form-label">
        Account data -- the call will be rejected if `emailAddress` is set to
        "existing-account@test.com" or `externalID` is set to
        "existing-external-id"
      </label>
      <JsonEditor
        value={accountData}
        onChange={(newAccountData) => setAccountData(newAccountData)}
      />
      <button className="submit-button" data-test="createAccount-button">
        Create Account
      </button>
    </form>
  );
}
