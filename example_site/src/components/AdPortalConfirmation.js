import Header from "./Header.js";
import { useAppContext } from "./AppProvider";

/**
 * Confirmation Page in Ad Portal Workflow
 */
export default function AdPortalConfirmation() {
    const {
        waymarkInstance,
        setWaymarkInstance,
        setAccount,
        setEditorNextURL,
        setShowLandingPage,
    } = useAppContext();

    async function onResetWaymarkInstance() {
        await waymarkInstance.cleanup();
        setWaymarkInstance(null);
        setAccount(null);
        setEditorNextURL('/collections');
        setShowLandingPage(true);
    }

    return (
        <div className='center'>
            <Header 
            title="Great — Your Commercial Is All Set"
            subtitle="Now it’s time to set your budget and get on the air."
            />
            <button 
                className="submit-button"
                onClick={onResetWaymarkInstance}>
                Restart Demo
            </button>
        </div>
    );
}
