import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { doctorData } from 'src/app/admin/model/docotrModel';
import { CommonService } from 'src/app/services/common.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { namePattern,mobilepattern,experiencePattern, consultationFeePattern } from '../../shared/regular_expressions/regular_expressions';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-profile-data',
  templateUrl: './doctor-profile-data.component.html',
  styleUrls: ['./doctor-profile-data.component.css']
})
export class DoctorProfileDataComponent implements OnInit{

  docId!:any;
  doctorDetails!:any
  edit=false
  url!:any
  email_edit:boolean=false
  name_edit:boolean=false

  constructor(
    private _commonService:CommonService,
    private _doctorService:DoctorService,
    private _formBuilder:FormBuilder,
    private _showMessage:MessageToasterService,
    private _imageuploadService:ImageUploadService,
    private _router:Router,
  ){}

  ngOnInit(): void {
    this.getDoctorDetails()
    this.editProfileForm.get('firstName')?.disable();
    this.editProfileForm.get('lastName')?.disable();
    this.editProfileForm.get('contactno')?.disable();
    this.editProfileForm.get('experience')?.disable();
    this.editProfileForm.get('current_working_hospital_address')?.disable();
    this.editProfileForm.get('consultation_fee')?.disable();
    this.email_form.get('email')?.disable();
  }

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadImage()
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  uploadImage() {
    if (this.selectedFile) {
      this._imageuploadService.uploadImage(this.selectedFile, 'medilink24').subscribe(
        imageUrl => {
          // Assume response.secure_url is the image URL returned by Cloudinary
          // const imageUrl = response.secure_url;
          console.log('Image uploaded successfully:', imageUrl);
          
          // Apply transformation to crop or pad image to 200x200
          const transformedUrl = this.applyTransformation(imageUrl, 200, 200);
          console.log('Transformed Image URL:', transformedUrl);
          
          // Save the transformed URL
          this.url = transformedUrl;
          this.upload_image_to_server();
        },
        (error) => console.error('Error uploading image:', error)
      );
    }
  }
  
  applyTransformation(imageUrl: string, width: number, height: number): string {
    // Find the index of the upload path to inject the transformation
    const uploadIndex = imageUrl.indexOf('/upload/') + 8; // 8 is the length of '/upload/'
    
    // Create the transformation string to crop the image
    const transformation = `c_fill,g_auto,w_${width},h_${height}`;
  
    // Insert the transformation into the URL
    const transformedUrl = `${imageUrl.slice(0, uploadIndex)}${transformation}/${imageUrl.slice(uploadIndex)}`;
    
    return transformedUrl;
  }
  
  upload_image_to_server(){
    const data={
      doctorId:this.docId,
      image_url:this.url
    }
    this._doctorService.edit_doctor_profile_picture(data).subscribe({
      next:(Response)=>{
        this._showMessage.showSuccessToastr(Response.message)
      },error:(error)=>{
        this._showMessage.showErrorToastr(error.error.message)
      }
    })
  }

