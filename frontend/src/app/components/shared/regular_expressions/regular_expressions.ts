
//doctor registration
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*\s*$/;
export const mobilepattern = /^(?:\+91|91|0)?[7-9]\d{9}$/;
export const experiencePattern = /^(?:[0-5]?\d|60)$/;
export const consultationFeePattern = /^(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2}|2000)$/;

export const otpPattern = /^[0-9]+$/;
export const roomIdPattern='^[A-Za-z0-9]{8}$'
export const payOutPattern=/^\d{1,2}$/;


 