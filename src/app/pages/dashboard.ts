import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <header>
        <h1>Cabinet API</h1>
        <button (click)="logout()">Logout</button>
      </header>
      
      <div class="container">
        <div class="panel">
          <h2>Create New Sheet</h2>
          <div class="form-group">
            <input [(ngModel)]="newProject" placeholder="Project ID" (keyup.enter)="createSheet()">
            <input [(ngModel)]="newSheetName" placeholder="Sheet Name" (keyup.enter)="createSheet()">
            <button (click)="createSheet()" [disabled]="loading">
              {{ loading ? 'Creating...' : 'Create Sheet' }}
            </button>
          </div>
          <div *ngIf="createSuccess" class="success">Sheet created!</div>
          <div *ngIf="error" class="error">{{ error }}</div>
        </div>

        <div class="panel">
          <h2>Your Sheets</h2>
          <div class="form-group">
            <input [(ngModel)]="projectId" placeholder="Project ID" (keyup.enter)="listSheets()">
            <button (click)="listSheets()" [disabled]="loading">List Sheets</button>
          </div>
          <div *ngIf="sheets.length" class="sheets-list">
            <div *ngFor="let sheet of sheets" class="sheet-item">
              <div>
                <strong>{{ sheet.name }}</strong>
                <small>{{ sheet.sheetId }}</small>
              </div>
              <div class="sheet-actions">
                <span *ngIf="sheet.rowCount">{{ sheet.rowCount }} rows</span>
                <button (click)="deleteSheet(sheet.sheetId)" class="delete">Delete</button>
              </div>
            </div>
          </div>
          <p *ngIf="!sheets.length && searched" class="no-data">No sheets found</p>
        </div>

        <div class="panel">
          <h2>API Status</h2>
          <button (click)="checkHealth()" [disabled]="loading">Check Health</button>
          <div *ngIf="health" class="health-status">
            <p><strong>Status:</strong> {{ health.status }}</p>
            <p><strong>Database:</strong> {{ health.database }}</p>
            <p><strong>Version:</strong> {{ health.version }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f5f5f5;
    }
    header {
      background: #667eea;
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    header h1 {
      margin: 0;
    }
    header button {
      padding: 8px 16px;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .container {
      max-width: 1200px;
      margin: 30px auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      padding: 0 20px;
    }
    .panel {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .panel h2 {
      margin: 0 0 20px 0;
      color: #333;
    }
    .form-group {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }
    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }
    button {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
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
    .delete {
      background: #e74c3c;
      padding: 5px 10px;
      font-size: 12px;
    }
    .delete:hover {
      background: #c0392b;
    }
    .sheets-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .sheet-item {
      padding: 12px;
      background: #f9f9f9;
      border-left: 4px solid #667eea;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sheet-item strong {
      display: block;
      margin-bottom: 5px;
    }
    .sheet-item small {
      color: #999;
      font-size: 12px;
    }
    .sheet-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .health-status {
      background: #f0f7ff;
      padding: 15px;
      border-radius: 5px;
      margin-top: 15px;
    }
    .health-status p {
      margin: 8px 0;
      font-size: 14px;
    }
    .success {
      color: #27ae60;
      padding: 10px;
      background: #d5f4e6;
      border-radius: 5px;
      margin-top: 10px;
    }
    .error {
      color: #e74c3c;
      padding: 10px;
      background: #fadbd8;
      border-radius: 5px;
      margin-top: 10px;
    }
    .no-data {
      color: #999;
      text-align: center;
      padding: 20px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  newProject = '';
  newSheetName = '';
  projectId = '';
  sheets: any[] = [];
  health: any = null;
  loading = false;
  error = '';
  createSuccess = false;
  searched = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.checkHealth();
  }

  createSheet() {
    if (!this.newProject || !this.newSheetName) return;
    this.loading = true;
    this.error = '';
    this.createSuccess = false;
    this.api.createSheet(this.newProject, this.newSheetName).subscribe({
      next: (res) => {
        this.createSuccess = true;
        this.newProject = '';
        this.newSheetName = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to create sheet';
        this.loading = false;
      }
    });
  }

  listSheets() {
    if (!this.projectId) return;
    this.loading = true;
    this.searched = true;
    this.api.listSheets(this.projectId).subscribe({
      next: (res) => {
        this.sheets = res.sheets || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to list sheets';
        this.sheets = [];
        this.loading = false;
      }
    });
  }

  deleteSheet(sheetId: string) {
    if (confirm('Delete this sheet?')) {
      this.api.deleteSheet(sheetId).subscribe({
        next: () => {
          this.listSheets();
        },
        error: (err) => {
          this.error = err.error?.error || 'Failed to delete sheet';
        }
      });
    }
  }

  checkHealth() {
    this.api.getHealth().subscribe({
      next: (res) => {
        this.health = res;
      },
      error: (err) => {
        this.error = 'API health check failed';
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
