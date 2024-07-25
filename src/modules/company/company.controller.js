import { compareSync } from "bcrypt";
import Excel from "exceljs"
import { ErrorHandel } from "../../utils/error-class.utils.js";

import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import Application from "../../../DB/models/application.model.js";

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {msg , createdCompany}
 * @description this function create new company
 */
export const addCompany = async ( req , res , next) => {
  // destructure user id from auth user
  const { _id: companyHR } = req.authUser;
  const hrCreateCompany = await Company.findOne({ companyHR });
  if (hrCreateCompany) {
    return next(new ErrorHandel("you already created a company", 409));
  }
  // destructure company data from body
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    
  } = req.body;
  //check if company email or name already exists in DB and return error if it exists
  const iscompanyEmailExist = await Company.findOne({ companyEmail });
  if (iscompanyEmailExist) {
    return next(new ErrorHandel("this email is already exists", 409));
  }
  const iscompanyNameExist = await Company.findOne({ companyName });
  if (iscompanyNameExist) {
    return next(new ErrorHandel("this name is already exists", 409));
  }

  // create new company
  const newCompany = {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR,
  };
  const createdCompany = await Company.create( newCompany );
  res.status(200).json({ msg:"company created", createdCompany });
}
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns  message {msg , updatedCompany}
 * @description this function update company
 */
export const updateCompany = async ( req , res , next) => { 
  // destructure user id from auth user
  const { _id , password: userPassword } = req.authUser;

  // destructure company data from body
  const { companyId, companyName , description , industry , address , numberOfEmployees , companyEmail , password } = req.body;
  // check if password is correct and return error if it is not 
  const isPasswordMatched = compareSync(password, userPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandel("password is wrong", 400));
  }

  // check if company email or name already exists in DB and return error if it exists
  const iscompanyEmailExist = await Company.findOne({ companyEmail });
  if (iscompanyEmailExist) {
    return next(new ErrorHandel("this email is already exists", 409));
  }
  const iscompanyNameExist = await Company.findOne({ companyName  });
  if (iscompanyNameExist) {
    return next(new ErrorHandel("this name is already exists", 409));
  }

  // update company
  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    {
      $set: {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
      },
      $inc: { __v: 1 },
    },
    { new: true }
  );
  res.status(200).json({ msg:"company updated", updatedCompany });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {msg , deletedCompany}
 * @description this function delete company
 */
export const deleteCompany = async ( req , res , next) => {
  // destructure user password from auth user
  const { _id , password : userPassword} = req.authUser;

  // destructure company id and user password  from body
  const { password, companyId } = req.body;

  // check if password is correct and return error if it is not
  const isPasswordMatched = compareSync(password, userPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandel("password is wrong", 400));
  }

  // check if company exists and return error if it does not
  const company = await Company.findById(companyId);
  if (!company) return next(new ErrorHandel("company not found", 404));

  // delete all joss related to this company
  const deletedJobs = await Job.find({ addedBy: _id }).select("_id");
  await Job.deleteMany({ addedBy: _id });
  // delete all applications related to this company
  await Application.deleteMany({ jobId: {$in : deletedJobs} });
  // delete company
  const deletedCompany = await Company.findByIdAndDelete(companyId);
  res.status(200).json({ msg:"company deleted", deletedCompany });
}
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns msg {companyData , companyJobs}
 * @description this function get company data with all its jobs 
 */
export const getCompanyWithJobs = async (req, res, next) => {
  // destructure company id from params
  const { companyId } = req.params;
  // check if company exists and return error if it does not
  const company = await Company.findById(companyId);
  if (!company) return next(new ErrorHandel("company not found", 404));

  // get company jobs with hr id
  const companyJobs = await Job.find({ addedBy: company.companyHR });
  res
    .status(200)
    .json({ companyData: company, companyJobs : { count: companyJobs.length,  jobs: companyJobs} });
};
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns  msg {companyData}
 * @description this function get company data by searching company name
 */
