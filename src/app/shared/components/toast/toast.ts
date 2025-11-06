// toast.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './../../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent {
  private toastService = inject(ToastService);

  toasts = this.toastService.toasts;

  getToastConfig(type: string) {
    const configs = {
      success: {
        bgClass: 'bg-gradient-to-r from-green-500 to-emerald-500',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      error: {
        bgClass: 'bg-gradient-to-r from-red-500 to-pink-500',
        icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      warning: {
        bgClass: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      },
      info: {
        bgClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    };
    return configs[type as keyof typeof configs];
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }
}
