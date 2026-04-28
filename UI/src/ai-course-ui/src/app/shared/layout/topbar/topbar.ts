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
        <!-- Notifications -->
        <button class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- User -->
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">{{ auth.currentUser()?.name }}</p>
            <p class="text-xs text-gray-500">{{ auth.currentUser()?.roleName }}</p>
          </div>
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
            {{ initials() }}
          </div>
          <button (click)="logout()" class="text-xs text-gray-500 hover:text-red-500 transition-colors">
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
