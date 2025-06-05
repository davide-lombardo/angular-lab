// performance-lab.component.ts
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, signal, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

interface ListItem {
  id: number;
  name: string;
  complexity: number;
}

@Component({
  selector: 'app-performance-lab',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule,
    MatSliderModule,
    FormsModule,
    MatSelectModule,
    MatTabsModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './performance-lab.component.html',
  styleUrls: ['./performance-lab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceLabComponent {
  // Basic counter example
  counter = signal(0);
  lastComputationTime = signal(0);
  
  expensiveComputation = computed(() => {
    console.log('Heavy computation...');
    const start = performance.now();
    
    // Simulate expensive work
    const base = this.counter();
    let result = base;
    for (let i = 0; i < 100000; i++) {
      result = (result + i * base) % 10000;
    }
    
    // We need to move this outside of the computed function
    setTimeout(() => {
      this.lastComputationTime.set(performance.now() - start);
    }, 0);
    
    return result;
  });
  
  // Performance metrics
  performanceRating = computed(() => {
    const time = this.lastComputationTime();
    if (time === 0) return 'neutral';
    if (time < 10) return 'excellent';
    if (time < 50) return 'good';
    if (time < 100) return 'fair';
    return 'poor';
  });
  
  // List rendering example
  listSize = signal(100);
  listGenerationTime = signal(0);
  
  listItems = computed(() => {
    console.log('Generating list items...');
    const start = performance.now();
    
    const items: ListItem[] = [];
    const size = this.listSize();
    
    for (let i = 0; i < size; i++) {
      items.push({
        id: i,
        name: `Item ${i}`,
        complexity: Math.floor(Math.random() * 100)
      });
    }
    
    // Move this outside of the computed function
    setTimeout(() => {
      this.listGenerationTime.set(performance.now() - start);
    }, 0);
    
    return items;
  });
  
  selectedItemId = signal<number | null>(null);
  
  // Image rendering performance
  imageCount = signal(1);
  imageSize = signal(200);
  imageLoadTime = signal(0);
  
  // Selected example
  currentExample = signal('counter');

  // Log rendering performance
  renderLogs = signal<{timestamp: number, message: string, duration: number}[]>([]);
  totalRenderTime = computed(() => {
    return this.renderLogs().reduce((total, log) => total + log.duration, 0);
  });
  
  constructor() {
    // Set up an effect to log performance metrics and update computation times
    effect(() => {
      // This effect will run whenever any of these values change
      const counter = this.counter();
      const listSize = this.listSize();
      const imageCount = this.imageCount();
      const computation = this.expensiveComputation();
      const items = this.listItems();
      
      // Add log entry
      const now = performance.now();
      this.renderLogs.update(logs => {
        // Keep only the last 20 logs to avoid memory issues
        const newLogs = [...logs];
        if (newLogs.length > 20) {
          newLogs.shift();
        }
        newLogs.push({
          timestamp: now,
          message: `Updated: counter=${counter}, listSize=${listSize}, imageCount=${imageCount}`,
          duration: Math.random() * 20 // This would ideally be the actual render time
        });
        return newLogs;
      });
    });
  }

  // Counter methods
  increment() {
    const start = performance.now();
    this.counter.update((c) => c + 1);
    // Using setTimeout to ensure this runs after the computed value has been recalculated
    setTimeout(() => {
      this.lastComputationTime.set(performance.now() - start);
    }, 0);
  }

  reset() {
    this.counter.set(0);
    this.lastComputationTime.set(0);
  }
  
  // List methods
  updateListSize(event: Event) {
    const input = event.target as HTMLInputElement;
    const newSize = parseInt(input.value, 10);
    if (!isNaN(newSize) && newSize >= 0 && newSize <= 10000) {
      const start = performance.now();
      this.listSize.set(newSize);
      setTimeout(() => {
        this.listGenerationTime.set(performance.now() - start);
      }, 0);
    }
  }
  
  selectItem(id: number) {
    this.selectedItemId.set(id);
  }
  
  // Image methods
  updateImageCount(event: Event) {
    const input = event.target as HTMLInputElement;
    const newCount = parseInt(input.value, 10);
    
    // Limit to prevent browser crashes
    if (!isNaN(newCount) && newCount >= 0 && newCount <= 500) {
      const start = performance.now();
      this.imageCount.set(newCount);
      setTimeout(() => {
        this.imageLoadTime.set(performance.now() - start);
      }, 0);
    }
  }
  
  // Example selection
  setExample(example: string) {
    this.currentExample.set(example);
  }
  
  // Performance helpers
  getPerformanceClass(time: number): string {
    if (time === 0) return 'neutral';
    if (time < 10) return 'excellent';
    if (time < 50) return 'good';
    if (time < 100) return 'fair';
    return 'poor';
  }

  getPerformanceIcon(rating: string): string {
    switch (rating) {
      case 'excellent': return 'sentiment_very_satisfied';
      case 'good': return 'sentiment_satisfied';
      case 'fair': return 'sentiment_neutral';
      case 'poor': return 'sentiment_dissatisfied';
      default: return 'help_outline';
    }
  }
  
  // Track by function for list rendering
  trackByItemId(index: number, item: ListItem): number {
    return item.id;
  }
  
  resetAllMetrics() {
    this.counter.set(0);
    this.listSize.set(100);
    this.imageCount.set(1);
    this.renderLogs.set([]);
    this.lastComputationTime.set(0);
    this.listGenerationTime.set(0);
    this.imageLoadTime.set(0);
  }
}