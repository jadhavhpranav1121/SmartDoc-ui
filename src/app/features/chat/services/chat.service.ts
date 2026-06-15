import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AskRequest, AskResponse } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** POST /api/ask */
  ask(request: AskRequest): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.baseUrl}/ask`, request);
  }

  /** DELETE /api/conversation/:sessionId */
  clearSession(sessionId: string): Observable<{ status: string; sessionId: string }> {
    return this.http.delete<{ status: string; sessionId: string }>(
      `${this.baseUrl}/conversation/${sessionId}`
    );
  }
}
