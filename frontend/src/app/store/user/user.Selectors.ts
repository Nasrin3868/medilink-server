import { createFeatureSelector } from "@ngrx/store";
import { userInfo, usermodel } from "../model/usermodel";

const getuserstate=createFeatureSelector<userInfo>('user')