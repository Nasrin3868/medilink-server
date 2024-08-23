const enum_status = ["true", "false"];

const enum_for_kyc_verification = ["true", "false"];

// httpStatusCodes.js
const HttpStatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
    // Add more status codes as needed
  };

module.exports = { enum_status, enum_for_kyc_verification,HttpStatusCodes };
