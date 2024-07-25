import { compareSync, hashSync } from "bcrypt"
import jwt from "jsonwebtoken";
import { ErrorHandel } from "../../utils/error-class.utils.js"
import { sendEmailService } from './../../services/send-email.service.js';
import { systemRoles } from "../../utils/system-roles.utils.js";
import { confirmEmailTemplate, resetPasswordTemplate } from "../../utils/send-email-temp.utils.js";
import User from "../../../DB/models/user.model.js"
import Application from "../../../DB/models/application.model.js"
import Job from "../../../DB/models/job.model.js"
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns response {message , user}
 * @description this function create new user
 */
export const signUp = async (req , res , next) => {  
  // destructure user data from body
const {
  firstName,
  lastName,
  mobileNumber,
  recoveryEmail,
  birthDate,
  email,
  password,
  role,
} = req.body;
// check if email already used by another user
const emailExists = await User.findOne({email})
// if email exists return error
  if(emailExists) return next(new ErrorHandel("this email is already exists" , 409))
    // check if phone already used by another user
    const phoneExists = await User.findOne({mobileNumber})
  // if phone exists return error
  if(phoneExists) return next(new ErrorHandel("this phone is already exists" , 409))
    // create instance of new user
const newUser = new User({
  firstName,
  lastName,
  userName: firstName + lastName,
  mobileNumber,
  email,
  recoveryEmail,
  birthDate,
  // hashing the password
  password: hashSync(password, +process.env.SALT_ROUNDS),
  role,
});
// generate token with user id valid for 1 hour
const token = jwt.sign(
  { _id: newUser._id },
  process.env.JWT_SECRET_CONFIRMATIAN_EMAIL,
  { expiresIn: "1h" }
);
// send email to confirm email
const isEmailSend = await sendEmailService({
  to: email,
  subject: "please confirm your email",
  htmlMessage: confirmEmailTemplate(
    firstName,
    `${req.protocol}://${req.headers.host}/user/confirm/${token}`
  ),
});
// if email not send error
if (isEmailSend.rejected.length) {
  return res.status(400).json({ message: "Email not sent" });
} 
// save user in DB
const createdUser = await newUser.save();

res.status(201).json({message: "user created", data: createdUser})

}
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {message , confirmed }
 * @description this function confirm user email 
 */
