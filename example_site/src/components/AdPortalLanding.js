import Header from "./Header.js";
import AdPortalHeader from "./AdPortalHeader.js";
import "./AdPortalLanding.css"
import { useAppContext } from "./AppProvider";

function SelectTemplateButton() {
    const { onSubmitCreateAccount } = useAppContext();

    return (
        <button 
            className="adportal-button"
            onClick={() => onSubmitCreateAccount({})}
        >
            Create Commercial In Minutes
        </button>
    );
}

/**
 * Landing Page in Ad Portal Workflow
 */
export default function AdPortalLanding() {
    return (
        <div className='poppins'>
            <AdPortalHeader isConfirmationPage={false} />
            <div className='header'>
                <Header 
                    title="create your commercial"
                    subtitle="Now that you’ve defined your audience, it’s 
                    time to make your commercial. Our dead simple commercial 
                    creation tools make it a breeze — at no cost to you."
                    isAdPortalFlow={true}
                />
            </div>
            <SelectTemplateButton />
        </div>
    );
}
