import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiDelay = 2000; 

  constructor(private http: HttpClient) {}

  public get currentUserValue() { return this.currentUserSubject.value; }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login?delay=${this.apiDelay}`, credentials)
      .pipe(map(response => {
        if (response && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
        return response;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getRecords(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/records/${userId}?delay=${this.apiDelay}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users?delay=${this.apiDelay}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/users?delay=${this.apiDelay}`, user);
  }
}
