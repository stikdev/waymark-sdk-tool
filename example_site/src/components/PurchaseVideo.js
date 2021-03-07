import { useAppContext } from "./AppProvider";
import "./PurchaseVideo.css";

export default function PurchaseVideo() {
  const { purchasedVideo, goHome, getTemplateByID, openSnackbar } = useAppContext();

  const template = purchasedVideo ? getTemplateByID(purchasedVideo.templateID) : {};

  const completePurchase = () => {
    openSnackbar("Purchased!");
    setTimeout(goHome, 5000);
  };

  return (
    <div className="purchase-form">
      <h2>Purchase Video</h2>
      {purchasedVideo ?
       (<>
          <div className="description video-name">
            <label>Name:</label>
            <span>{purchasedVideo ? purchasedVideo.name : "<none>"}</span>
          </div>
          <div className="description template-name">
            <label>Template:</label>
            <span>{template.name || ""}</span>
          </div>
          <div className="description video-aspect">
            <label>Aspect:</label>
            <span>{template.aspectRatio || ""}</span>
          </div>
          <div className="description video-duration">
            <label>Duration:</label>
            <span>{`${template.duration}s` || ""}</span>
          </div>
          <div className="description video-size">
            <label>Size:</label>
            <span>{`${template.width}x${template.height}` || ""}</span>
          </div>
          <div className="licensing">{template.licensing === "tv" && "Licensed For Television"}</div>
          <button
            className="submit-button"
            onClick={completePurchase}
            data-test="purchaseVideo-button"
          >
            Purchase
          </button>
        </>
       ) : (
           <div>Visit the collections to purchase a video!</div>
       )}
    </div>
  );
}
