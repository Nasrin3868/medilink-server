import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private _cloudinaryUrl = `https://api.cloudinary.com/v1_1/dyemxd31x/image/upload`;
  constructor(private _http: HttpClient) {}

  uploadImage(file: File, uploadPreset: string): Observable<any> {
    console.log('uoload preset:',uploadPreset);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('cloud_name','dyemxd31x')

    const headers = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data' // Usually not needed as FormData sets the appropriate headers
    });

    return this._http.post<{ url: string }>(this._cloudinaryUrl, formData, { headers })
      .pipe(
        map(response => {
          console.log("response:",response,response.url);
          return response.url
          
        }),
        catchError(error => {
          console.error('Error uploading image:', error);
          return throwError(error); 
        })
      );
  }

}
