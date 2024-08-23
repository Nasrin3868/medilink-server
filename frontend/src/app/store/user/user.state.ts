// import { usermodel } from "../../model/usermodel";

import { usermodel } from "src/app/store/model/usermodel";

export const userstate:usermodel={
    list:[],
    errormessage:'',
    userobj:{
        firstname:'',
        lastname:'',
        email:'',
        password:'',
        otp:0,
        isverified:false,
        blocked:false
    }
}

export const user_State = {
    userInfo:{
       _id:'',
       firstName:'',
       lastName:'',
       email:'',
       role:''
    }
 }