export const getCompanyByName = async (req, res, next) => {
  // destructure company name from query
  const { companyName } = req.query;

  // check if company exists and return error if it does not
  const company = await Company.findOne({ companyName });
  if (!company) return next(new ErrorHandel("company not found", 404));
  res.status(200).json({ companyData: company });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {msg , applications}
 * @description this function get all applications related to company
 */
export const getAllApplications = async (req, res, next)=> {
  // destructure user id from auth user
  const {_id} = req.authUser
  // destructure job id from params
  const {jobId} = req.params

  // check if job exists and return error if it does not
  const job = await Job.findById(jobId)
  if(!job) return next(new ErrorHandel("job not found", 404))
    const {addedBy} = job

  // check if user have permission to view this applications
  if (_id.toString() !== addedBy.toString()) {

    return next(
      new ErrorHandel(
        "you are have no permission to view this applications",
        401
      )
    );
  }
  const applications = await Application.find({jobId}).populate("user")
  res.status(200).json({ count: applications.length, applications });
} 

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns excel file have all applications related to company
 * @description this function get all applications related to company and send it to excel file by using exceljs
 */
export const sendAllApplicationsToExcel = async (req, res, next) => {
  // destructure user id from auth user
  const { _id } =  req.authUser
  // destructure date from query
  const {date} = req.query
  // convert date string to date object
  const dateObject = new Date(date);
// set start and end of the day and add 3 hours for Egypt timezone
  const startOfTheDay = new Date(dateObject.setHours(0, 0, 0, 0));
    startOfTheDay.setHours(startOfTheDay.getHours() + 3);
  const endOfTheDay = new Date(dateObject.setHours(23, 59, 59, 999));
      endOfTheDay.setHours(endOfTheDay.getHours() + 3);

  // get all jobs added by the company hr
  const jobs = await Job.find({addedBy : _id} );
  // create array of jobs id
  const jobsId = jobs.map((job)=>job._id)
  // get all applications related to jobs and date
  const applications = await Application.find({
    jobId: { $in: jobsId },
    createdAt: { $gte: startOfTheDay, $lte: endOfTheDay },
  }).populate([{ path: "user" }, { path: "jobId" }]);
  // use exceljs library to create excel file
  const workbook = new Excel.Workbook();
  // create worksheet and add columns 
  const worksheet = workbook.addWorksheet("Applications");
  worksheet.columns = [
    { header: "Job Title", key: "jobTitle", width: 20 },
    { header: "Job Location", key: "jobLocation", width: 20 },
    { header: "Job Type", key: "jobType", width: 20 },
    { header: "Job Description", key: "jobDescription", width: 20 },
    { header: "User Name", key: "userName", width: 20 },
    { header: "User Email", key: "userEmail", width: 20 },
    { header: "User Phone", key: "userPhone", width: 20 },
    { header: "Applied At", key: "appliedAt", width: 20 },
    { header: "User Tech Skills", key: "userTechSkills", width: 20 },
    { header: "User Soft Skills", key: "userSoftSkills", width: 20 },
    { header: "User Resume", key: "userResume", width: 20 },
  ];
  // add data to worksheet
  applications.forEach((application) => {
    const {user , jobId} = application
    worksheet.addRow({
      jobId: jobId._id,
      jobTitle: jobId.jobTitle,
      jobLocation: jobId.jobLocation,
      jobType: jobId.workingTime,
      jobDescription: jobId.jobDescription,
      userName: user.firstName + " " + user.lastName,
      userEmail: user.email,
      userPhone: user.mobileNumber,
      userTechSkills: application.userTechSkills?.join(", "),
      userSoftSkills: application.userSoftSkills?.join(", "),
      appliedAt: application.createdAt,
      userResume: application.userResume
    });
  });

  // write excel file to response
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=applications.xlsx");
  await workbook.xlsx.write(res)
    res.status(200).end();
}