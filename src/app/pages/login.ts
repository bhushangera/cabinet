import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>Cabinet API</h1>
        <p>Google Sheets Integration</p>
        <form (ngSubmit)="login()">
          <input 
            [(ngModel)]="email" 
            name="email" 
            type="email" 
            placeholder="Email"
            required>
          <input 
            [(ngModel)]="password" 
            name="password" 
            type="password" 
            placeholder="Password"
            required>
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <div *ngIf="error" class="error">{{ error }}</div>
        <p class="demo-creds">Demo: demo@cabinet.test / DemoTest@2024</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-box {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
    }
    h1 {
      margin: 0 0 5px 0;
      color: #333;
      text-align: center;
    }
    p {
      text-align: center;
      color: #666;
      margin: 0 0 30px 0;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    input {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    button {
      padding: 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover:not(:disabled) {
      background: #764ba2;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .error {
      color: #e74c3c;
      padding: 10px;
      background: #fadbd8;
      border-radius: 5px;
      font-size: 14px;
    }
    .demo-creds {
      font-size: 12px;
      color: #999;
      margin-top: 20px !important;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  email = 'demo@cabinet.test';
  password = 'DemoTest@2024';
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    this.loading = true;
    this.error = '';
    this.api.login(this.email, this.password).subscribe({
      next: (res) => {
        this.api.setToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Login failed';
        this.loading = false;
      }
    });
  }
}
