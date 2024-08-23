import { createReducer, on } from "@ngrx/store";
import { user_State, userstate } from "./user.state";
import { loginUserSuccess, logoutUser,  } from "./user.Action";

export function userReducer(state:any,action:any){
    return _userReducer(state,action)
}

const _userReducer=createReducer(user_State,
    // on(registerusersuccess,(state,action)=>{
    //     return {
    //         ...state,
    //         // list:[...state.list,action.inputdata],
    //         // errorMessage:''
    //     }
    // }),
    on(loginUserSuccess,(state,action)=>{
        const user={...action.data}
        return {
            ...state,
            userInfo:{
                _id:user._id,
                firstName:user.firstname,
                lastName:user.lastname,
                email:user.email,
                role:user.role
            }
        }
    }),
    on(logoutUser,(state)=>{
        return {
            ...state,
            userInfo:{
                _id:'',
                firstName:'',
                lastName:'',
                email:'',
                role:''
            }
        }
    })
)