import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-performance-lab',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './performance-lab.component.html',
  styleUrls: ['./performance-lab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceLabComponent {
  counter = signal(0);
  expensiveComputation = computed(() => {
    console.log('Heavy computation...');
    const base = this.counter();
    return base * base * 1337;
  });

  increment() {
    this.counter.update((c) => c + 1);
  }

  reset() {
    this.counter.set(0);
  }
}
