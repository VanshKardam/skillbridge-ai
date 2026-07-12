import React, { useState, useEffect } from 'react';
import '../../auth/auth.form.scss';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

const Interview = () => {
    const [activeTab, setActiveTab] = useState('technical');
    const { report, getReportById, loading, downloadResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(interviewId){
            getReportById(interviewId)
        }
    }, [interviewId])

    if(loading) {
        return (
            <div className="global-loading-screen">
                <div className="spinner"></div>
                <h2>Loading Report...</h2>
                <p>Please wait while we fetch your interview details</p>
            </div>
        )
    }

    if (!report) {
        return <div>No report found</div>
    } 
    
    const renderMainContent = () => {
        if (activeTab === 'technical') {
            return (
                <div className="content-section">
                    <h2>Technical Questions</h2>
                    {report.technicalQuestions.map((q, index) => (
                        <div key={index} className="question-card">
                            <h4>Q: {q.question}</h4>
                            <p className="intention"><strong>Intention:</strong> {q.intention}</p>
                            <p className="answer"><strong>Candidate Answer:</strong> {q.answer}</p>
                            <div className="feedback">
                                <span className="confidence">
                                    Confidence: {Math.min(Math.max(q.confidence, 1), 5)}/5
                                    <div className="info-tooltip">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                        <div className="tooltip-text">
                                            Based on your resume experience<br/>
                                            <strong>1-2:</strong> Needs study<br/>
                                            <strong>4-5:</strong> Strong area
                                        </div>
                                    </div>
                                </span>
                                <p className="improvement"><strong>Improvement:</strong> {q.improvement}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
        if (activeTab === 'behavioral') {
            return (
                <div className="content-section">
                    <h2>Behavioral Questions</h2>
                    {report.behavioralQuestions.map((q, index) => (
                        <div key={index} className="question-card">
                            <h4>Q: {q.question}</h4>
                            <p className="intention"><strong>Intention:</strong> {q.intention}</p>
                            <p className="answer"><strong>Candidate Answer:</strong> {q.answer}</p>
                            <div className="feedback">
                                <span className="confidence">
                                    Confidence: {Math.min(Math.max(q.confidence, 1), 5)}/5
                                    <div className="info-tooltip">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                        <div className="tooltip-text">
                                            Based on your resume experience<br/>
                                            <strong>1-2:</strong> Needs study<br/>
                                            <strong>4-5:</strong> Strong area
                                        </div>
                                    </div>
                                </span>
                                <p className="improvement"><strong>Improvement:</strong> {q.improvement}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
        if (activeTab === 'roadmap') {
            return (
                <div className="content-section">
                    <h2>Preparation Road Map</h2>
                    {report.preparationPlan.map((plan, index) => (
                        <div key={index} className="question-card roadmap-card">
                            <h4>Day {plan.day}: {plan.focus}</h4>
                            <p className="topic"><strong>Topic:</strong> {plan.topic}</p>
                            <ul>
                                {plan.tasks.map((task, i) => (
                                    <li key={i}>{task}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )
        }
        if (activeTab === 'skills') {
            return (
                <div className="content-section">
                    <h2>Job Skills Analysis</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h4 style={{ color: '#2ecc71', marginBottom: '1rem' }}>Primary Skills (Required)</h4>
                            <div className="pill-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {report.primarySkills?.map((skill, index) => (
                                    <span key={index} className="pill" style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.3)', borderRadius: '20px' }}>{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ color: '#3498db', marginBottom: '1rem' }}>Secondary Skills (Optional/Edge)</h4>
                            <div className="pill-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {report.secondarySkills?.map((skill, index) => (
                                    <span key={index} className="pill" style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid rgba(52, 152, 219, 0.3)', borderRadius: '20px' }}>{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        
        if (activeTab === 'cheatsheet') {
            return (
                <div className="content-section">
                    <h2>Interview Cheat Sheet</h2>
                    {report.cheatSheet && (
                        <div className="question-card roadmap-card" style={{ padding: '1.5rem' }}>
                            <h4 style={{ color: '#6366f1', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Company & Role Summary</h4>
                            <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>{report.cheatSheet.companySummary}</p>
                            
                            <h4 style={{ color: '#2ecc71', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Top Skills to Highlight</h4>
                            <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
                                {report.cheatSheet.topSkillsToHighlight?.map((skill, index) => (
                                    <li key={index} style={{ marginBottom: '0.5rem' }}>{skill}</li>
                                ))}
                            </ul>
                            
                            <h4 style={{ color: '#f39c12', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Questions to Ask the Interviewer</h4>
                            <ul style={{ paddingLeft: '1.5rem' }}>
                                {report.cheatSheet.questionsToAskInterviewer?.map((question, index) => (
                                    <li key={index} style={{ marginBottom: '0.5rem' }}>{question}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )
        }
    };

    const matchScore = report?.matchScore || 0;
    let scoreColor = '#e74c3c'; // red
    let scoreBg = 'rgba(231, 76, 60, 0.1)';
    let scoreShadow = 'rgba(231, 76, 60, 0.2)';

    if (matchScore >= 70) {
        scoreColor = '#2ecc71'; // green
        scoreBg = 'rgba(46, 204, 113, 0.1)';
        scoreShadow = 'rgba(46, 204, 113, 0.2)';
    } else if (matchScore >= 40) {
        scoreColor = '#f39c12'; // yellow
        scoreBg = 'rgba(243, 156, 18, 0.1)';
        scoreShadow = 'rgba(243, 156, 18, 0.2)';
    }

    return (
        <main className="split-layout interview-split-layout">
            <div className="login-right">
                <div className="hero-card">
                    <div className="hero-bg-gradient"></div>
                    <div className="hero-bg-line"></div>
                    
                    <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                        <div className="hero-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '1.5rem', flexShrink: 0 }}>
                            <div className="hero-title-section" style={{ paddingRight: '1rem' }}>
                                <div className="brand-name">SkillBridge-AI</div>
                                <h1 style={{ fontSize: '1.8rem', margin: '0' }}>{report.title || 'Interview Report'}</h1>
                            </div>
                            
                            <div className="match-score-top" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>Match Score</span>
                                <div className="score-circle" style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    backgroundColor: scoreBg, border: `3px solid ${scoreColor}`,
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    boxShadow: `0 0 15px ${scoreShadow}`
                                }}>
                                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: scoreColor }}>{matchScore}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="stats-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, margin: '0', paddingTop: '0', width: '100%' }}>
                            <div className="skill-gaps-header" style={{ marginBottom: '1rem', width: '100%' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0, color: '#e2e8f0', fontSize: '1.05rem', fontWeight: 500 }}>
                                    Identified Skill Gaps
                                    <div className="info-tooltip">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                        <div className="tooltip-text">
                                            <strong>High:</strong> Critical missing skill required for the job<br/>
                                            <strong>Medium:</strong> Moderate gap or partial match that needs attention<br/>
                                            <strong>Low:</strong> Minor gap, nice-to-have, or transferable skill
                                        </div>
                                    </div>
                                </h3>
                            </div>
                            
                            <div className="skill-gaps" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingRight: '0.5rem' }}>
                                
                                <div className="pill-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingBottom: '1rem' }}>
                                    {report.skillGaps.map((gap, index) => (
                                        <span key={index} className={`pill severity-${gap.severity}`} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0.6rem 1rem', boxSizing: 'border-box' }}>
                                            <span className="gap-text" style={{ textAlign: 'left', flex: 1, paddingRight: '1rem', whiteSpace: 'normal', wordBreak: 'break-word' }}>{gap.skill}</span>
                                            <span className="severity-badge" style={{ flexShrink: 0 }}>{gap.severity}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="download-section" style={{ marginTop: 'auto', paddingTop: '1rem', flexShrink: 0 }}>
                                <button 
                                    className="button secondary-button" 
                                    onClick={() => downloadResumePdf(interviewId)}
                                    style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
                                >
                                    Download ATS Resume
                                </button>
                                <button 
                                    className="button primary-button" 
                                    onClick={() => navigate('/')}
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-left">
                <div className="form-container report-content-container">
                    <div className="tabs-header">
                        <ul>
                            <li 
                                className={activeTab === 'technical' ? 'active' : ''} 
                                onClick={() => setActiveTab('technical')}
                            >
                                Technical
                            </li>
                            <li 
                                className={activeTab === 'behavioral' ? 'active' : ''} 
                                onClick={() => setActiveTab('behavioral')}
                            >
                                Behavioral
                            </li>
                            <li 
                                className={activeTab === 'roadmap' ? 'active' : ''} 
                                onClick={() => setActiveTab('roadmap')}
                            >
                                Road Map
                            </li>
                            <li 
                                className={activeTab === 'skills' ? 'active' : ''} 
                                onClick={() => setActiveTab('skills')}
                            >
                                Skills
                            </li>
                            <li 
                                className={activeTab === 'cheatsheet' ? 'active' : ''} 
                                onClick={() => setActiveTab('cheatsheet')}
                            >
                                Cheat Sheet
                            </li>
                        </ul>
                    </div>
                    
                    <div className="main-content">
                        {renderMainContent()}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Interview;
