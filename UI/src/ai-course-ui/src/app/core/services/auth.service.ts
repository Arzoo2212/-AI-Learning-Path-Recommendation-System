import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  userDTO: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  roleName: string;
  experienceLevel: number;
  careerGoal: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = signal(false);

  constructor() {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      this._currentUser.set(JSON.parse(stored));
      this.isLoggedIn.set(true);
    }
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/login`, { email, password }).pipe(
      tap(res => {
        // Store token immediately so the subsequent getUser call is authenticated
        localStorage.setItem('auth_token', res.token);
        this.isLoggedIn.set(true);
      }),
      switchMap(res =>
        // Fetch full user profile to get all fields (e.g. roleName) that login response may omit
        this.http.get<ApiResponse<User>>(`${environment.apiUrl}/User/${res.userDTO.id}`).pipe(
          map(userRes => userRes.data),
          catchError(() => {
            // If the full fetch fails, fall back to the login response data
            return [res.userDTO];
          })
        )
      ),
      tap(user => {
        localStorage.setItem('auth_user', JSON.stringify(user));
        this._currentUser.set(user);
      }),
      catchError(err => {
        throw err;
      })
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<{ data: User; message: string; success: boolean }>(`${environment.apiUrl}/Auth/register`, request);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this._currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  refreshUser(user: User): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
    this._currentUser.set(user);
  }
}
