import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
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

    const params = new HttpParams()
      .set('chunkSize', chunkSize.toString())
      .set('overlap', overlap.toString());

    const req = new HttpRequest('POST', this.url, formData, {
      reportProgress: true,
      params
    });

    return this.http.request(req);
  }
}
