const { PDFParse } = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */

async function generateInterViewReportController(req, res) {
    const resumeFile = req.file
    if (!resumeFile) {
        return res.status(400).json({ success: false, message: "Resume PDF is required" })
    }

    try {
        const parser = new PDFParse({ data: req.file.buffer })
        const parsedResult = await parser.getText()
        const resumeContentText = parsedResult.text
        const { selfDescription, jobDescription } = req.body

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContentText,
            selfDescription: selfDescription,
            jobDescription: jobDescription
        })

        if (!interviewReportByAi) {
            return res.status(500).json({ success: false, message: "AI failed to generate report. Check backend console for AI service errors." })
        }

        const interviewReport = await interviewReportModel.create({
            user : req.user.id,
            resumeText : resumeContentText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })
        
        return res.status(201).json({
            success: true,
            message: "Interview report generated successfully",
            data: interviewReport
        })
    } catch (error) {
        console.error("Controller Error:", error)
        return res.status(500).json({ success: false, message: error.message, stack: error.stack })
    }
}

/**
 * @description Controller to get interview report by InterviewId.
 */

async function getInterviewReportbyIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if(!interviewReport) {
        return res.status(404).json({
            success: false,
            message: "Interview report not found"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Interview report fetched successfully",
        data: interviewReport
    })
}

/**
 * @description Controller to get all interview reports of a user.
 */

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    return res.status(200).json({
        success: true,
        message: "Interview reports fetched successfully",
        data: interviewReports
    })
}

/**
 * @description Controller to generate resume pdf based on user self description, resume and job description.
 */

async function generateResumePdfController(req, res) {
    
    const { interviewReportId } = req.params

    if(!interviewReportId) {
        return res.status(400).json({ success: false, message: "Interview report id is required" })
    }

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport) {
        return res.status(404).json({
            success: false,
            message: "Interview report not found"
        })
    }

    const { resumeText, jobDescription, selfDescription } = interviewReport; 

    const pdfBuffer = await generateResumePdf({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    if(!pdfBuffer) {
        return res.status(500).json({ success: false, message: "Failed to generate resume pdf" })
    }

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume-${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportbyIdController, getAllInterviewReportsController, generateResumePdfController }