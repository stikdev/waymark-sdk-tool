import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "react-simple-snackbar";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import classnames from "classnames";
import KJUR from "jsrsasign";
import faker from "faker";

import "./WebhookTestingForm.css";

const THE_BLUE = "#337AB7";
const CORS_EXAMPLE =
  "Access-Control-Allow-Origin: *\nAccess-Control-Allow-Methods: *";

const CopyIcon = ({ color, isCopied, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    {...props}
  >
    <g
      fill="none"
      fillRule="evenodd"
      stroke={isCopied ? "limegreen" : THE_BLUE}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    >
      <path d="M24 5.5v17a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 4 22.5v-17A1.5 1.5 0 0 1 5.5 4h17A1.5 1.5 0 0 1 24 5.5z" />
      <path d="M28 9.5v17a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 8 26.5v-17A1.5 1.5 0 0 1 9.5 8h17A1.5 1.5 0 0 1 28 9.5z" />
    </g>
  </svg>
);

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
    ReactTooltip.rebuild();
  }, [webhookRequest]);

  const [openSnackbar] = useSnackbar({
    style: {
      backgroundColor: THE_BLUE,
      textColor: "white",
      fontWeight: "bold",
      fontSize: "16px",
    },
  });

  const shouldSignEvent = watch("shouldSignEvent", true);

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
    window.scrollTo({ top: window.outerHeight, behavior: "smooth" });
  };

  const onSubmit = (formData) => {
    const eventID = faker.random.uuid();

    const event = {
      header: {
        eventID: eventID,
        eventType: "video.rendered",
        eventTimestamp: new Date().toJSON(),
        accountID: faker.random.uuid(),
        externalID: faker.finance.account(),
      },
    };

    let eventBody;

    if (formData.eventType === "video.rendered") {
      eventBody = {
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
    } else if (formData.eventType === "video.purchased") {
      eventBody = {
        id: eventID,
        createdAt: faker.date.past().toJSON(),
        updatedAt: faker.date.recent().toJSON(),
        name: faker.commerce.productName(),
        templateID: faker.random.uuid(),
        renders: [],
      };
    } else if (formData.eventType === "account.created") {
      eventBody = {
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

    event.data = eventBody;
    setRawEvent(event);
    setIsRawEventCopied(false);

    let serializedEvent;

    if (formData.shouldSignEvent) {
      const header = { alg: "HS256", typ: "JWT" };
      const payload = {
        jti: eventID,
        iss: "waymark.com",
        iat: KJUR.jws.IntDate.get("now"),
        exp: KJUR.jws.IntDate.get("now + 1hour"),
        "https://waymark.com/webhook/event": event,
      };

      serializedEvent = KJUR.jws.JWS.sign(
        "HS256",
        JSON.stringify(header),
        JSON.stringify(payload),
        formData.signaturePrivateKey
      );
    } else {
      serializedEvent = JSON.stringify(event);
    }

    setWebhookRequest(serializedEvent);
    setIsWebhookRequestCopied(false);

    setIsSending(true);
    axios
      .post(formData.webhookEndpointURL, {
        data: serializedEvent,
        timeout: 5000,
      })
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

        <p>
          <b>Note:</b> The local webhook testing will not work unless the
          webhook endpoint sets the following CORS headers. These are not
          required for live testing in the demo environment.
        </p>
        <pre className="code-quote">{CORS_EXAMPLE}</pre>

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
          defaultValue="https://www.example.com/webhook"
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
        backgrounColor={THE_BLUE}
        place="right"
        type="info"
        effect="solid"
      />
    </>
  );
}
