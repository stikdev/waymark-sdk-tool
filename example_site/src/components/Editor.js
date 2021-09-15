import React from 'react'
import Header from "./Header.js";
import classnames from "classnames";
import AdPortalHeader from './AdPortalHeader.js';
import { useAppContext } from "./AppProvider";

/**
 * Renders the Waymark Editor page of the SDK Demo site.
 */
function Editor({isAdPortalFlow}) {
    const {
        embedRef,
        isEditorOpen,
    } = useAppContext();
    
    const embedClasses = classnames({
        visible: isEditorOpen,
    });

    return (
        <>
            {isEditorOpen && isAdPortalFlow ? <AdPortalHeader/> : null}
            <div
                id="waymark-embed-container"
                className={embedClasses}
                ref={embedRef}
            >
                {isAdPortalFlow ? null : 
                    <Header 
                        title="Editor"
                        subtitle="Open the Waymark editor with a single call. Easily
                        customize with your colors, fonts, and other styles."
                        isAdPortalFlow={false}
                    /> 
                }
                
            </div>
        </>
    )
}

export default Editor;
