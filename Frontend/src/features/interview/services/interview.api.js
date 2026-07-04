import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})


/**
 * @description Generate interview report based on user self description, resume and job description.
 */

export const generateInterviewReport = async ({jobDescription, selfDescription, resumeFile}) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resumeFile", resumeFile)

    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    if(response?.data){
        return response.data;
    }
    throw new Error("Failed to generate interview report")
}

/**
 * @description Get interview report by InterviewId.
 */

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}`)
    if(response?.data){
        return response.data;
    }
    throw new Error("Failed to get interview report")
}

/**
 * @description Get all interview reports of a user.
 */

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/user/all")
    if(response?.data){
        return response.data;
    }
    throw new Error("Failed to get all interview reports")
}