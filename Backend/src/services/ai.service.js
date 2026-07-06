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
        confidence : z.number().describe("Confidence of the candidate in the answer. MUST BE AN INTEGER BETWEEN 1 AND 5."),
        improvement : z.string().describe("Area of improvement for the candidate.")
    })).describe("Technical questions that can be asked in the interview along with their interntion and how to answer them, confidence level and area of improvement"),
    behavioralQuestions : z.array(z.object({
        question : z.string().describe("Behavioral question to be asked to the candidate in the interview."),
        intention : z.string().describe("Intention of the interviewer behind asking this question."),
        answer : z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
        confidence : z.number().describe("Confidence of the candidate in the answer. MUST BE AN INTEGER BETWEEN 1 AND 5."),
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

    const prompt = `Generate an HTML and CSS for a highly professional, ATS-optimized 1-page resume tailored to the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    You MUST return the output as a valid JSON object adhering to this exact structure:
    {
      "resumeHtml": "string",
      "resumeCss": "string"
    }

    CRITICAL PROFESSIONAL RESUME RULES (MIMIC IVY LEAGUE / TOP TECH TEMPLATE):
    1. STRUCTURE & ATS COMPLIANCE: 
       - Use clean, semantic HTML. Use <h1> for the candidate's name, <h2> for main section headers (e.g., "EDUCATION", "TECHNICAL SKILLS", "PROJECTS").
       - Do NOT use tables or complex grids.
    2. CONTENT EXCELLENCE: 
       - EXACT DETAILS: You MUST extract and use the exact Candidate Name, Contact Info (email, phone, links), Education, and past job titles from the provided 'Resume'. DO NOT invent a fake name like 'John Doe'.
       - Tailor the bullet points strictly to the provided Job Description. Use strong action verbs.
       - The resume MUST fit on ONE PAGE. Pack information densely and write concise bullet points.
    3. DESIGN & CSS AESTHETICS (CRITICAL):
       - FONT: Use a classic serif font for the entire document (e.g., font-family: "Times New Roman", Times, serif). Font size should be small (10pt - 11pt) to fit everything on one page. Line height should be extremely tight (1.2).
       - MARGINS & SPACING: Ensure the CSS relies on very small margins (e.g., margin: 0; padding: 0 for paragraphs). 
       - HEADER: The name (<h1>) should be centered, UPPERCASE, bold, and large. Contact info below it should be centered, separated by pipes (|). Links (email, LinkedIn, GitHub) MUST be colored blue (color: #0000ee; text-decoration: none;).
       - SECTION HEADERS (<h2>): Must be UPPERCASE, left-aligned, bold, with a solid black bottom border (border-bottom: 1px solid #000). Space below the header should be minimal (e.g., margin-bottom: 4px).
       - TECHNICAL SKILLS: Do NOT use a bulleted list that takes up vertical space. Instead, use a dense, inline format. Example: <div><strong>Languages:</strong> C, C++, JavaScript</div>.
       - EXPERIENCE & PROJECTS: Use a flex layout to align the Title/Role on the left (bold) and the Date on the right. Subtitles (like technologies used) should be directly below or next to it in italics.
       - BULLET POINTS: Make bullet points tight (margin-top: 2px; margin-bottom: 2px; padding-left: 20px).
    4. PREVENT PDF RENDERING BUGS:
       - Do NOT use 'height: 100vh', 'overflow: hidden', or absolute positioning.
    `;
    try {
        let response;
        try {
            response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(resumeHtmlCssSchema)
                }
            });
        } catch (geminiError) {
            if (geminiError.status === 503) {
                console.log("gemini-2.5-flash 503 unavailable, falling back to gemini-1.5-flash...");
                response = await ai.models.generateContent({
                    model: "gemini-1.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(resumeHtmlCssSchema)
                    }
                });
            } else {
                throw geminiError;
            }
        }
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