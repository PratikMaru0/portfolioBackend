import validator from "validator";
import schemaMessages from "../constants/schemaMessages.js";

export const validateSignUpData = (req) => {
  const { emailId, password } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error(schemaMessages.EMAIL_INVALID);
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(schemaMessages.PASSWORD_INVALID);
  }
};

export const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "phoneNumber",
    "profilePicUrl",
    "tagline",
    "shortIntro",
    "socialMediaLink",
    "resumeUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

export const validateExperienceData = (req) => {
  const allowedEditFields = [
    "companyName",
    "role",
    "startDate",
    "endDate",
    "description",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

export const validateProjectData = (req) => {
  const allowedEditFields = [
    "imageUrl",
    "projectName",
    "description",
    "problemSolve",
    "techStack",
    "gitHubLink",
    "liveLink",
    "imageFileId",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

export const validateEducationData = (req) => {
  const allowedEditFields = [
    "institute",
    "degree",
    "startDate",
    "endDate",
    "learnings",
    "activities",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};
