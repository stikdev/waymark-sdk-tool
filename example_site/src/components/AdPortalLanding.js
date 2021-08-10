import Header from "./Header.js";
import { useHistory } from "react-router-dom";
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

    const onSubmit = async () => {
        try {
            const signedJWT = getSignedJWT({}, partnerID, partnerSecret);
            await waymarkInstance.createAccount(signedJWT);
            history.push("/templates");
            const account = await waymarkInstance.getAccountInfo();
            setAccount(account);
        } catch (error) {
            console.error(error);
        }
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