  triggerFileInput() {
    const fileInput = document.getElementById('upload_profile') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  editProfileForm=this._formBuilder.group({
    firstName:['',[Validators.required,Validators.maxLength(50),Validators.pattern(namePattern)]],
    lastName:['',[Validators.required,Validators.maxLength(50),Validators.pattern(namePattern)]],
    contactno:['',[Validators.required,Validators.pattern(mobilepattern)]],
    current_working_hospital_address:['',[Validators.required,Validators.maxLength(150)]],
    experience:['',[Validators.required,Validators.pattern(experiencePattern)]],
    consultation_fee:['',[Validators.required,Validators.pattern(consultationFeePattern)]],
  })

  email_form=this._formBuilder.group({
    email:['',[Validators.required,Validators.email]]
  })

  submit_profile_details(){
    console.log('edit profile submitted');
    if(this.editProfileForm.invalid){
      console.log('Form is invalid');
      this.markFormGroupTouched(this.editProfileForm);
      return;
    } else {
      if(
        this.editProfileForm.value.firstName===this.doctorDetails.firstName&&
        this.editProfileForm.value.lastName===this.doctorDetails.lastName&&
        this.editProfileForm.value.contactno===this.doctorDetails.contactno&&
        this.editProfileForm.value.consultation_fee===this.doctorDetails.consultation_fee&&
        this.editProfileForm.value.current_working_hospital_address===this.doctorDetails.current_working_hospital_address&&
        this.editProfileForm.value.experience===this.doctorDetails.experience
      ){
        this.close_name()
        return
      }
      const data = {
        _id: this.docId,
        firstName: this.editProfileForm.value.firstName,
        lastName: this.editProfileForm.value.lastName,
        contactno: this.editProfileForm.value.contactno,
        experience: this.editProfileForm.value.experience,
        current_working_hospital_address: this.editProfileForm.value.current_working_hospital_address,
        consultation_fee: this.editProfileForm.value.consultation_fee,
      };
      this._doctorService.editDoctorProfile(data).subscribe({
        next: (response) => {
          this._showMessage.showSuccessToastr(response.message);
          this.doctorDetails.firstName = data.firstName;
          this.doctorDetails.lastName = data.lastName;
          this.doctorDetails.contactno = data.contactno;
          this.doctorDetails.current_working_hospital_address = data.current_working_hospital_address;
          this.doctorDetails.experience = data.experience;
          this.doctorDetails.consultation_fee = data.consultation_fee;
          this.close_name()
        },
        error: (error) => {
          console.log('Error response:', error);
          this._showMessage.showErrorToastr(error.error.message);
          this.close_name()
        }
      });
    }
  }

  submit_email(){
    console.log('edit profile submitted');
    if(this.email_form.invalid){
      console.log('Form is invalid');
      this.markFormGroupTouched(this.email_form);
      return;
    } else {
      if(this.email_form.value.email===this.doctorDetails.email){
        this.close_email()
        return
      }
      const data = {
        doctorId: this.docId,
        email: this.email_form.value.email
      };
      this._doctorService.opt_for_new_email(data).subscribe({
        next:(Response)=>{
          this._showMessage.showSuccessToastr(Response.message)
          if(data.email){
            localStorage.setItem('email',this.doctorDetails.email)
            localStorage.setItem('new_email',data.email)
            localStorage.setItem('role','doctor_new_email')
          }
          this._router.navigate(['doctor/verify_otp'])
        },error:(error)=>{
          this._showMessage.showErrorToastr(error.error.message)
        }
      })
    }
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  close_name(){
    this.editProfileForm.patchValue({
      firstName: this.doctorDetails.firstName,
      lastName: this.doctorDetails.lastName,
      contactno: this.doctorDetails.contactno,
      experience: this.doctorDetails.experience,
      current_working_hospital_address: this.doctorDetails.current_working_hospital_address,
      consultation_fee: this.doctorDetails.consultation_fee,
    });
    this.name_edit=!this.name_edit
    if (this.name_edit) {
      this.editProfileForm.get('firstName')?.enable();
      this.editProfileForm.get('lastName')?.enable();
      this.editProfileForm.get('contactno')?.enable();
      this.editProfileForm.get('experience')?.enable();
      this.editProfileForm.get('current_working_hospital_address')?.enable();
      this.editProfileForm.get('consultation_fee')?.enable();
    } else {
      this.editProfileForm.get('firstName')?.disable();
      this.editProfileForm.get('lastName')?.disable();
      this.editProfileForm.get('contactno')?.disable();
      this.editProfileForm.get('experience')?.disable();
      this.editProfileForm.get('current_working_hospital_address')?.disable();
      this.editProfileForm.get('consultation_fee')?.disable();
    }
  }

  close_email(){
    this.email_form.patchValue({
      email: this.doctorDetails.email
    });
    this.email_edit = !this.email_edit;
    if (this.email_edit) {
      this.email_form.get('email')?.enable();
    } else {
      this.email_form.get('email')?.disable();
    }
  }

  getDoctorDetails(){
    this.docId=this._commonService.getDoctorIdFromLocalStorage()
    this._doctorService.getDoctorDetails({_id:this.docId}).subscribe({
      next:(Response)=>{
        this.doctorDetails=Response
        this.url=Response.profile_picture
        this.editProfileForm.patchValue({
          firstName: this.doctorDetails.firstName,
          lastName: this.doctorDetails.lastName,
          // email: this.doctorDetails.email,
          contactno: this.doctorDetails.contactno.toString(),
          current_working_hospital_address: this.doctorDetails.current_working_hospital_address,
          experience: this.doctorDetails.experience,
          consultation_fee: this.doctorDetails.consultation_fee.toString(),
        });
        this.email_form.patchValue({email:this.doctorDetails.email})
      },
      error:(error)=>{
        // console.log('error while fetching doc details:',error.error.message);
        this._showMessage.showErrorToastr(error.error.message)
      }
    })
  }

  changeEdit(){
    this.edit=!this.edit
  }

//   onEditProfile(){
//     if(this.editProfileForm.invalid){
//       console.log('invalid edit form');
      
//     }else{
//       if(Number(this.editProfileForm.get('experience'))>80){
//         this._showMessage.showErrorToastr('Invalid no. of Experience')
//         return
//       }
//       if(Number(this.editProfileForm.get('consultation_fee'))>=2000){
//         this._showMessage.showErrorToastr('Consultation fee should be upto 2000/-')
//         return
//       }
//       const data={
//         _id:this.docId,
//         firstName:this.editProfileForm.value.firstName,
//         lastName:this.editProfileForm.value.lastName,
//         // email:this.editProfileForm.value.email,
//         contactno:this.editProfileForm.value.contactno,
//         current_working_hospital_address:this.editProfileForm.value.current_working_hospital_address,
//         experience:this.editProfileForm.value.experience,
//         consultation_fee:this.editProfileForm.value.consultation_fee,
//       }

//       this._doctorService.editDoctorProfile(data).subscribe({
//         next:(Response)=>{
//           this._showMessage.showSuccessToastr(Response.message)
//           this.changeEdit()
//           this.doctorDetails.firstName=data.firstName
//           this.doctorDetails.lastName=data.lastName
//           // this.doctorDetails.email=data.email
//           this.doctorDetails.contactno=data.contactno
//           this.doctorDetails.current_working_hospital_address=data.current_working_hospital_address
//           this.doctorDetails.experience=data.experience
//           this.doctorDetails.consultation_fee=data.consultation_fee
//         },
//         error:(error)=>{
//           // console.log('error while updating editProfile');
//           this._showMessage.showErrorToastr(error.error.message)
//           this.changeEdit()
//         }
//       })

//     } 
//   }

} 
