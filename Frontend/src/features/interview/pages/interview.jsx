import React, { useState, useEffect } from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'



const Interview = () => {
    const [activeTab, setActiveTab] = useState('technical');
    const { report, getReportById, loading, downloadResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if(interviewId){
            getReportById(interviewId)
        }
    }, [interviewId])

    if(loading) {
        return <div>Loading...</div>
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
                                <span className="confidence">Confidence: {q.confidence}/5</span>
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
                                <span className="confidence">Confidence: {q.confidence}/5</span>
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
    };

    return (
        <div className="interview-layout">
            <div className="sidebar-left">
                <ul>
                    <li 
                        className={activeTab === 'technical' ? 'active' : ''} 
                        onClick={() => setActiveTab('technical')}
                    >
                        Technical questions
                    </li>
                    <li 
                        className={activeTab === 'behavioral' ? 'active' : ''} 
                        onClick={() => setActiveTab('behavioral')}
                    >
                        Behavioral questions
                    </li>
                    <li 
                        className={activeTab === 'roadmap' ? 'active' : ''} 
                        onClick={() => setActiveTab('roadmap')}
                    >
                        Road Map
                    </li>
                </ul>
            </div>
            
            <div className="main-content">
                {renderMainContent()}
            </div>
            
            <div className="sidebar-right">
                <div className="skill-gaps">
                    <h3>Skill Gaps</h3>
                    <div className="pill-container">
                        {report.skillGaps.map((gap, index) => (
                            <span key={index} className={`pill severity-${gap.severity}`}>
                                {gap.skill} <span className="severity-badge">{gap.severity}</span>
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="match-score">
                    <h3>Match Score</h3>
                    <div className="score-circle">
                        <span>{report.matchScore}%</span>
                    </div>
                </div>

                <div className="download-section">
                    <button 
                        className="download-btn" 
                        onClick={() => downloadResumePdf(interviewId)}
                    >
                        Download ATS Resume
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Interview;
