import React from 'react'
import Header from "./Header.js";
import classnames from "classnames";
import { useAppContext } from "./AppProvider";

/**
 * Renders the Waymark Editor page of the SDK Demo site.
 */
function Editor() {
    const {
        embedRef,
        waymarkInstance,
        isEditorOpen,
    } = useAppContext();
    
    const embedClasses = classnames({
        embedded: waymarkInstance,
        visible: isEditorOpen,
    });

    return (
        <div
            id="waymark-embed-container"
            className={embedClasses}
            ref={embedRef}
        >
            <Header 
                title="Editor"
                subtitle="Open the Waymark editor with a single call. Easily
                customize with your colors, fonts, and other styles."
            /> 
        </div>
    )
}

export default Editor;
