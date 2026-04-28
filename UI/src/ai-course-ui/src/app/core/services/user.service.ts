import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User, UserSkillResponseDTO, UserSkillDTO } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

export interface UpdateUserRequest {
  name: string;
  email: string;
  roleName: string;
  experienceLevel: number;
  careerGoal: string;
}

export interface AddUserSkillRequest {
  userId: number;
  skills: UserSkillDTO[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getUser(userId: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.base}/User/${userId}`).pipe(
      map(res => res.data)
    );
  }

  updateUser(userId: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.base}/User/${userId}`, request).pipe(
      map(res => res.data)
    );
  }

  getUserSkills(userId: number): Observable<UserSkillResponseDTO> {
    return this.http.get<ApiResponse<UserSkillResponseDTO>>(`${this.base}/UserSkills/${userId}`).pipe(
      map(res => res.data)
    );
  }

  addUserSkills(request: AddUserSkillRequest): Observable<string> {
    return this.http.post<ApiResponse<string>>(`${this.base}/UserSkills`, request).pipe(
      map(res => res.data)
    );
  }
}
