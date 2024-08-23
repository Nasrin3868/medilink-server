import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { KycComponent } from './component/kyc/kyc.component';
import { DoctorListComponent } from './component/doctor-list/doctor-list.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { AdminHeaderComponent } from './component/admin-header/admin-header.component';
import { AdminHomeComponent } from './component/admin-home/admin-home.component';
import { AdminLoginComponent } from './component/admin-login/admin-login.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { DoctorProfileComponent } from './component/doctor-profile/doctor-profile.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { KycVerificationComponent } from './component/kyc-verification/kyc-verification.component';
import { SpecializationComponent } from './component/specialization/specialization.component';
import { CommissionComponent } from './component/commission/commission.component';
import { CapitalizeFirstPipe } from './pipe/capitalize-first.pipe';
import { PaymentHistoryComponent } from './component/payment-history/payment-history.component';
import { AppointmentHistoryComponent } from './component/appointment-history/appointment-history.component';
import { FormsModule } from '@angular/forms';
//chart
import { ChartModule } from 'primeng/chart';
import { PdfviewerComponent } from './component/pdfviewer/pdfviewer.component';

@NgModule({
  declarations: [
    KycComponent,
    DoctorListComponent,
    UserListComponent,
    AdminHeaderComponent,
    AdminHomeComponent,
    AdminLoginComponent,
    SidebarComponent,
    DashboardComponent,
    DoctorProfileComponent,
    UserProfileComponent,
    KycVerificationComponent,
    SpecializationComponent,
    CommissionComponent,
    CapitalizeFirstPipe,
    PaymentHistoryComponent,
    AppointmentHistoryComponent,
    PdfviewerComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartModule,
    FormsModule,
  ]
})
export class AdminModule { }
