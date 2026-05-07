import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkillGap } from '../models/skill-gap.model';

@Injectable({
  providedIn: 'root'
})
export class SkillGapService {

  private apiUrl = 'https://localhost:7036/api/skillgap';

  constructor(private http: HttpClient) { }

  getSkillGap(userId: number): Observable<SkillGap[]> {
    return this.http.get<SkillGap[]>(
      `${this.apiUrl}/${userId}`
    );
  }
}