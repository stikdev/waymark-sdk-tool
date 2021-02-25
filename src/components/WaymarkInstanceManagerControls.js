import { useEffect, useState } from "react";
import { JsonEditor } from "jsoneditor-react";
import KJUR from "jsrsasign";
import { v4 as uuidv4 } from "uuid";

function OperationResults(props) {
  return <pre>{props.results && JSON.stringify(props.results, null, 2)}</pre>;
}

function OpenEditorForTemplateTestForm({ waymarkInstance }) {
  const [status, setStatus] = useState(null);

  return (
    <form
      data-test="openEditorForTemplate-form"
      onSubmit={async (event) => {
        event.preventDefault();

        const formElement = event.target;

        try {
          // Open the editor with the provided variant slug
          await waymarkInstance.openEditorForTemplate(
            formElement.variantSlug.value
          );

          console.log("Successfully opened editor!");
          setStatus("Success!");
        } catch (error) {
          console.error(error);
          setStatus(`${error}`);
        }
      }}
    >
      <h2>waymark.openEditorForTemplate()</h2>
      <label htmlFor="variantSlug" className="form-label">
        Template ID (variant slug) -- to force this call to fail, pass in
        "test-reject"
      </label>
      <input
        type="text"
        className="form-input"
        id="variantSlug"
        name="variantSlug"
        defaultValue="test-template-id"
      />
      <button className="submit-button">
        Call waymark.openEditorForTemplate()
      </button>
      <OperationResults results={status} />
    </form>
  );
}

function OpenEditorForVideoTestForm({ waymarkInstance }) {
  const [status, setStatus] = useState(null);

  return (
    <form
      data-test="openEditorForVideo-form"
      onSubmit={async (event) => {
        event.preventDefault();

        const formElement = event.target;

        try {
          // Open the editor with the provided video ID slug
          await waymarkInstance.openEditorForVideo(formElement.videoID.value);

          console.log("Successfully opened editor!");
          setStatus("Success!");
        } catch (error) {
          console.error(error);
          setStatus(`${error}`);
        }
      }}
    >
      <h2>waymark.openEditorForVideo()</h2>
      <label htmlFor="videoID" className="form-label">
        Video ID (user video GUID) -- to force this call to fail, pass in
        "test-reject"
      </label>
      <input
        type="text"
        className="form-input"
        id="videoID"
        name="videoID"
        defaultValue="test-video-id"
      />
      <button className="submit-button">
        Call waymark.openEditorForVideo()
      </button>
      <OperationResults results={status} />
    </form>
  );
}

