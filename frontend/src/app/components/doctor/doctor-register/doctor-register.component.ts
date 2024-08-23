import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { namePattern,mobilepattern,passwordPattern,experiencePattern,consultationFeePattern } from '../../shared/regular_expressions/regular_expressions';
import { ImageUploadService } from 'src/app/services/image-upload.service';

@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.css']
})
export class DoctorRegisterComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _showMessage: MessageToasterService,
    private _doctorService: DoctorService,
    private _imageuploadService:ImageUploadService
  ) { }

  registration_form!: FormGroup
  title = 'Doctor registration'
  specialization: any = []
  url!:any

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnInit() {
    this.doctor_registration()
    this.getSpecialization()
  }

  doctor_registration() {
    this.registration_form = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(namePattern)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(namePattern)]],
      email: ['', [Validators.required, Validators.email]],
      contactno: ['', [Validators.required, Validators.pattern(mobilepattern)]],
      profile_picture:[null, Validators.required],
      specialization: ['', Validators.required],
      current_working_hospital_address: ['', [Validators.required, Validators.maxLength(150)]],
      experience: ['', [Validators.required, Validators.pattern(experiencePattern)]],
      consultation_fee: ['', [Validators.required, Validators.pattern(consultationFeePattern)]],
      identity_proof_type: ['', Validators.required],
      identity_proof: [null, Validators.required],
      doctors_liscence: [null, Validators.required],
      qualification_certificate: [[], Validators.required],
      experience_certificate: [[], Validators.required],
      password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
      confirm_password: ['', Validators.required]
    })
  }
  getSpecialization() {
    this._doctorService.getSpecialization().subscribe({
      next: (Response) => {
        this.specialization = Response.specialization
      }
    })
  }

  onFileSelected(event: Event, controlName: string): void {
    const inputFile = (event.target as HTMLInputElement);
    if (inputFile.files && inputFile.files.length > 0) {
      if(controlName==='profile_picture'){
        // const file=Array.from(inputFile.files).filter(file => file.type === '.jpg, .jpeg, .png');
        const file= Array.from(inputFile.files).find(file => 
          file.type === 'image/jpeg' || 
          file.type === 'image/jpg' || 
          file.type === 'image/png'
        );
        if (file) {
          this.registration_form.patchValue({
            profile_picture: file
          });
        } else {
          this.registration_form.get('controlName')?.reset();
          this._showMessage.showErrorToastr('Please upload .jpg, .jpeg, or .png images only');
        }
      }else{
        const file = Array.from(inputFile.files).filter(file => file.type === 'application/pdf');
        // Check if the selected file is a PDF
        if (file.length > 0) {
          if (controlName === 'identity_proof') {
            this.registration_form.patchValue({
              identity_proof: file[0]
            });
          } else if (controlName === 'experience_certificate') {
            this.registration_form.patchValue({
              experience_certificate: file
            });
          } else if (controlName === 'qualification_certificate') {
            this.registration_form.patchValue({
              qualification_certificate: file
            });
          } else if (controlName === 'doctors_liscence') {
            this.registration_form.patchValue({
              doctors_liscence: file[0]
            });
          }
        } else {
          this._showMessage.showErrorToastr('upload pdf file only!!')
        }
      }
    }
  }

  onsubmit() {
    const password = this.registration_form.value.password;
    if (this.registration_form.invalid) {
      this.markFormGroupTouched(this.registration_form);
      return;
    } else {
      const confirmPassword = this.registration_form.value.confirm_password;
      if (password !== confirmPassword) {
        this._showMessage.showErrorToastr('Passwords do not match');
        return;
      } 
  
      const formData = new FormData();
      const uploadPromises: Promise<any>[] = []; // To store all upload tasks
  
      const profile_picture = this.registration_form.get('profile_picture')?.value;
      const identity_proof = this.registration_form.get('identity_proof')?.value;
      const doctors_liscence = this.registration_form.get('doctors_liscence')?.value;
      const qualification_certificate = this.registration_form.get('qualification_certificate')?.value;
      const experience_certificate = this.registration_form.get('experience_certificate')?.value;
  
      if (profile_picture) {
        const profileUpload$ = this._imageuploadService.uploadImage(profile_picture, 'medilink24').toPromise();
        uploadPromises.push(profileUpload$.then((imageUrl: string) => {
          console.log('Image uploaded successfully:', imageUrl);
          // Apply transformation to crop or pad image to 200x200
          const transformedUrl = this.applyTransformation(imageUrl, 200, 200);
          console.log('Transformed Image URL:', transformedUrl);
          this.registration_form.patchValue({
            profile_picture: transformedUrl
          });
        }));
      }
  
      if (identity_proof) {
        const identityproofUpload$ = this._imageuploadService.uploadImage(identity_proof, 'medilink24').toPromise();
        uploadPromises.push(identityproofUpload$.then((fileUrl: string) => {
          console.log('Identity proof uploaded successfully:', fileUrl);
          this.registration_form.patchValue({
            identity_proof: fileUrl
          });
        }));
      }
  
      if (doctors_liscence) {
        const doctorLiscenseUpload$ = this._imageuploadService.uploadImage(doctors_liscence, 'medilink24').toPromise();
        uploadPromises.push(doctorLiscenseUpload$.then((fileUrl: string) => {
          console.log('Doctor’s license uploaded successfully:', fileUrl);
          this.registration_form.patchValue({
            doctors_liscence: fileUrl
          });
        }));
      }
  
      if (qualification_certificate) {
        qualification_certificate.forEach((file: File) => {
          const qualificationCertificateUpload$ = this._imageuploadService.uploadImage(file, 'medilink24').toPromise();
          uploadPromises.push(qualificationCertificateUpload$.then((fileUrl: string) => {
            console.log('Qualification certificate uploaded successfully:', fileUrl);
            const existingFiles = this.registration_form.get('qualification_certificate')?.value || [];
            existingFiles.push(fileUrl);
            this.registration_form.patchValue({
              qualification_certificate: existingFiles
            });
          }));
        });
      }
  
      if (experience_certificate) {
        experience_certificate.forEach((file: File) => {
          const experienceCertificateUpload$ = this._imageuploadService.uploadImage(file, 'medilink24').toPromise();
          uploadPromises.push(experienceCertificateUpload$.then((fileUrl: string) => {
            console.log('Experience certificate uploaded successfully:', fileUrl);
            const existingFiles = this.registration_form.get('experience_certificate')?.value || [];
            existingFiles.push(fileUrl);
            this.registration_form.patchValue({
              experience_certificate: existingFiles
            });
          }));
        });
      }
  
      Promise.all(uploadPromises).then(() => {
        console.log('All uploads completed.');
        Object.keys(this.registration_form.controls).forEach(key => {
          const control = this.registration_form.get(key);
          if (control) {
            if (key === 'qualification_certificate' || key === 'experience_certificate') {
              control.value.forEach((file: File) => formData.append(key, file));
            } else {
              formData.append(key, control.value);
            }
          }
        });
        console.log('formdata:', formData);
  
        // Call the doctor service
        this._doctorService.doctorRegister(formData).subscribe({
          next: (Response) => {
            localStorage.setItem('email', this.registration_form.get('email')?.value);
            localStorage.setItem('role', 'doctorRegistration');
            this._router.navigate(['/doctor/verify_otp']);
            this._showMessage.showSuccessToastr('Registered successfully');
          },
          error: (error) => {
            this._showMessage.showErrorToastr(error.error.message);
          }
        });
      }).catch((error) => {
        this._showMessage.showErrorToastr('Error uploading files');
      });
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

  close() {
    this._router.navigate(['/doctor/login'])
  }

}
