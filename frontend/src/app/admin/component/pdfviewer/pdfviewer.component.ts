import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdfviewer',
  templateUrl: './pdfviewer.component.html',
  styleUrls: ['./pdfviewer.component.css']
})
export class PdfviewerComponent implements OnInit{
  pdfUrl!: SafeResourceUrl;
  // pdfUrl!: string;
  constructor(
    private _route:ActivatedRoute,
    private _sanitizer: DomSanitizer
  ){}

  // ngOnInit(): void {
  //   this._route.queryParams.subscribe(params => {
  //     const unsafeUrl = params['url'];
  //     this.pdfUrl = this._sanitizer.bypassSecurityTrustResourceUrl(decodeURIComponent(unsafeUrl));
  //     console.log('pdfurl:',this.pdfUrl)
  //   });
  // }
  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      const unsafeUrl = params['url'];
      if (unsafeUrl) {
        try {
          const decodedUrl = decodeURIComponent(unsafeUrl);
          this.pdfUrl = this._sanitizer.bypassSecurityTrustResourceUrl(decodedUrl);
          console.log('pdfurl:', decodedUrl);  // Log the URL to check its value
        } catch (error) {
          console.error('Error setting PDF URL:', error);
        }
      }
    });
  }
}