export const confirmEmail = async (req , res , next) => {
  
  const {token} = req.params
  // check if token is valid and destructure user id
  const { _id } = jwt.verify(token, process.env.JWT_SECRET_CONFIRMATIAN_EMAIL);
  // update user emailConfirmed to true
  const user = await User.findByIdAndUpdate(_id , {emailConfirmed : true} )
  // if user not found return error
  if(!user) return next(new ErrorHandel("user not found" , 404))

  // if email already confirmed return error
  if (user.emailConfirmed) return next(new ErrorHandel("email already confirmed", 400));
  res.status(200).json({ message: "user confirmed", confirmed: true });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {message , token}
 * @description this function login user and generate token to send to client and update user status to online
 */
export const signIn = async (req , res , next) => {
  // destructure user data from body
  const {email , phone, recoveryEmail ,password } = req.body

  let user 
  if(email){ 
    user = await User.findOne({email}) 
  }
  if(phone) {
    user = await User.findOne({ mobileNumber: phone });
  }
  if(recoveryEmail){
    let usersByRecoveryEmail = await User.find({ recoveryEmail });
    if(!usersByRecoveryEmail.length) { 
      return next(new ErrorHandel("email or password is wrong" , 404))
    }
    for (const userRecoveryEmail of usersByRecoveryEmail) {
      let isPasswordMatched = compareSync(password, userRecoveryEmail.password);
      if (isPasswordMatched) {
        user = userRecoveryEmail;
        break
      }
    }
  } 
  // if user not found return error
  if(!user) {
    return next(new ErrorHandel("email or password is wrong" , 404))
  }
  // check if password is matched
  const isPasswordMatched = compareSync(password, user.password);
  // if password not matched return error
  if (!isPasswordMatched) {
    return next(new ErrorHandel("email or password is wrong", 400));
  }
  // generate token with user id 
  const token = jwt.sign(
    { _id: user._id  },
    process.env.JWT_SECRET_SIGNIN,  
  );
  // update user status to online
  user.status = "online"
  await user.save()
  res.status(200).json({message: "user signed in", token})
}
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {message}
 * @description this function logout user and update user status to offline
 */
export const logOut = async (req , res , next) => {
  // destructure user id from auth user
  const {_id} = req.authUser
  // update user status to offline
  const user = await User.findByIdAndUpdate(_id , {status : "offline"} )
  // if user not found return error
  if(!user) return next(new ErrorHandel("user not found" , 404))
  res.status(200).json({message: "user signed out"})
}
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {message , user , updated} 
 * @description this function update user data 
 */
export const updateUser = async (req , res , next) => {
  // destructure user id from auth user
  const { _id } = req.authUser;
  // destructure user data from body
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    recoveryEmail,
    birthDate,
    password,
  } = req.body;
  // check if user exists in DB
  const user = await User.findById(_id);
  // check if password is matched
  const isPasswordMatched = compareSync(password, user.password);
  // if password not matched return error
  if (!isPasswordMatched) {
    return next(new ErrorHandel("password is wrong", 400));
  }
  // check if email to update used by another user in DB
  const isEmailExists = await User.findOne({ email });
  // if email to update exists return error
  if (isEmailExists)
    return next(new ErrorHandel("this email is already exists", 409));
  // check if phone to update used by another user in DB
  const isPhoneExists = await User.findOne({ mobileNumber });
  // if phone to update exists return error
  if (isPhoneExists)
    return next(new ErrorHandel("this phone is already exists", 409));
  // ckeck if user send new email to update and send mail to new email to confirm it
  if (email) {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET_CONFIRMATIAN_EMAIL, {
      expiresIn: "1h",
    });
    const isEmailSend = await sendEmailService({
      to: email,
      subject: "please confirm your email",
      htmlMessage: confirmEmailTemplate(
        firstName,
        `${req.protocol}://${req.headers.host}/user/confirm/${token}`
      ),
    });
    // if email not sent return error
    if (isEmailSend.rejected.length) {
      return res.status(400).json({ message: "Email not sent" });
    }
    user.emailConfirmed = false;
  }
  // update user data
  user.firstName = firstName;
  user.lastName = lastName;
  user.userName = firstName + lastName;
  user.email = email;
  user.mobileNumber = mobileNumber;
  user.recoveryEmail = recoveryEmail;
  user.birthDate = birthDate;
  user.__v += 1;
  // save user data in DB
  const updatedUser = await user.save();
  res.status(200).json({ message: "user updated", updated: true, updatedUser });
} 
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {message , deleted , user}
 * @description this function delete user and data related to this user
 */
export const deleteUser = async (req , res , next) => {
  // destructure user id from auth user
  const {_id  ,password: userPassword ,role} = req.authUser  
  // destructure user password from body
  const {password} = req.body
  // check if password is matched
  const isPasswordMatched = compareSync(password, userPassword);
  // if password not matched return error
  if(!isPasswordMatched) return next(new ErrorHandel("password is wrong", 400))
  // get user data from DB by id and delete it
  const user = await User.deleteOne({_id})
  // check role of user
  if (role === systemRoles.user) {
    // if user role is user delete all applications related to this user
    const deletedApplications = await Application.deleteMany({ user: _id });
  } else if (role === systemRoles.Company_HR) {
    // if user role is company HR delete all jobs related to this user
    const deletedJobs = await Job.deleteMany({ company: _id });
  }
  res.status(200).json({message: "user deleted", deleted: true , user})
} 

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {ownerData}
 * @description this function get owner data and return it
 */
