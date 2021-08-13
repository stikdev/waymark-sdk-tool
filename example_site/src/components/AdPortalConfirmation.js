import Header from "./Header.js";
import AdPortalHeader from "./AdPortalHeader.js";
import "./AdPortalLanding.css"
import { useAppContext } from "./AppProvider";

function RestartDemoButton() {
    const { onResetWaymarkInstance } = useAppContext();

    return (
        <button 
            className="adportal-button"
            onClick={async () => await onResetWaymarkInstance()}
        >
            restart demo
        </button>
    );
}

/**
 * Confirmation Page in Ad Portal Workflow
 */
export default function AdPortalConfirmation() {
    return (
        <div className='poppins'>
            <AdPortalHeader 
                isConfirmationPage={true}
            />
            <div className='header'>
                <Header 
                    title="review & publish"
                    subtitle="Your commercial is ready to run! Review 
                    your campaign details and set it live 
                    in the next step."
                    isAdPortalFlow={true}
                />
            </div>
            <RestartDemoButton />
        </div>
    );
}
