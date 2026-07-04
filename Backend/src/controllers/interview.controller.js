const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */

async function generateInterViewReportController(req, res) {
    const resumeFile = req.file

    const resumeContent = await pdfParse(req.file.buffer)
    const { selfDescription, jobDescription } = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription: selfDescription,
        jobDescription: jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user : req.user.id,
        resumeText : resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })
    
    return res.status(201).json({
        success: true,
        message: "Interview report generated successfully",
        data: interviewReport
    })
}

/**
 * @description Controller to get interview report by InterviewId.
 */

async function getInterviewReportbyIdController(req, res) {

    const { interviewid } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewid, user: req.user.id })

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

module.exports = { generateInterViewReportController, getInterviewReportbyIdController, getAllInterviewReportsController }