export const getOwnerData = async (req , res , next) => {
  // destructure user data from auth user
  const { _id , firstName , lastName , email , mobileNumber , recoveryEmail , birthDate ,userName} = req.authUser
  const ownerData = {
    _id,
    firstName,
    lastName,
    email,
    mobileNumber,
    recoveryEmail,
    birthDate,
    userName,
  };
  res.status(200).json({ ownerData });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns user data
 * @description this function get user data and return it
 */
export const getUser = async(req , res , next)=> {
  // destructure user id from params
  const {id} = req.params
  //get user data from DB by id and select not sensitive fields
  const user = await User.findById(id).select(
    "firstName lastName email mobileNumber status role birthDate userName"
  );

  // if user not found return error
  if(!user) return next(new ErrorHandel("user not found" , 404))

  res.status(200).json({ user });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {message , updated , user}
 * @description this function update user password
 */

export const updatePassword = async (req , res , next) => {
  // destructure user id and user password from auth user
  const {_id , password:currentPassword} = req.authUser

  // destructure user old password and new password from body
  const {oldPassword , newPassword} = req.body

  // check if password is matched
  const isPasswordMatched = compareSync(oldPassword, currentPassword);

  // if password not matched return error
  if (!isPasswordMatched) {
    return next(new ErrorHandel("password is wrong", 400));
  }

  // hash new password
  const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUNDS);

  // update user password in DB
  const user = await User.findByIdAndUpdate(_id, { $set: { password: hashedPassword }  , $inc:{__v : 1}}).select("-password");

  res.status(200).json({ message: "password updated", updated: true, user });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {message}
 * @description this function forget password by send OTP to email
 */
export const forgetPassword = async (req , res , next) => {
  // destructure user email from body
  const {email} = req.body

  // check if user exists
  const user = await User.findOne({email})
  if(!user) return next(new ErrorHandel("user not found" , 404))

  // generate OTP
  const OTP = Math.floor(Math.random() * 1000000 + 1); 
  // send OTP to email
  const isEmailSend = await sendEmailService(
    {
      to : email,
      subject: "reset password",
      htmlMessage: resetPasswordTemplate(user.firstName,OTP),
    }
  ); 
  // if email not sent return error
  if (isEmailSend.rejected.length) {
    return res.status(400).json({ message: "Email not sent" });
  }
  // hash OTP and save it in DB
  const hashedOTP = hashSync(`${OTP}`, +process.env.SALT_ROUNDS);
  user.OTP = hashedOTP
  // set expired time for OTP 10 minutes
  user.expiredOTP = Date.now() + 10*60*1000
  user.save()
  res.status(200).json({ message: "check your email for reset password" });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {message , updatedUser}
 * @description this function reset password for user after getting OTP
 */
export const resetPassword = async (req , res , next) => {
  // destructure user email and new password and OTP from body
  const {email , OTP , newPassword} = req.body

  // check if user exists
  const user = await User.findOne({email})
  if(!user) return next(new ErrorHandel("user not found" , 404))

  // check if OTP is expired
  if(Date.now() > user.expiredOTP) {
    return next(new ErrorHandel("OTP expired" , 400))
  }

  // check if OTP is matched
  const isOtpMatched = compareSync(OTP, user.OTP);
  if (!isOtpMatched) {
    return next(new ErrorHandel("OTP is wrong", 400));
  }

  // hash new password
  const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUNDS);

  // update user password in DB and unset OTP and expiredOTP
  const updatedUser = await User.updateOne(
    { email },
    {
      $set: { password: hashedPassword },
      $inc: { __v: 1 },
      $unset: { OTP: "", expiredOTP: "" }
    } , 
    { new: true }).select("-password");
  res.status(200).json({ message: "password reset successfully", updatedUser });
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns message {message , users}
 * @description this function get users by recovery email
 */
export const getUsersByRecoveryEmail = async (req , res , next) => {
  // destructure user email from query
  const {recoveryEmail} = req.authUser

  // check if user exists and ignore password
  const users = await User.find({recoveryEmail}).select("-password");
  // if user not found return error
  if(!users) return next(new ErrorHandel("user not found" , 404))
  res.status(200).json({ users });
}