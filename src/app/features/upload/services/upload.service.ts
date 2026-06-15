import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly url = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/upload - multipart with progress events.
   * reportProgress: true gives us HttpEventType.UploadProgress events.
   */
  uploadPdf(file: File, chunkSize = 500, overlap = 50): Observable<HttpEvent<unknown>> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', this.url, formData, {
      reportProgress: true,
      params: {
        chunkSize: chunkSize.toString(),
        overlap: overlap.toString()
      }
    });

    return this.http.request(req);
  }
}
