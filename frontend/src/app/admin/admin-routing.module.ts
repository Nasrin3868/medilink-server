import { Component, NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './component/admin-login/admin-login.component';
import { AdminHomeComponent } from './component/admin-home/admin-home.component';
import { DoctorListComponent } from './component/doctor-list/doctor-list.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { KycComponent } from './component/kyc/kyc.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { KycVerificationComponent } from './component/kyc-verification/kyc-verification.component';
import { SpecializationComponent } from './component/specialization/specialization.component';
import { CommissionComponent } from './component/commission/commission.component';
import { AppointmentHistoryComponent } from './component/appointment-history/appointment-history.component';
import { PaymentHistoryComponent } from './component/payment-history/payment-history.component';
import { ErrorPageComponent } from '../components/shared/error-page/error-page.component';
import { PdfviewerComponent } from './component/pdfviewer/pdfviewer.component';


const routes:Routes=[
  {path:'',redirectTo:'/login',pathMatch:'full' },
  {path:'login',component:AdminLoginComponent},
  {path:'admin_home',component:AdminHomeComponent ,children:[
    {path:'dashboard',component:DashboardComponent},
    {path:'doctor_listing',component:DoctorListComponent},
    {path:'kyc_verification',component:KycComponent},
    {path:'pdf_viewer',component:PdfviewerComponent},
    {path:'user_listing',component:UserListComponent},
    {path:'userProfile/:id',component:UserProfileComponent},
    {path:'checkDocumentsKYC',component:KycVerificationComponent},
    {path:'specialization',component:SpecializationComponent},
    {path:'payOut',component:CommissionComponent},
    {path:'appointment_history',component:AppointmentHistoryComponent},
    {path:'payment_details',component:PaymentHistoryComponent},
    // {path: '**', component: ErrorPageComponent }

  ] }
]

@NgModule({
  // declarations: [],
  imports: [
    RouterModule.forChild(routes)

  ],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
