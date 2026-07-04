const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

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

module.exports = { generateInterviewReport }