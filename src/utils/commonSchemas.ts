import { body } from "express-validator";
/*
 ** Reusable email schema
 */
export const emailSchema = ({ dataIn = "body", required = true }) => ({
  in: [dataIn],
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: "Email is required",
  isString: {
    errorMessage: "Email must be a string",
    bail: true,
  },
  notEmpty: {
    options: { ignore_whitespace: true },
    errorMessage: "Email must not be empty",
    bail: true,
  },
  isEmail: {
    errorMessage: "Invalid email format",
    bail: true,
  },
  normalizeEmail: false,
  trim: true,
});

// reusable text schema for simple text
export const textSchema = ({ label = "", required = true }) => ({
  in: "body",
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} required`,
  isString: {
    errorMessage: `${label} must be string`,
    bail: true,
  },
  notEmpty: {
    options: { ignore_whitespace: true },
    errorMessage: `${label} should not be empty`,
    bail: true,
  },
  trim: true,
});
/*
 ** Reusable scehma function for userid, dogId, reviewerId
 */
export const idSchema = ({ dataIn = "body", label = "userId" }) => ({
  in: [dataIn],
  exists: { options: { checkNull: true, checkFalsy: true } },
  errorMessage: `${label} required`,
  isString: {
    errorMessage: `${label} must be string`,
    bail: true,
  },
  notEmpty: {
    options: { ignore_whitespace: true },
    errorMessage: `${label} Required`,
    bail: true,
  },
});
/*
 ** Resuable gender schema
 */
export const genderSchema = ({ dataIn = "body", label = "", required = true }) => ({
  in: [dataIn],
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} required`,
  isString: {
    errorMessage: `${label} must be string`,
    bail: true,
  },
  matches: {
    options: [/\b(?:MALE|FEMALE)\b/],
    errorMessage: `${label} should be MALE|FEMALE`,
  },
});
/*
 ** Resuable privacy status schema
 */
export const privacyStatusSchema = ({ dataIn = "body", label = "", required = true }) => ({
  in: [dataIn],
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} required`,
  isString: {
    errorMessage: `${label} must be string`,
    bail: true,
  },
  matches: {
    options: [/\b(?:PUBLIC|PRIVATE)\b/],
    errorMessage: `${label} should be PUBLIC | PRIVATE`,
  },
});
/*
 ** Resuable account status schema
 */
export const accountStatusSchema = ({ dataIn = "body", label = "", required = true }) => ({
  in: [dataIn],
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} required`,
  isString: {
    errorMessage: `${label} must be string`,
    bail: true,
  },
  matches: {
    options: [/\b(?:NOT-ACTIVE|ACTIVE|DISABLED)\b/],
    errorMessage: `${label} should be NOT-ACTIVE | ACTIVE | DISABLED`,
  },
});
/*
 ** Resuable verification status schema
 */
export const verificationStatusSchema = ({ dataIn = "body", label = "", required = true }) => ({
  in: [dataIn],
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} required`,
  isString: {
    errorMessage: `${label} must be string`,
    bail: true,
  },
  matches: {
    options: [/\b(?:NOT-VERIFIED|VERIFIED|PENDING)\b/],
    errorMessage: `${label} should be NOT-VERIFIED | VERIFIED | PENDING`,
  },
});
/*
 ** user profile image schema used for url validation
 */
export const urlSchema = ({ dataIn = "body", label = "userProfile", required = true }) => ({
  in: [dataIn],
  // exists: { options: { checkNull: true, checkFalsy: true } },
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} required`,
  isString: {
    errorMessage: `${label} must be string`,
  },
  notEmpty: {
    options: { ignore_whitespace: true },
    errorMessage: `${label} Required`,
    bail: true,
  },
  isURL: {
    errorMessage: `${label} invalid url`,
  },
});

/*
 ** Reusable schema for social schema
 */
export const socialTokenSchema = () => {
  return [
    body("socialTokens").optional().isArray().withMessage("SocialTokens must be an array if provided").bail(),
    body("socialTokens.*.socialId").optional().isString().withMessage("SocialId must be a string if provided"),
    body("socialTokens.*.socialPlatform")
      .optional()
      .isString()
      .withMessage("SocialPlatform must be a string if provided"),
  ];
};

export const connectionStatusSchema = ({ dataIn = "body", label = "connectionStatus", required = true }) => ({
  in: [dataIn],
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} is required`,
  isString: {
    errorMessage: `${label} must be a string`,
    bail: true,
  },
  matches: {
    options: [/\b(?:ACCEPTED|REJECTED)\b/],
    errorMessage: `${label} must be one of the following values: ACCEPTED, REJECTED`,
  },
});
