import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import "../auth.form.scss";
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await handleRegister({ username, email, password })
        if (result.success) {
            navigate("/")
        } else {
            alert("Registration failed: " + result.message)
        }
    }

    if (loading) {
        return (
            <div className="global-loading-screen">
                <div className="spinner"></div>
                <h2>Creating Account...</h2>
                <p>Please wait while we register you</p>
            </div>
        )
    }

    return (
        <main className="split-layout">
            <div className="login-left">
                <div className="form-container">

                    <div className="form-header">
                        <h2>Sign up</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                <input onChange={(e) => { setUsername(e.target.value) }} type="text" id="username" name="username" placeholder="johndoe" required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <input onChange={(e) => { setEmail(e.target.value) }} type="email" id="email" name="email" placeholder="johndoe@gmail.com" required />
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                <input onChange={(e) => { setPassword(e.target.value) }} type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••" required />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button className="button primary-button" type="submit">Sign up</button>
                    </form>

                    <div className="links-container">
                        <span>Already have an account? <Link to="/login">Sign in</Link></span>
                    </div>

                    <div className="google-auth-container">
                        <div className="divider">
                            <span>Or continue with</span>
                        </div>
                        <button className="google-btn-mock" type="button">
                            <svg className="google-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                                <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.11H2.17V16.96C3.99 20.58 7.7 23 12 23Z" fill="#34A853"/>
                                <path d="M5.84 14.11C5.62 13.45 5.49 12.74 5.49 12C5.49 11.26 5.62 10.55 5.84 9.89V7.04H2.17C1.42 8.53 1 10.21 1 12C1 13.79 1.42 15.47 2.17 16.96L5.84 14.11Z" fill="#FBBC05"/>
                                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.38 3.84C17.46 2.05 14.97 1 12 1C7.7 1 3.99 3.42 2.17 7.04L5.84 9.89C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
                            </svg>
                            <span className="google-btn-text">Sign up with Google</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="login-right">
                <div className="hero-card">
                    <div className="hero-bg-gradient"></div>
                    <div className="hero-bg-line"></div>
                    
                    <div className="hero-content">
                        <div className="brand-name">SkillBridge-AI</div>
                        <h1>Join SkillBridge Today</h1>
                        <p>Where your skills bridge the gap to your dream career. Create an account and let our AI match you perfectly with real job descriptions.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register