import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userInfo, usermodel } from "../model/usermodel";
import { doctor_state } from "./doctor.state";

const getuserstate=createFeatureSelector<doctor_state>('user')

export const selectDoctor = createSelector(
    getuserstate,
    (state:doctor_state) => state.doctorInfo
  );
