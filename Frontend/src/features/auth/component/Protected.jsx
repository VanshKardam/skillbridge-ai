import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({ children}) => {
    const {loading, user} = useAuth()
    if(loading) {
        return (
            <main className="split-layout" style={{ justifyContent: 'center', alignItems: 'center', background: '#0b0f19' }}>
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                <div style={{ zIndex: 1, color: 'white', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, #06B6D4, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0px 4px 15px rgba(6, 182, 212, 0.4))' }}>Authenticating...</h2>
                    <p style={{ color: '#cbd5e1', marginTop: '1rem', fontSize: '1.1rem' }}>Please wait while we log you in</p>
                </div>
            </main>
        )
    }
    if(!user) {
        return <Navigate to={"/login"} />
    }
    return children
}

export default Protected;