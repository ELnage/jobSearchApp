import { ErrorHandel } from "../../utils/error-class.utils.js";

import Job from "./../../../DB/models/job.model.js";
import Company from "./../../../DB/models/company.model.js";
import Application from "./../../../DB/models/application.model.js";





import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from "uuid";


/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {msg , job}
 * @description this function add new job
 */
export const addJob = async (req , res , next) => {
  // destructure user id from auth user
  const { _id } = req.authUser;
  // destructure job data from body
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  // create new job
  const newJob = {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: _id,
  };
  const job = await Job.create(newJob);
  res.status(200).json({ msg: "job created", job });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {msg , updatedJob}
 * @description this function update job
 */
export const updateJob = async (req , res , next) => {
  // destructure job id from params
  const { jobId } = req.params;
  // destructure job data from body
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  //create job object
  const job = {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  };
  //update job in DB
  const updatedJob = await Job.findByIdAndUpdate(jobId, job, {
    new: true,
  });
  res.status(200).json({ msg: "job updated", updatedJob });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {msg , deletedJob}
 * @description this function delete job and all related applications
 */
export const deleteJob = async (req , res , next) => {
  // destructure job id from params
  const { jobId } = req.params;
  // delete job from DB
  const deletedJob = await Job.findByIdAndDelete(jobId);

  // check if job exists and return error if not
  if (!deletedJob) return next(new ErrorHandel("job not found", 404));
  const { _id } = deletedJob;
  // delete all related applications
  const deletedApplicationRelated = await Application.deleteMany({jobId : _id})
  res
    .status(200)
    .json({ msg: "job deleted", deletedJob, deletedApplicationRelated });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next
 * @returns message {msg , jobs}
 * @description this function get all jobs with company information 
 */
export const getAllJobs = async (req , res , next) => {
  const jobs = await Job.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "addedBy",
        foreignField: "companyHR",
        as: "company information",
      },
    },
  ]);
  res.status(200).json({ count: jobs.length, msg: "all jobs", jobs });
}
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message { count , msg , jobs} 
 */
export const getCompanyJobs = async (req , res , next) => {
  // destructure company name from query
  const { companyName } = req.query;

  // check if company exists and return error if not
  const company = await Company.findOne({ companyName });
  if(!company) return next(new ErrorHandel("company not found", 404));
  // destructure company HR from company
  const { companyHR } = company;

  // get all jobs related to company HR
  const jobs = await Job.find({ addedBy: companyHR });
  res.status(200).json({ count: jobs.length, msg: "all jobs", jobs });
}
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message { count , msg , jobs}
 * @description this function filter jobs depending on workingTime , jobLocation , seniorityLevel , jobTitle,technicalSkills
 */
export const filterJobs = async (req , res , next) => {
  // destructure query from query
  const {workingTime , jobLocation , seniorityLevel , jobTitle,technicalSkills} = req.query
  // create query object
  const query = {}
  // add querys to query object
  if(workingTime) query.workingTime = workingTime
  if(jobLocation) query.jobLocation = jobLocation
  if(seniorityLevel) query.seniorityLevel = seniorityLevel
  // add query job title to query object and make it case insensitive
  if(jobTitle) query.jobTitle = { $regex: jobTitle, $options: "i" };
  if(technicalSkills) {
    // split technical skills to array and add it to query object
    const technicalSkillsArray = technicalSkills.split(",")
    query.technicalSkills = { $in: technicalSkillsArray };
  }
  // check if query is not empty and return error if its empty
  if(Object.keys(query).length === 0) return next(new ErrorHandel("query is empty", 400))
  const jobs = await Job.find(query)
  res.status(200).json({ count: jobs.length, msg: "all jobs", jobs });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns msg {msg , application}
 * @description this function apply to job
 */



export const applyToJob = async (req , res , next) => {
  // cloidinary config
  cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
  });

  // multer config with cloudinary
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "usersResumes",
      format: async (req, file) => "pdf",
      public_id: (req, file) =>
        file.originalname + "-" + Date.now() + "-" + uuidv4(),
    },
  });
  // accept only pdf files
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  };
  const upload = multer({ storage, fileFilter: fileFilter }).single(
    "userResume"
  );

  upload(req, res, async(err) => {
    if (err) {
      return res.status(500).json({ msg: err.message , error: "Failed to upload file " });
    }
    // destructure application data
    const { _id } = req.authUser;
    const { jobId, userTechSkills, userSoftSkills } = req.body;

    // check if job exists and return error if not
    const jobExist = await Job.findById(jobId);
    if (!jobExist) return next(new ErrorHandel("job not found", 404));
    //create new application
  const newApplication = {
    jobId,
    user: _id,
    userTechSkills : userTechSkills.split(","),
    userSoftSkills : userSoftSkills.split(","),
    userResume : req.file?.path
  };
  const application = await Application.create(newApplication);
    res.status(200).json({ msg: "job applied successfully" ,application });
  });
}