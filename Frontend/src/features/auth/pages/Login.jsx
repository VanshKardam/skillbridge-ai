import React, { useState } from 'react'
import { Link } from 'react-router'
import "../auth.form.scss";
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

function Login() {
    const navigate = useNavigate()
    const { loading, handleLogin} = useAuth()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        handleLogin(formData)
        navigate("/")
    }

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
    return (
        <main className="split-layout">
            <div className="login-left">
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                
                <div className="left-content">
                    <h1 className="hero-heading">Welcome to SkillBridge-AI</h1>
                    <p className="hero-subtext">Bridging the gap between your Skills and your dream job. Instantly match your resume with top opportunities.</p>
                </div>
            </div>

            <div className="login-right">
                <div className="form-container glass-card">
                    <div className="form-header">
                        <h2>Login to your Account</h2>
                        <p>Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
                        </div>
                        
                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" name="remember" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>

                        <button className="button primary-button" type="submit">Sign In</button>
                        
                        <div className="divider">
                            <span>or</span>
                        </div>

                        <div className="social-login">
                            <button className="button social-button" type="button">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                                    <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.11H2.17V16.96C3.99 20.58 7.7 23 12 23Z" fill="#34A853"/>
                                    <path d="M5.84 14.11C5.62 13.45 5.49 12.74 5.49 12C5.49 11.26 5.62 10.55 5.84 9.89V7.04H2.17C1.42 8.53 1 10.21 1 12C1 13.79 1.42 15.47 2.17 16.96L5.84 14.11Z" fill="#FBBC05"/>
                                    <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.38 3.84C17.46 2.05 14.97 1 12 1C7.7 1 3.99 3.42 2.17 7.04L5.84 9.89C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
                                </svg>
                                Sign in with Google
                            </button>
                            <button className="button social-button" type="button">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                Sign in with LinkedIn
                            </button>
                        </div>
                    </form>

                    <p className="register-link">Don't have an account? <Link to="/register">Create one now</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Login