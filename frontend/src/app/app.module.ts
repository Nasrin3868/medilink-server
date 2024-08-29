import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimeNGModule } from './primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { userReducer } from './store/user/user.Reducer';
import { usereffects } from './store/user/user.Effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
// import { UserloginComponent } from './components/shared/userlogin/userlogin.component';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { VerifyEmailComponent } from './components/shared/verify-email/verify-email.component';
import { VerifyOtpComponent } from './components/shared/verify-otp/verify-otp.component';
import { NewPasswordComponent } from './components/shared/new-password/new-password.component';
import { UserloginComponent } from './components/shared/userlogin/userlogin.component';
import { DoctorRegisterComponent } from './components/doctor/doctor-register/doctor-register.component';
import { doctorReducer } from './store/doctor/doctor.Reducer';
import { doctorEffects } from './store/doctor/doctor.Effects';
import { DoctorHomeComponent } from './components/doctor/doctor-home/doctor-home.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { DoctorProfileComponent } from './components/doctor/doctor-profile/doctor-profile.component';
import { UserComponentComponent } from './components/user/user-component/user-component.component';
import { DoctorComponentComponent } from './components/doctor/doctor-component/doctor-component.component';
import { AdminModule } from './admin/admin.module';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { adminReducer } from './admin/store/admin.reducer';
import { adminEffects } from './admin/store/admin.effects';
import { SideBarComponent } from './components/doctor/side-bar/side-bar.component';
import { DoctorDashboardComponent } from './components/doctor/doctor-dashboard/doctor-dashboard.component';
import { DoctorProfileDataComponent } from './components/doctor/doctor-profile-data/doctor-profile-data.component';
import { SlotAddingComponent } from './components/doctor/slot-adding/slot-adding.component';
// import { AppointmentsComponent } from './components/doctor/appointments/appointments.component';

// import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';


import { CalendarModule } from 'primeng/calendar';


import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DoctorListingComponent } from './components/user/doctor-listing/doctor-listing.component';
import { UserdoctorProfileComponent } from './components/user/userdoctor-profile/userdoctor-profile.component';
import { AppointmentBookingComponent } from './components/user/appointment-booking/appointment-booking.component';
import { CapitalizeFirstPipe } from './pipe/capitalize-first.pipe';

//for primeng modal
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CustomDatePipe } from './pipe/custom-date.pipe';
// import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { NextAppointmentComponent } from './components/doctor/next-appointment/next-appointment.component';
import { PaymentDetailsComponent } from './components/user/payment-details/payment-details.component';
import { BookingDetailsComponent } from './components/user/booking-details/booking-details.component';
import { UserNextAppointmentComponent } from './components/user/user-next-appointment/user-next-appointment.component';
import { UserSideBarComponent } from './components/user/user-side-bar/user-side-bar.component';
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
//chart
import { ChartModule } from 'primeng/chart';
import { ConfirmationModalComponent } from './components/shared/confirmation-modal/confirmation-modal.component';
import { ErrorPageComponent } from './components/shared/error-page/error-page.component';
import { WalletComponent } from './components/user/wallet/wallet.component';
import { BookingsComponent } from './components/doctor/bookings/bookings.component';
import { PrescriptionModalComponent } from './components/shared/prescription-modal/prescription-modal.component';
import { UserBookingComponent } from './components/user/user-booking/user-booking.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserloginComponent,
    UserRegisterComponent,
    HeaderComponent,
    FooterComponent,
    VerifyEmailComponent,
    VerifyOtpComponent,
    NewPasswordComponent,
    DoctorRegisterComponent,
    DoctorHomeComponent,
    UserHomeComponent,
    UserProfileComponent,
    DoctorProfileComponent,
    UserComponentComponent,
    DoctorComponentComponent,
    SideBarComponent,
    DoctorDashboardComponent,
    DoctorProfileDataComponent,
    SlotAddingComponent,
    // AppointmentsComponent,
    DoctorListingComponent,
    UserdoctorProfileComponent,
    AppointmentBookingComponent,
    CapitalizeFirstPipe,
    CustomDatePipe,
    NextAppointmentComponent,
    PaymentDetailsComponent,
    BookingDetailsComponent,
    UserNextAppointmentComponent,
    UserSideBarComponent,
    DoctorPaymentDetailsComponent,
    SuccessPaymentComponent,
    UserChatComponent,
    DoctorChatComponent,
    DoctorBookingDetailsComponent,
    DoctorVideoCallRoomComponent,
    UserVideoCallRoomComponent,
    AddPrescriptionComponent,
    PrescriptionHistoryComponent,
    UserPrescriptionHistoryComponent,
    ConfirmationModalComponent,
    ErrorPageComponent,
    WalletComponent,
    BookingsComponent,
    PrescriptionModalComponent,
    UserBookingComponent,
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    PrimeNGModule,
    AdminModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ user: userReducer, doctor: doctorReducer, admin: adminReducer }, {}),
    EffectsModule.forRoot([usereffects, doctorEffects, adminEffects]),
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    HttpClientModule,

    // CardModule,
    ButtonModule,
    CalendarModule,
    ScrollPanelModule,

    TableModule, CommonModule,
    ChartModule,




  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
