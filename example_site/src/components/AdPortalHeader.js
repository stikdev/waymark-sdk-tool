import React from 'react'
import "./AdPortalHeader.css"

/**
 * Renders the Header for the Ad Portal Flow. 
 */
function AdPortalHeader({isConfirmationPage}) {
    return (
        <div className='adportal-header poppins'>
            <div className='header-text'>
                company abc ad portal
            </div>
            <div className='rectangle-one'/>
            <div className='circle-one'>
                <div className='flow-step-number'>
                    1
                </div>
                <div className='flow-step-name'>
                    audience
                </div>
            </div>
            
            <div className='rectangle-two'/>
            <div className='circle-two'>
                <div className='flow-step-number'>
                    2
                </div>
                <div className='flow-step-name'>
                    commercial
                </div>
            </div>
            
            <div 
                className='rectangle-three'
                style={{ left: isConfirmationPage ? '30%' : '75%' }}
            />
            <div 
                className='circle-three'
                style={{ left: isConfirmationPage ? '32%' : '77%' }}
            >
                <div className='flow-step-number'>
                    3
                </div>
                <div className='flow-step-name'>
                    publish
                </div>
            </div>
        </div>
    )
}

export default AdPortalHeader;
