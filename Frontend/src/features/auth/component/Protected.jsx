import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({ children}) => {
    const {loading, user} = useAuth()
    if(loading) {
        return (
            <div className="global-loading-screen">
                <div className="spinner"></div>
                <h2>Loading...</h2>
                <p>Please wait while we verify your session</p>
            </div>
        )
    }
    if(!user) {
        return <Navigate to={"/login"} />
    }
    return children
}

export default Protected;