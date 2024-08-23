export interface user{
    message?:msg,
    firstname:String,
    lastname:String,
    email:string,
    password:String,
    otp?:number,
    isverified?:boolean,
    blocked?:Boolean
}

//message model
export interface msg{
    message:String
}

//model for registration
export interface userregister{
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    otp:number,
}


//model for state
export interface usermodel{
    list:user[],
    userobj:user,
    errormessage:string
}


//login model
export interface loginModel{
    email:string,
    password:string
}

// store setting
export interface userInfo{
    _id:string,
    firstname:string,
    lastname:string,
    email:string,
    role:string,
    wallet?:Number
}

//getting data when login success
export interface loginResponseModel{
    accessToken?:string,
    accessedUser?:userInfo,
    message:string,
    email?:string,
}

