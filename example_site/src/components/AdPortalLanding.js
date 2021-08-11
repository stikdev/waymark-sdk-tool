import Header from "./Header.js";
import { useAppContext } from "./AppProvider";

function SelectTemplateButton() {
    const { onSubmitCreateAccount } = useAppContext();

    return (
        <button 
            className="submit-button"
            onClick={() => onSubmitCreateAccount({})}
        >
            Select Your Template
        </button>
    );
}

/**
 * Landing Page in Ad Portal Workflow
 */
export default function AdPortalLanding() {
    return (
        <div className='center'>
            <Header 
                title="Welcome to the ABC Ad Portal"
                subtitle="Now that your audience is set, it’s 
                time to make a commercial for your campaign."
            />
            <SelectTemplateButton />
        </div>
    );
}
