import React, { useState, useRef } from 'react'
import '../../auth/auth.form.scss'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeinputRef = useRef(null)
    const navigate = useNavigate()

    const handleGenerateReport = async(e) => {
        e.preventDefault()
        const resumeFile = resumeinputRef.current.files[0]
        const data = await generateReport({jobDescription, selfDescription, resumeFile})
        
        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        } else if (data && data.status === "success") {
            navigate(`/interview/${data._id}`)
        }
    }

    if(loading) {
        return (
            <div className="global-loading-screen">
                <div className="spinner"></div>
                <h2>Generating Report...</h2>
                <p>Please wait while we analyze your resume</p>
            </div>
        )
    }

    return (
        <main className="split-layout home-layout">
            <div className="login-right">
                <div className="hero-card">
                    <div className="hero-bg-gradient"></div>
                    <div className="hero-bg-line"></div>
                    
                    <div className="hero-content">
                        <div className="brand-name">SkillBridge-AI</div>
                        <h1>Interview Prep Dashboard</h1>
                        <p>Generate highly personalized interview preparation reports by matching your resume against a target job description.</p>
                    </div>

                    <div className="floating-card reports-floating-card">
                        <h3>Recent Reports</h3>
                        {reports && reports.length > 0 ? (
                            <div className="reports-list">
                                {reports.map((report) => (
                                    <div key={report._id} className="report-item" onClick={() => navigate(`/interview/${report._id}`)}>
                                        <div className="report-info">
                                            <h4>{report.title || 'Interview Report'}</h4>
                                            <span className="date">{new Date(report.createdAt).toLocaleDateString('en-GB')}</span>
                                        </div>
                                        <div className="report-arrow">→</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-reports">No recent reports found. Generate one to get started!</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="login-left">
                <div className="form-container">
                    <div className="form-header">
                        <h2>Generate New Report</h2>
                    </div>

                    <form onSubmit={handleGenerateReport}>
                        <div className="input-group">
                            <label htmlFor="jobDescription">Job Description</label>
                            <div className="input-wrapper">
                                <textarea 
                                    className="home-textarea"
                                    onChange={(e) => setJobDescription(e.target.value)} 
                                    name="jobDescription" 
                                    id="jobDescription" 
                                    placeholder="Paste the full job description here..."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="selfDescription">Self Description</label>
                            <div className="input-wrapper">
                                <textarea 
                                    className="home-textarea small"
                                    onChange={(e) => setSelfDescription(e.target.value)} 
                                    name="selfDescription" 
                                    id="selfDescription" 
                                    placeholder="Briefly describe your current role or goals..."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="resume">Upload Resume (.pdf)</label>
                            <div className="input-wrapper">
                                <input 
                                    className="home-file-input"
                                    ref={resumeinputRef} 
                                    type="file" 
                                    name="resume" 
                                    id="resume" 
                                    accept=".pdf" 
                                    required
                                />
                            </div>
                        </div>

                        <button className="button primary-button" type="submit" style={{ marginTop: '1.5rem' }}>
                            Generate Interview Report
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Home;