const mongoose = require('mongoose');

/**
 * - Job description schema : String
 * - Resume text : String
 * - Self description : String
 * 
 * - matchScore : Number
 * 
 * - Technical questions : [{
 *      question : string,
 *      intention : string,
 *      answer : string,
 *      confidence : number,
 *      improvement : string
 * }]
 * - Behavioral questions : [{
 *      question : string,
 *      intention : string,
 *      answer : string,
 *      confidence : number,
 *      improvement : string
 * }]
 * - Skill gaps : [{
 *      skill : "",
 *      severity : {
 *          type : String,
 *          enum : ["low", "medium", "high"] 
 *      }
 * }]
 * - Preparation plan : [{
 *      day : Number,
 *      focus : String,
 *      topic : string,
 *      tasks : [String]
 *      
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type : String,
        required : [ true, "Question is required" ]
    },
    intention : {
        type : String,
        required : [ true, "Intention is required" ]
    },
    answer : {
        type : String,
        required : [ true, "Answer is required" ]
    },
    confidence : {
        type : Number,
        min : [0, "Confidence can not be less than 0"],
        max : [100, "Confidence can not be more than 100"]
    },
    improvement : {
        type : String,
        required : [ true, "Improvement is required" ]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [ true, "Question is required" ]
    },
    intention : {
        type : String,
        required : [ true, "Intention is required" ]
    },
    answer : {
        type : String,
        required : [ true, "Answer is required" ]
    },
    confidence : {
        type : Number,
        min : [0, "Confidence can not be less than 0"],
        max : [100, "Confidence can not be more than 100"]
    },
    improvement : {
        type : String,
        required : [ true, "Improvement is required" ]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill : {
        type : String,
        required : [ true, "Skill is required" ]
    },
    severity : {
        type : String,
        enum : ["low", "medium", "high"],
        required : [ true, "Severity is required" ]
    }
}, {
    _id: false
})

const preparationTaskSchema = new mongoose.Schema({
    day : {
        type : Number,
        required : [ true, "Day is required" ]
    },
    focus : {
        type : String,
        required : [ true, "Focus is required" ]
    },
    topic : {
        type : String,
        required : [ true, "Topic is required" ]
    },
    tasks : {
        type : [String],
        required : [ true, "Tasks are required" ]
    }
}, {
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription : {
        type : String,
        required : [ true, "Job description is requried" ]
    },
    resumeText : {
        type : String
    },
    selfDescription : {
        type : String
    },
    matchScore : {
        type : Number,
        min : [0, "Match score can not be less than 0"],
        max : [100, "Match score can not be more than 100"]
    },
    technicalQuestions : [ technicalQuestionSchema ],
    behavioralQuestions : [ behavioralQuestionSchema ],
    skillGaps : [ skillGapSchema ],
    preparationPlan : [ preparationTaskSchema ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [ true, "User is required" ]
    }
}, {
    timestamps : true
})

module.exports = mongoose.model("InterviewReport", interviewReportSchema);