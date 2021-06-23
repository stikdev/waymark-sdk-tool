import React from 'react'
import "./Header.css"

/**
 * Creates a Header reusable component
 * 
 * @param {string} title Title of header
 * @param {string} subtitle Subtitle of header 
 */

function Header({title, subtitle}) {
    return (
        <>
            <div className='title'>{title}</div>
            <div className='subtitle'>{subtitle}</div>
        </>
    )
}

export default Header;
