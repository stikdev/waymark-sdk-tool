import React from 'react'
import "./Header.css"

/**
 * Renders a title and subtitle, intended to be used as a Header
 * 
 * @param {string} title Title of header
 * @param {string} subtitle Subtitle of header 
 */
function Header({title, subtitle, isAdPortalFlow}) {
    return (
        <div 
            className='header-container'
            style={{textAlign: isAdPortalFlow ? 'left' : 'center'}}
        >
            <div className='title'>{title}</div>
            <div 
                className='subtitle'
                style={{width: isAdPortalFlow ? '80%' : '60%'}}
            >
                {subtitle}
            </div>
        </div>
    )
}

export default Header;
