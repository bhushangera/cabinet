import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5070/api/v1';
  private token: string = '';

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token') || '';
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  getAuthStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/google-sheets/auth/status`, {
      headers: this.getHeaders()
    });
  }

  createSheet(projectId: string, sheetName: string, columns?: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/google-sheets/create`, 
      { projectId, sheetName, columns }, 
      { headers: this.getHeaders() }
    );
  }

  syncData(projectId: string, sheetId: string, data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/google-sheets/sync`, 
      { projectId, sheetId, data }, 
      { headers: this.getHeaders() }
    );
  }

  listSheets(projectId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/google-sheets/projects/${projectId}`, {
      headers: this.getHeaders()
    });
  }

  updateSheet(sheetId: string, action: string, data: any[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/google-sheets/${sheetId}`, 
      { action, data }, 
      { headers: this.getHeaders() }
    );
  }

  deleteSheet(sheetId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/google-sheets/${sheetId}`, {
      headers: this.getHeaders()
    });
  }

  getHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
