import Header from "./Header.js";

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
        <button className="submit-button">
            Select Your Template
        </button>
    </div>
  );
}
