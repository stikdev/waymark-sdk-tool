import Header from "./Header.js";
import { useHistory } from "react-router-dom";
import { adPortalConfiguration } from "../constants/app";
import { useAppContext } from "./AppProvider";

function SelectTemplateButton() {
    const {
        waymarkInstance,
        setAccount,
        partnerID,
        partnerSecret,
        getSignedJWT,
    } = useAppContext();

    const history = useHistory();

    function onSubmit() {
        const signedJWT = getSignedJWT({}, partnerID, partnerSecret);
    
        waymarkInstance.createAccount(signedJWT);
    
        history.push("/templates");
    
        const account = waymarkInstance.getAccountInfo();
        setAccount(account);
    };

    return (
        <button 
            className="submit-button"
            onClick={() => onSubmit()}
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
