import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  fileName = '';
  uploadProgress: number| null;
  uploadSub: Subscription | null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('file', file);

      const upload = this.http
        .post(environment.FILE_UPLOAD_API, formData, {
          reportProgress: true,
          observe: 'events',
        })
        .pipe(finalize(() => this.reset()));

      this.uploadSub = upload.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          let total = Number(event.total);
          this.uploadProgress = Math.round(100 * (event.loaded / total));
          console.log("Upload progress: " + Math.round(100 * (event.loaded / total)) + "%");
        }
      });
    }
  }
  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
    this.fileName = '';
  }
}
