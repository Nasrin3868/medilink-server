import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';
import { HomeComponent } from './components/home/home.component';
import { VerifyOtpComponent } from './components/shared/verify-otp/verify-otp.component';
import { VerifyEmailComponent } from './components/shared/verify-email/verify-email.component';
import { NewPasswordComponent } from './components/shared/new-password/new-password.component';
import { UserloginComponent } from './components/shared/userlogin/userlogin.component';
import { userLoggedInGuard, userLoggedOutGuard } from './guards/user-guard.guard';
import { DoctorRegisterComponent } from './components/doctor/doctor-register/doctor-register.component';
import { DoctorHomeComponent } from './components/doctor/doctor-home/doctor-home.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { DoctorProfileComponent } from './components/doctor/doctor-profile/doctor-profile.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UserComponentComponent } from './components/user/user-component/user-component.component';
import { DoctorDashboardComponent } from './components/doctor/doctor-dashboard/doctor-dashboard.component';
import { DoctorProfileDataComponent } from './components/doctor/doctor-profile-data/doctor-profile-data.component';
import { SlotAddingComponent } from './components/doctor/slot-adding/slot-adding.component';
import { DoctorListingComponent } from './components/user/doctor-listing/doctor-listing.component';
import { UserdoctorProfileComponent } from './components/user/userdoctor-profile/userdoctor-profile.component';
import { AppointmentBookingComponent } from './components/user/appointment-booking/appointment-booking.component';
import { NextAppointmentComponent } from './components/doctor/next-appointment/next-appointment.component';
import { BookingDetailsComponent } from './components/user/booking-details/booking-details.component';
import { PaymentDetailsComponent } from './components/user/payment-details/payment-details.component';
import { UserNextAppointmentComponent } from './components/user/user-next-appointment/user-next-appointment.component';
import { DoctorPaymentDetailsComponent } from './components/doctor/doctor-payment-details/doctor-payment-details.component';
import { SuccessPaymentComponent } from './components/user/success-payment/success-payment.component';
import { UserChatComponent } from './components/user/user-chat/user-chat.component';
import { DoctorChatComponent } from './components/doctor/doctor-chat/doctor-chat.component';
import { DoctorBookingDetailsComponent } from './components/doctor/doctor-booking-details/doctor-booking-details.component';
import { DoctorVideoCallRoomComponent } from './components/doctor/doctor-video-call-room/doctor-video-call-room.component';
import { UserVideoCallRoomComponent } from './components/user/user-video-call-room/user-video-call-room.component';
import { AddPrescriptionComponent } from './components/doctor/add-prescription/add-prescription.component';
import { PrescriptionHistoryComponent } from './components/doctor/prescription-history/prescription-history.component';
import { UserPrescriptionHistoryComponent } from './components/user/user-prescription-history/user-prescription-history.component';
import { authGuard } from './guards/auth.guard';
import { ErrorPageComponent } from './components/shared/error-page/error-page.component';
import { WalletComponent } from './components/user/wallet/wallet.component';
import { doctorLoggedInGuard, doctorLoggedOutGuard } from './guards/doctor-auth.guard';
import { BookingsComponent } from './components/doctor/bookings/bookings.component';

const userRoutes: Routes = [
  { path: 'userRegister', component: UserRegisterComponent, canActivate: [userLoggedOutGuard] },
  { path: 'verify_email', component: VerifyEmailComponent, canActivate: [userLoggedOutGuard] },
  { path: 'verify_otp', component: VerifyOtpComponent },
  { path: 'registration_completed', redirectTo: 'login' },
  { path: 'new_password', component: NewPasswordComponent, canActivate: [userLoggedOutGuard] },
  // {path: 'user_profile',component:UserProfileComponent},
  { path: 'login', component: UserloginComponent, canActivate: [userLoggedOutGuard] },
  { path: 'userHome', component: UserHomeComponent },
  {
    path: 'user_profile', component: UserComponentComponent, canActivate: [userLoggedInGuard], children: [
      // {path:'user_dashboard',component:DashboardComponent},
      { path: '', redirectTo: 'user_profile_data', pathMatch: 'full' },
      { path: 'user_profile_data', component: UserProfileComponent },
      { path: 'user_next_appointment', component: UserNextAppointmentComponent },
      { path: 'user_booking_details', component: BookingDetailsComponent },
      { path: 'user_payment_details', component: PaymentDetailsComponent },
      { path: 'prescription_history', component: UserPrescriptionHistoryComponent },
      {path:'user_wallet',component:WalletComponent}
    ]
  },
  { path: 'success_payment/:id', component: SuccessPaymentComponent, canActivate: [userLoggedInGuard] },
  { path: 'doctor_listing', component: DoctorListingComponent },
  { path: 'doctor_profile/:id', component: UserdoctorProfileComponent, canActivate: [userLoggedInGuard] },
  { path: 'appoinment_booking', component: AppointmentBookingComponent, canActivate: [userLoggedInGuard] },
  { path: 'userchat', component: UserChatComponent, canActivate: [userLoggedInGuard] },
  { path: 'user_video_call_room/:id/:appointmentId', component: UserVideoCallRoomComponent, canActivate: [userLoggedInGuard] },
  { path: '**', component: ErrorPageComponent }

]

const doctorRoutes: Routes = [
  { path: 'doctor_register', component: DoctorRegisterComponent,canActivate:[doctorLoggedOutGuard] },
  { path: 'verify_email', component: VerifyEmailComponent},
  { path: 'verify_otp', component: VerifyOtpComponent },
  { path: 'registration_completed', redirectTo: 'doctor_login' },
  { path: 'new_password', component: NewPasswordComponent,canActivate:[doctorLoggedOutGuard] },
  {
    path: 'doctor_profile', component: DoctorProfileComponent,canActivate:[doctorLoggedInGuard], children: [
      { path: 'doctorDashboard', component: DoctorDashboardComponent },
      { path: 'doctor_profile_data', component: DoctorProfileDataComponent },
      { path: 'slot_details', component: SlotAddingComponent },
      { path: 'next_appointment', component: NextAppointmentComponent },
      { path: 'payment_details', component: DoctorPaymentDetailsComponent },
      { path: 'booking_history', component: DoctorBookingDetailsComponent },
      { path: 'prescription_history', component: PrescriptionHistoryComponent },
    ]
  },
  { path: 'doctor_login', component: UserloginComponent, canActivate: [userLoggedOutGuard] },
  { path: 'doctorHome', component: DoctorHomeComponent,canActivate:[doctorLoggedInGuard] },
  { path: 'doctor_chat', component: DoctorChatComponent,canActivate:[doctorLoggedInGuard] },
  { path: 'doctor_video_call_room/:id/:appointmentId', component: DoctorVideoCallRoomComponent,canActivate:[doctorLoggedInGuard] },
  { path: 'add_prescription/:appointmentId', component: AddPrescriptionComponent,canActivate:[doctorLoggedInGuard] },
  { path: 'bookings', component: BookingsComponent,canActivate:[doctorLoggedInGuard] },
  { path: '**', component: ErrorPageComponent }
]

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'home', redirectTo: '' },
  { path: 'user', children: userRoutes },
  { path: 'doctor', children: doctorRoutes },
  {
    path: 'admin',
    loadChildren: () =>
      import('../app/admin/admin.module').then(m => m.AdminModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
