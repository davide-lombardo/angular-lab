import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-signals-lab',
  imports: [CommonModule],
  templateUrl: './signals-lab.component.html',
  styleUrl: './signals-lab.component.scss'
})
export class SignalsLabComponent {
  count = signal(0);
  increment() {
    this.count.update(n => n + 1);
  }

  decrement() {
    this.count.update(n => n - 1);
  }

  doubleCount = computed(() => this.count() * 2);
}
