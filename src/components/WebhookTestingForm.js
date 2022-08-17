import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "react-simple-snackbar";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import classnames from "classnames";
import KJUR from "jsrsasign";
import { faker } from "@faker-js/faker";

import CopyIcon from "./CopyIcon";
import { theBlue } from "./constants";
import "./WebhookTestingForm.css";

const CORS_EXAMPLE =
  "Access-Control-Allow-Origin: *\nAccess-Control-Allow-Methods: *";

/**
 * Form for sending test webhook events.
 */
export default function WebhookTestingForm({ waymarkInstance }) {
  const { register, watch, handleSubmit } = useForm();
  const [rawEvent, setRawEvent] = useState({});
  const [isRawEventCopied, setIsRawEventCopied] = useState(false);
  const [webhookRequest, setWebhookRequest] = useState("");
  const [isWebhookRequestCopied, setIsWebhookRequestCopied] = useState(false);
  const [responseStatus, setResponseStatus] = useState("");
  const [responseStatusText, setResponseStatusText] = useState("");
  const [isResponseGood, setIsResponseGood] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Enable the tooltip for dynamic elements that won't exist when it scans the page.
    ReactTooltip.rebuild();
  }, [webhookRequest]);

  const [openSnackbar] = useSnackbar({
    style: {
      backgroundColor: theBlue,
      textColor: "white",
      fontWeight: "bold",
      fontSize: "16px",
    },
  });

  const shouldSignEvent = watch("shouldSignEvent", true);
  const eventSource = watch("eventSource", "local");

  const copyWebhookRequest = () => {
    setIsRawEventCopied(false);
    setIsWebhookRequestCopied(true);
    openSnackbar("Copied webhook request!");
  };

  const copyRawEvent = () => {
    setIsRawEventCopied(true);
    setIsWebhookRequestCopied(false);
    openSnackbar("Copied raw event!");
  };

  const scrollToResponse = () => {
    window.scrollTo({ top: document.body.clientHeight, behavior: "smooth" });
  };

  const createEventBody = (eventID, eventType) => {
    if (eventType === "video.rendered") {
      return {
        id: eventID,
        createdAt: faker.date.past().toJSON(),
        updatedAt: faker.date.recent().toJSON(),
        name: faker.commerce.productName(),
        templateID: faker.random.uuid(),
        renders: [
          {
            renderedAt: null,
            format: "broadcast",
            url: `${faker.image.imageUrl()}/movie.mov`,
            status: "in_progress",
          },
          {
            renderedAt: faker.date.recent().toJSON(),
            format: "email",
            url: `${faker.image.imageUrl()}/movie.mp4`,
            status: "succeeded",
          },
        ],
      };
    }

    if (eventType === "video.purchased") {
      return {
        id: eventID,
        createdAt: faker.date.past().toJSON(),
        updatedAt: faker.date.recent().toJSON(),
        name: faker.commerce.productName(),
        templateID: faker.random.uuid(),
        renders: [],
      };
    }

    if (eventType === "account.created") {
      return {
        id: eventID,
        createdAt: faker.date.past().toJSON(),
        updatedAt: faker.date.recent().toJSON(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        emailAddress: faker.internet.email(),
        companyName: faker.company.companyName(),
        phone: faker.phone.phoneNumberFormat(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
      };
    }

    return null;
  };

  const createJWTEvent = (eventID, event, signaturePrivateKey) => {
    const jwt_header = { alg: "HS256", typ: "JWT" };
    const jwt_payload = {
      jti: eventID,
      iss: "waymark.com",
      iat: KJUR.jws.IntDate.get("now"),
      exp: KJUR.jws.IntDate.get("now + 1hour"),
      "https://waymark.com/webhook/event": event,
    };

    return KJUR.jws.JWS.sign(
      "HS256",
      JSON.stringify(jwt_header),
      JSON.stringify(jwt_payload),
      signaturePrivateKey
    );
  };

  const onSubmit = (formData) => {
    const eventID = faker.random.uuid();
    const {
      eventType,
      shouldSignEvent,
      signaturePrivateKey,
      webhookEndpointURL,
    } = formData;

    const event = {
      header: {
        eventID: eventID,
        eventType: eventType,
        eventTimestamp: new Date().toJSON(),
        accountID: faker.random.uuid(),
        externalID: faker.finance.account(),
      },
    };

    const eventBody = createEventBody(eventID, eventType);

    event.data = eventBody;
    setRawEvent(event);
    setIsRawEventCopied(false);

    const postOptions = {
      timeout: 5000,
    };

    let requestEvent, requestURL, displayEvent;

    if (eventSource === "local") {
      // Local events need to be formatted as the webhook service would send them.
      if (shouldSignEvent) {
        requestEvent = createJWTEvent(eventID, event, signaturePrivateKey);
        postOptions.headers = { "content-type": "application/jwt" };
      } else {
        requestEvent = event;
      }
      requestURL = webhookEndpointURL;
      displayEvent = requestEvent;
    } else {
      // Remote events have a different format because they're being sent to the
      // test harness webhook event endpoint in Demo.
      requestEvent = {
        endpoint_url: webhookEndpointURL,
        event: event,
        should_sign: shouldSignEvent,
        override_secret: signaturePrivateKey,
      };
      requestURL =
        "https://demo.waymark.com/api/v3/test-harness/webhook-dispatch";
      displayEvent = shouldSignEvent
        ? createJWTEvent(eventID, event, signaturePrivateKey)
        : event;
    }

    setWebhookRequest(
      shouldSignEvent ? displayEvent : JSON.stringify(displayEvent)
    );
    setIsWebhookRequestCopied(false);

    setIsSending(true);
    axios
      .post(requestURL, requestEvent, postOptions)
      .then((response) => {
        console.log("RESPONSE", response);
        setResponseStatus(response.status);
        setResponseStatusText(response.statusText);
        setIsResponseGood(response.status === 200);
        setIsSending(false);
        scrollToResponse();
      })
      .catch((error) => {
        console.error("ERROR", error);
        setResponseStatus(error.name);
        setResponseStatusText(error.message);
        setIsResponseGood(false);
        setIsSending(false);
        scrollToResponse();
      });
  };

  const responseClasses = classnames({
    "webhook-response": true,
    failure: !isResponseGood && isResponseGood !== null,
    start: isResponseGood === null,
  });

  const prettyRawEvent = JSON.stringify(rawEvent, null, 2);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="webhook-testing-form">
        <h2>Webhook Endpoint Testing</h2>
        <p>
          This form can send a webhook event of your choosing to a local webhook
          endpoint for testing the event format and signature encoding. The
          generated serialized events can also be copied and used to test your
          endpoint implementation directly.
        </p>

        <label className="form-label" labelfor="localDirect">
          <input
            id="localDirect"
            name="eventSource"
            type="radio"
            value="local"
            ref={register({ required: true })}
            defaultChecked={true}
          />
          Local - Routes directly from the browser to your webhook endpoint
        </label>
        <label className="form-label" labelfor="remoteDemo">
          <input
            id="remoteDemo"
            name="eventSource"
            type="radio"
            value="remote"
            ref={register({ required: true })}
          />
          Remote - Routes through the Waymark demo servers to your webhook
          endpoint
        </label>

        {eventSource === "local" ? (
          <>
            <p>
              <b>Note:</b> Local webhook testing will not work unless the
              webhook endpoint sets the following CORS headers. These are not
              required for live testing in the demo environment.
            </p>
            <pre className="code-quote">{CORS_EXAMPLE}</pre>
          </>
        ) : (
          <>
            <p>
              <b>Note:</b> Remote webhook testing will not work unless the
              webhook endpoint is available to the public internet. If you are
              testing an internal, private endpoint, please use Local testing or
              a remote proxy tool like{" "}
              <a href="https://ngrok.com/docs">ngrok</a> (which is a very useful
              testing tool indeed).
            </p>
          </>
        )}

        <label className="form-label" htmlFor="partnerID">
          Partner ID
        </label>
        <input
          type="text"
          className="form-input"
          name="partnerID"
          defaultValue="fake-partner-id"
          ref={register({ required: true })}
        />

        <label
          title="Your webhook endpoint URL"
          className="form-label"
          htmlFor="webhookEndpointURL"
        >
          Your webhook endpoint URL.
        </label>
        <input
          type="text"
          name="webhookEndpointURL"
          ref={register({ required: true })}
          defaultValue="http://XXXXXXXXX.ngrok.io/api/my-webhook-endpoint"
          className="form-input"
        />

        <label
          title="Type of event to send"
          className="form-label"
          htmlFor="eventType"
        >
          Type of event to send.
        </label>
        <select name="eventType" ref={register({ required: true })}>
          <option value="video.rendered">video.rendered</option>
          <option value="video.purchased">video.purchased</option>
          <option value="account.created">account.created</option>
        </select>

        <label className="form-label" htmlFor="shouldSignEvent">
          Sign the event?
        </label>
        <input
          name="shouldSignEvent"
          type="checkbox"
          defaultChecked={shouldSignEvent}
          ref={register}
        />

        {shouldSignEvent && (
          <>
            <label className="form-label" htmlFor="signaturePrivateKey">
              JWT Signature Key -- Change this to the secret your webhook
              endpoint uses. If the two don't match then your endpoint should
              reject the event.
            </label>
            <input
              type="text"
              className="form-input"
              name="signaturePrivateKey"
              defaultValue="test-secret"
              ref={register}
            />
          </>
        )}

        <button className="submit-button" disabled={isSending}>
          Send Webhook Event
        </button>

        {webhookRequest && (
          <>
            <div className="webhook-request">
              <dl>
                <CopyToClipboard
                  text={webhookRequest}
                  onCopy={copyWebhookRequest}
                >
                  <CopyIcon
                    data-for="tooltip"
                    data-tip={
                      isWebhookRequestCopied
                        ? "Copied!"
                        : "Copy webhook request to clipboard"
                    }
                    className="copy-icon"
                    isCopied={isWebhookRequestCopied}
                  />
                </CopyToClipboard>
                <dt>Serialized request body:</dt>
                <dd>
                  <code>{webhookRequest}</code>
                </dd>

                <CopyToClipboard text={prettyRawEvent} onCopy={copyRawEvent}>
                  <CopyIcon
                    data-for="tooltip"
                    data-tip={
                      isRawEventCopied
                        ? "Copied!"
                        : "Copy raw event to clipboard"
                    }
                    className="copy-icon"
                    isCopied={isRawEventCopied}
                  />
                </CopyToClipboard>
                <dt>Raw event:</dt>
                <dd>
                  <pre>{prettyRawEvent.trim()}</pre>
                </dd>
              </dl>
            </div>

            <div className={responseClasses}>
              <dl>
                <dt>Response:</dt>
                <dd>
                  {responseStatus} - {responseStatusText}
                </dd>
              </dl>
            </div>
          </>
        )}
      </form>

      <ReactTooltip
        id="tooltip"
        backgrounColor={theBlue}
        place="right"
        type="info"
        effect="solid"
      />
    </>
  );
}
