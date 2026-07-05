import React, { useState, useRef } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeinputRef = useRef(null)
    const navigate = useNavigate()

    const handleGenerateReport = async() => {
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
            <div className="loading-container">
                <div className="spinner"></div>
                <p className='loading-text'>Generating Interview Report...</p>
            </div>
        )
    }

    return (
        <main className='home'>
            <div className="left">
                <textarea onChange={(e) => {
                        setJobDescription(e.target.value)
                    }} name="jobDescription" id="jobDescription" placeholder="Enter job description here..."></textarea>
            </div>
            <div className="right">
                <div className="input-group">   
                    <label htmlFor="resume">Upload Resume</label>
                    <input ref={resumeinputRef} type="file" name="resume" id="resume" accept=".pdf" />
                </div>
                <div className="input-group">
                    <label htmlFor="selfDescription">Self Description</label>
                    <textarea onChange={(e) => {
                        setSelfDescription(e.target.value)
                    }} name="selfDescription" id="selfDescription" placeholder="Describe yourself in a few sentences..."></textarea>
                </div>
                <button onClick={handleGenerateReport} className='generate-btn'>Generate Interview Report</button>
            </div>
            
            <div className="reports-section">
                <h2>Recent Reports</h2>
                <div className="reports-grid">
                    {reports && reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report._id} className="report-card" onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Interview Report'}</h3>
                                <p><strong>Role:</strong> {report.jobDescription ? report.jobDescription.substring(0, 60) + '...' : 'N/A'}</p>
                                <span className="date">{new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-reports">No recent reports found.</p>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Home;