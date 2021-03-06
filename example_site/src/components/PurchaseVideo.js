import { useAppContext } from "./AppProvider";
import "./PurchaseVideo.css";

export default function PurchaseVideo() {
  const { purchasedVideo, goHome } = useAppContext();

  return (
    <>
      <h2>Purchase Video</h2>
      <div>
        <label>Name:</label>
        <span>{purchasedVideo ? purchasedVideo.name : "<none>"}</span>
      </div>
      <button
        className="submit-button"
        onClick={goHome}
        data-test="purchaseVideo-button"
      >
        Purchase
      </button>
    </>
  );
}
