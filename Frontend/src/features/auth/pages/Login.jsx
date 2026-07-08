import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import "../auth.form.scss";
import { useAuth } from '../hooks/useAuth'
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    const navigate = useNavigate()
    const { loading, handleLogin, handleGoogleLogin } = useAuth()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await handleLogin(formData)
        if (result.success) {
            navigate("/")
        } else {
            alert("Login failed: " + result.message)
        }
    }

    if (loading) {
        return (
            <div className="global-loading-screen">
                <div className="spinner"></div>
                <h2>Authenticating...</h2>
                <p>Please wait while we log you in</p>
            </div>
        )
    }

    return (
        <main className="split-layout">
            <div className="login-left">
                <div className="form-container">

                    <div className="form-header">
                        <h2>Sign in</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <input type="email" id="email" name="email" placeholder="johndoe@gmail.com" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••" value={formData.password} onChange={handleChange} required />
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
                        
                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" name="remember" />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <button className="button primary-button" type="submit">Sign in</button>
                        <button 
                            className="button primary-button" 
                            type="button" 
                            onClick={async () => {
                                const guestData = { email: "user@gmail.com", password: "password" };
                                setFormData(guestData);
                                const result = await handleLogin(guestData);
                                if (result.success) {
                                    navigate("/");
                                } else {
                                    alert("Guest account not found! Please register user@gmail.com once to create it.");
                                }
                            }}
                            style={{marginTop: '10px'}}
                        >
                            Login as Guest
                        </button>
                    </form>

                    <div className="links-container">
                        <span>Don't have an account? <Link to="/register">Sign up</Link></span>
                        <a href="#">Forgot Password</a>
                    </div>

                    <div className="google-auth-container">
                        <div className="divider"><span>Or continue with</span></div>
    
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    const result = await handleGoogleLogin(credentialResponse.credential);
                                    if (result.success) {
                                        navigate("/");
                                    } else {
                                        alert("Google Login failed: " + result.message);
                                    }
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="login-right">
                <div className="hero-card">
                    <div className="hero-bg-gradient"></div>
                    <div className="hero-bg-line"></div>
                    
                    <div className="hero-content">
                        <div className="brand-name">SkillBridge-AI</div>
                        <h1>Welcome to SkillBridge</h1>
                        <p>SkillBridge helps developers build organized and well-coded resumes full of beautiful and rich modules. Join us and start building your career today.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login