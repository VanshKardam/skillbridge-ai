const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apikey: process.env.GEMINI_API_KEY
});

const interviewReportSchema = z.object({
    jobDescription : z.string().describe("Job description for which the interview is being prepared for."),
    resumeText : z.string().describe("Resume text of the candidate."),
    selfDescription : z.string().describe("Self description of the candidate."),
    matchScore : z.number().describe("Match score between the resume and the job description on a scale of 0 to 100"),
    technicalQuestions : z.array(z.object({
        question : z.string().describe("Technical question to be asked to the candidate in the interview."),
        intention : z.string().describe("Intention of the interviewer behind asking this question."),
        answer : z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
        confidence : z.number().describe("Confidence of the candidate in the answer."),
        improvement : z.string().describe("Area of improvement for the candidate.")
    })).describe("Technical questions that can be asked in the interview along with their interntion and how to answer them, confidence level and area of improvement"),
    behavioralQuestions : z.array(z.object({
        question : z.string().describe("Behavioral question to be asked to the candidate in the interview."),
        intention : z.string().describe("Intention of the interviewer behind asking this question."),
        answer : z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
        confidence : z.number().describe("Confidence of the candidate in the answer."),
        improvement : z.string().describe("Area of improvement for the candidate.")
    })).describe("Behavioral questions that can be asked in the interview along with their interntion and how to answer them, confidence level and area of improvement"),
    skillGaps : z.array(z.object({
        skill : z.string().describe("The skill which the candidate is lacking"),
        severity : z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e., if it is low, then it is not very important to learn it, if it is medium then it is important to learn it, if it is high then it is very important to learn it.")
    })).describe("List of skills gaps in the resume and their severity level, low, medium or high"),
    preparationPlan : z.array(z.object({
        day : z.number().describe("Day number for which the preparation is to be done."),
        focus : z.string().describe("Area of focus for the day."),
        topic : z.string().describe("Topic to be covered on the day."),
        tasks : z.array(z.string()).describe("List of tasks to be done on the day.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title : z.string().describe("Title of the interview report, based on the job title and the candidate's experience")
});

async function generateInterviewReport({resume, selfDescription, jobDescription}) {
    const prompt = `Generate an interview report for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    You MUST return the output as a valid JSON object that strictly adheres to this exact structure. Do not add any extra keys, and do not miss any keys:
    {
      "title": "string",
      "jobDescription": "string",
      "resumeText": "string",
      "selfDescription": "string",
      "matchScore": 0,
      "technicalQuestions": [
        { "question": "string", "intention": "string", "answer": "string", "confidence": 0, "improvement": "string" }
      ],
      "behavioralQuestions": [
        { "question": "string", "intention": "string", "answer": "string", "confidence": 0, "improvement": "string" }
      ],
      "skillGaps": [
        { "skill": "string", "severity": "low|medium|high" }
      ],
      "preparationPlan": [
        { "day": 1, "focus": "string", "topic": "string", "tasks": ["string"] }
      ]
    }
    `
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        const interviewReport = interviewReportSchema.parse(JSON.parse(response.text));
        return interviewReport;
    } catch (error) {
        console.log("Error generating report:", error)
    }
}

async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, {waitUntil: "networkidle0"})
    const pdfBuffer = await page.pdf({format: "A4", printBackground: true, margin: {top: "20mm", bottom: "20mm", left: "15mm", right: "15mm"}})
    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({resume, selfDescription,jobDescription}){
    
    const resumePdfSchema = z.object({
        html: z.string().describe("Html content of the resume."),
        css: z.string().describe("Css content of the resume."),
    });

    const resumeHtmlCssSchema = z.object({
        resumeHtml: z.string().describe("Html content of the resume."),
        resumeCss: z.string().describe("Css content of the resume.")
    });

    const prompt = `Generate a html and css for a resume for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    You MUST return the output as a valid JSON object that strictly adheres to this exact structure. Do not add any extra keys, and do not miss any keys:
    {
      "resumeHtml": "string",
      "resumeCss": "string"
    }
    
    The resume should be tailorded for the given job description, highlighting the relevant skills and experiences.
    The resume should be in html and css format.
    The content of resume should not sound like it's generated by AI and should be as close as possible to a real human-written resume.
    You can highlight the content using some colors or other formatting techniques but the overall design should be simple and professional.
    The content should be ATS friendly, i.e. it should be easily parsable by Applicant Tracking Systems without losing important information.
    Do not use any kind of emojis, images or frames.
    Do not use any kind of inline styles or scripts.
    The resume should not be so lengthy, it should ideally be one page long, but not more than two pages. Focus on quality rather than quantity. Only add the most relevant and important information.Use clean and modern typography. You can use one or two accent colors if needed but the overall design should be clean and professional.
    Use appropriate HTML tags and ARIA attributes to ensure proper semantic structure and accessibility. This helps screen readers and other assistive technologies interpret the content correctly.
    `
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumeHtmlCssSchema)
            }
        });
        const jsonContent = JSON.parse(response.text)
        
        const html = jsonContent.resumeHtml || "";
        const css = jsonContent.resumeCss || "";
        
        const fullHtmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    ${css}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;
        
        const pdfBuffer = await generatePdfFromHtml(fullHtmlContent)
        return pdfBuffer
    } catch (error) {
        console.log("Error generating resume pdf:", error)
    }
}

module.exports = { generateInterviewReport, generateResumePdf }