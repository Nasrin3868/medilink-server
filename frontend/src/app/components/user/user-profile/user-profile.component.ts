import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { namePattern } from '../../shared/regular_expressions/regular_expressions';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit{
  user_profile_data:any={firstName:'',lastName:''}
  userId!:string|null;
  email_edit:boolean=false
  name_edit:boolean=false
  url: any = null;
  imagePath!:any
  profile_pic_event!:Event;

  constructor(
    private _userService:UserserviceService,
    private _showMessage:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _router:Router,
    private _imageuploadService:ImageUploadService,
  ){}

  ngOnInit(): void {
    this.profileData()
    this.name_form.get('firstName')?.disable();
    this.name_form.get('lastName')?.disable();
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

  uploadImage(){
    if (this.selectedFile) {
      console.log('upload file in ts,before service call');
    this._imageuploadService.uploadImage(this.selectedFile, 'medilink24').subscribe(
      imageUrl => {
        console.log('Image uploaded successfully:', imageUrl);
        this.url=imageUrl
        this.upload_image_to_server()
      },
      error => console.error('Error uploading image:', error)
    );
    }
  }

  upload_image_to_server(){
    const data={
      userId:this.userId,
      image_url:this.url
    }
    this._userService.edit_user_profile_picture(data).subscribe({
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

  edit_profile_picture=this._formBuilder.group({
    profile_picture:[null,Validators.required]
  })

  name_form=this._formBuilder.group({
    firstName:[this.user_profile_data.firstName,[Validators.required,Validators.maxLength(50),Validators.pattern(namePattern)]],
    lastName:[this.user_profile_data.lastName,[Validators.required,Validators.maxLength(50),Validators.pattern(namePattern)]],
  })

  email_form=this._formBuilder.group({
    email:['',[Validators.required,Validators.email]]
  })

  close_name(){
    this.name_form.patchValue({
      firstName: this.user_profile_data.firstName,
      lastName: this.user_profile_data.lastName
    });
    this.name_edit=!this.name_edit
    if (this.name_edit) {
      this.name_form.get('firstName')?.enable();
      this.name_form.get('lastName')?.enable();
    } else {
      this.name_form.get('firstName')?.disable();
      this.name_form.get('lastName')?.disable();
    }
  }

  close_email(){
    this.email_form.patchValue({
      email: this.user_profile_data.email
    });
    this.email_edit = !this.email_edit;

  if (this.email_edit) {
    this.email_form.get('email')?.enable();
  } else {
    this.email_form.get('email')?.disable();
  }
  }

  submit_name(){
    console.log('edit profile submitted');
    if(this.name_form.invalid){
      console.log('Form is invalid');
      this.markFormGroupTouched(this.name_form);
      return;
    } else {
      if(this.name_form.value.firstName===this.user_profile_data.firstName&&this.name_form.value.lastName===this.user_profile_data.lastName){
        this.close_name()
        return
      }
      const data = {
        userId: this.userId,
        firstName: this.name_form.value.firstName,
        lastName: this.name_form.value.lastName
      };
      this._userService.editUserProfile_name(data).subscribe({
        next: (response) => {
          console.log('Success response:', response);
          this._showMessage.showSuccessToastr(response.message);
          this.user_profile_data.firstName = data.firstName;
          this.user_profile_data.lastName = data.lastName;
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
      if(this.email_form.value.email===this.user_profile_data.email){
        this.close_email()
        return
      }
      const data = {
        userId: this.userId,
        email: this.email_form.value.email
      };
      this._userService.opt_for_new_email(data).subscribe({
        next:(Response)=>{
          this._showMessage.showSuccessToastr(Response.message)
          if(data.email){
            localStorage.setItem('email',this.user_profile_data.email)
            localStorage.setItem('new_email',data.email)
            localStorage.setItem('role','user_new_email')
          }
          this._router.navigate(['user/verify_otp'])
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

  profileData(){
    this.userId=localStorage.getItem('userId')
    this._userService.getuserDetails({userId:this.userId}).subscribe({
      next:(response)=>{
        this.user_profile_data=response
        this.url=this.user_profile_data.profile_picture
        this.name_form.patchValue({
          firstName: this.user_profile_data.firstName,
          lastName: this.user_profile_data.lastName
        });
        this.email_form.patchValue({
          email: this.user_profile_data.email
        });
      },
      error:(error)=>{
        this._showMessage.showErrorToastr('Error in fetching profile data')
      }
    })
  }
}
