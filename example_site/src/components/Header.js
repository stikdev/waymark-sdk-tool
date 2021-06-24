import React from 'react'
import "./Header.css"

/**
 * Renders a title and subtitle, intended to be used as a Header
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
