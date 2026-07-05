import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf} from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context.jsx"
import { useParams } from "react-router"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const {interviewId} = useParams()
    
    if(!context) {
        throw new Error("useInterview must be used within InterviewProvider")
    }
    const {loading, setLoading, report, setReport, reports, setReports, error, setError} = context

    const generateReport = async ({jobDescription, selfDescription, resumeFile}) => {
        setLoading(true)
        let response = null
        setError(null)
        try {
            response = await generateInterviewReport({jobDescription, selfDescription, resumeFile})
            setReport(response.data)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }

        return response?.data || null
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        setError(null)
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.data)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
        return response?.data || null
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        setError(null)
        try {
            response = await getAllInterviewReports()
            setReports(response.data)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
        return response?.data || []
    }

    /**
     * @description Hook to download resume pdf for a user on the basis of user self description, resume and job description.
     */

    const downloadResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        setError(null)
        try {
            response = await generateResumePdf(interviewReportId)
            const url = URL.createObjectURL(response)
            const link = document.createElement("a")
            link.href = url
            link.download = `resume-${interviewReportId}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            setError(error)
            return false
        } finally {
            setLoading(false)
        }
        return true
    }

    useEffect(() => {
        if(interviewId) {
            getReportById(interviewId)
        }
        else {
            getReports()
        }
    }, [interviewId])
    return {
        loading,
        error,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        downloadResumePdf
    }
}