function GetCollectionsTestForm({ waymarkInstance }) {
  const [collections, setCollections] = useState(null);

  return (
    <form
      data-test="getCollections-form"
      onSubmit={async (event) => {
        event.preventDefault();

        const formElement = event.target;

        try {
          const newCollections = await waymarkInstance.getCollections(
            formElement.shouldGetCollectionsReject.checked
          );

          console.log("Received collections:", newCollections);
          setCollections(newCollections);
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <h2>waymark.getCollections()</h2>
      <label htmlFor="shouldGetCollectionsReject" className="form-label">
        Should getCollections promise reject?
      </label>
      <input
        type="checkbox"
        id="shouldGetCollectionsReject"
        name="shouldGetCollectionsReject"
        defaultValue={false}
      />
      <button className="submit-button" data-test="getCollections-button">
        Call waymark.getCollections()
      </button>
      <OperationResults results={collections} />
    </form>
  );
}

function GetTemplatesForCollectionTestForm({ waymarkInstance }) {
  const [templates, setTemplates] = useState(null);

  return (
    <form
      data-test="getTemplatesForCollection-form"
      onSubmit={async (event) => {
        event.preventDefault();

        const formElement = event.target;

        try {
          const collectionID = formElement.collectionID.value;

          const newTemplates = await waymarkInstance.getTemplatesForCollection(
            collectionID
          );

          console.log(
            `Received templates for collection ${collectionID}:`,
            newTemplates
          );
          setTemplates(newTemplates);
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <h2>waymark.getTemplatesForCollection()</h2>
      <label htmlFor="collectionID" className="form-label">
        Collection ID
      </label>
      <input
        type="text"
        className="form-input"
        id="collectionID"
        name="collectionID"
        defaultValue="HOT-AND-NEW-ABCD-1234"
      />
      <button
        className="submit-button"
        data-test="getTemplatesForCollection-button"
      >
        Call waymark.getTemplatesForCollection()
      </button>
      <OperationResults results={templates} />
    </form>
  );
}

function CreateAccountTestForm({ waymarkInstance }) {
  const [status, setStatus] = useState(null);

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
            jti: uuidv4(),
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

          await waymarkInstance.createAccount(signedJWT);

          console.log("Created account");
          setStatus("Success!");
        } catch (error) {
          console.error(error);
          setStatus(`${error}`);
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
        defaultValue="fake-partner-id"
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
        Call waymark.createAccount()
      </button>
      <OperationResults results={status} />
    </form>
  );
}

function LoginAccountTestForm({ waymarkInstance }) {
  const [status, setStatus] = useState(null);
  const [accountData, setAccountData] = useState(() => ({
    accountID: "existing-account-id",
  }));

  return (
    <form
      data-test="loginAccount-form"
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
            jti: uuidv4(),
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

          await waymarkInstance.loginAccount(signedJWT);

          console.log("Logged in account");
          setStatus("Success!");
        } catch (error) {
          console.error(error);
          setStatus(`${error}`);
        }
      }}
    >
      <h2>waymark.loginAccount()</h2>
      <label className="form-label" htmlFor="loginAccountPrivateKey">
        JWT Private Key -- the accepted test harness secret is "test-secret";
        changing it to anything else will cause the call to fail
      </label>
      <input
        type="text"
        className="form-input"
        id="loginAccountPrivateKey"
        name="privateKey"
        defaultValue="test-secret"
      />
      <label className="form-label" htmlFor="loginAccountPartnerID">
        JWT Partner ID -- if this does not match the Partner ID used to
        initialize the Waymark instance, the call will be rejected
      </label>
      <input
        type="text"
        className="form-input"
        id="loginAccountPartnerID"
        name="partnerID"
        defaultValue="fake-partner-id"
      />
      <label className="form-label">
        Account data -- will successfully log the user in if the `accountID` is
        "existing-account-id" or the `externalID` is "existing-external-id"
      </label>
      <JsonEditor
        value={accountData}
        onChange={(newAccountData) => setAccountData(newAccountData)}
      />
      <button className="submit-button" data-test="loginAccount-button">
        Call waymark.loginAccount()
      </button>
      <OperationResults results={status} />
    </form>
  );
}

function GetAccountInfoTestForm({ waymarkInstance }) {
  const [accountInfo, setAccountInfo] = useState(null);

  return (
    <form
      data-test="getAccountInfo-form"
      onSubmit={async (event) => {
        event.preventDefault();

        try {
          const newAccountInfo = await waymarkInstance.getAccountInfo();

          console.log("Received account info:", newAccountInfo);
          setAccountInfo(newAccountInfo);
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <h2>waymark.getAccountInfo()</h2>
      <button className="submit-button" data-test="getAccountInfo-button">
        Call waymark.getAccountInfo()
      </button>
      <OperationResults results={accountInfo} />
    </form>
  );
}

function UpdateAccountInfoTestForm({ waymarkInstance }) {
  const [status, setStatus] = useState(null);
  const [updatedAccountData, setUpdatedAccountData] = useState(() => ({
    firstName: "Bob",
  }));

  return (
    <form
      data-test="updateAccountInfo-form"
      onSubmit={async (event) => {
        event.preventDefault();

        try {
          await waymarkInstance.updateAccountInfo(updatedAccountData);

          console.log("Updated account info");
          setStatus("Success!");
        } catch (error) {
          console.error(error);
          setStatus(`${error}`);
        }
      }}
    >
      <h2>waymark.updateAccountInfo()</h2>
      <label className="form-label">
        Account data -- setting `firstName` to "test-reject" will force the call
        to fail
      </label>
      <JsonEditor
        value={updatedAccountData}
        onChange={(newAccountData) => setUpdatedAccountData(newAccountData)}
      />
      <button className="submit-button" data-test="updateAccountInfo-button">
        Call waymark.updateAccountInfo()
      </button>
      <OperationResults results={status} />
    </form>
  );
}

function GetVideosTestForm({ waymarkInstance }) {
  const [videos, setVideos] = useState(null);

  return (
    <form
      data-test="getVideos-form"
      onSubmit={async (event) => {
        event.preventDefault();

        try {
          const newVideos = await waymarkInstance.getVideos();

          console.log("Received account videos:", newVideos);
          setVideos(newVideos);
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <h2>waymark.getVideos()</h2>
      <button className="submit-button" data-test="getVideos-button">
        Call waymark.getVideos()
      </button>
      <OperationResults results={videos} />
    </form>
  );
}

function OpenSavedVideosTestForm({ waymarkInstance }) {
  const [status, setStatus] = useState(null);

  return (
    <form
      data-test="openSavedVideos-form"
      onSubmit={async (event) => {
        event.preventDefault();

        try {
          await waymarkInstance.openSavedVideos();
          setStatus("Success!");
        } catch (error) {
          console.error(error);
          setStatus(`${error}`);
        }
      }}
    >
      <h2>waymark.openSavedVideos()</h2>
      <button className="submit-button" data-test="openSavedVideos-button">
        Call waymark.openSavedVideos()
      </button>
      <OperationResults results={status} />
    </form>
  );
}

function CloseTestForm({ waymarkInstance }) {
  const [status, setStatus] = useState(null);

  return (
    <form
      data-test="close-form"
      onSubmit={async (event) => {
        event.preventDefault();

        try {
          await waymarkInstance.close();
          setStatus("Closed.");
        } catch (error) {
          console.error(error);
          setStatus(`${error}`);
        }
      }}
    >
      <h2>waymark.close()</h2>
      <button className="submit-button" data-test="close-button">
        Call waymark.close()
      </button>
      <OperationResults results={status} />
    </form>
  );
}

/**
 * Form provides controls for managing an existing Waymark instance, ie opening a video in the editor
 */
export default function WaymarkInstanceManagerControls({ waymarkInstance }) {
  useEffect(() => {
    waymarkInstance.on("editorExited", () =>
      console.log("USER CLOSING EDITOR")
    );
    waymarkInstance.on("videoCompleted", (videoObject) =>
      console.log("PURCHASING VIDEO", videoObject)
    );
    waymarkInstance.on("videoRendered", (videoObject) =>
      console.log("RENDER COMPLETE", videoObject)
    );
  }, [waymarkInstance]);

  return (
    <div className="test-form-grid">
      <CreateAccountTestForm waymarkInstance={waymarkInstance} />
      <LoginAccountTestForm waymarkInstance={waymarkInstance} />
      <GetAccountInfoTestForm waymarkInstance={waymarkInstance} />
      <UpdateAccountInfoTestForm waymarkInstance={waymarkInstance} />
      <GetCollectionsTestForm waymarkInstance={waymarkInstance} />
      <GetTemplatesForCollectionTestForm waymarkInstance={waymarkInstance} />
      <OpenEditorForTemplateTestForm waymarkInstance={waymarkInstance} />
      <OpenEditorForVideoTestForm waymarkInstance={waymarkInstance} />
      <GetVideosTestForm waymarkInstance={waymarkInstance} />
      <OpenSavedVideosTestForm waymarkInstance={waymarkInstance} />
      <CloseTestForm waymarkInstance={waymarkInstance} />
    </div>
  );
}
