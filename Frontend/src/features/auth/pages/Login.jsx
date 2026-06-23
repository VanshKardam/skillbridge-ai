import React from 'react'
import { Link } from 'react-router'

function Login() {
    return (
        <main>
            <div className="form-container">
                <h1>Login to your Account</h1>
                <form action="">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Enter email address" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter password" />
                    </div>
                    <button className="button primary-button" type="submit">Login</button>
                </form>
            </div>
        </main>
    )
}

export default Login