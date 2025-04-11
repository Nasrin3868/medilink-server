export interface user{
    message?:msg,
    firstname:String,
    lastname:String,
    email:string,
    password:String,
    otp?:number,
    isverified?:boolean,
    blocked?:Boolean,
    refreshToken?:{
        type: String
      }
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
    wallet?:Number,
    refreshToken?:{
        type: String
      }
      
      firstName?: string;
      lastName?: string;
      password?: string;
      otp?: number;
      otp_update_time?: string;
      is_verified?: string;
      blocked?: string;
      created_time?: string;
      profile_picture?: string;
      __v?: number;
}

//getting data when login success
export interface loginResponseModel{
    accessToken?:string,
    accessedUser?:userInfo,
    message:string,
    email?:string,
}

export interface ChatAccessData{
    userId:string
}

