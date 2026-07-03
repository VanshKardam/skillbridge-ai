const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

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

module.exports = { generateInterViewReportController }