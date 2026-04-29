import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  template: `
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" placeholder="Search courses, skills..."
            class="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"/>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- User -->
        <div class="flex items-center">
          <button (click)="logout()" class="text-sm font-medium text-gray-700 hover:text-red-500 transition-colors">
            Sign out
          </button>
        </div>
      </div>
    </header>
  `,
})
export class Topbar {
  auth = inject(AuthService);
  private router = inject(Router);

  initials(): string {
    const name = this.auth.currentUser()?.name ?? '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
