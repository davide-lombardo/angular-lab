import { CommonModule } from '@angular/common';
import { Component, computed, signal, effect, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CounterStats, UserProfile } from '../../models/common.model';


@Component({
  selector: 'app-signals-lab',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatSlideToggleModule,
  ],
  templateUrl: './signals-lab.component.html',
  styleUrls: ['./signals-lab.component.scss'],
})
export class SignalsLabComponent {
  // Counter Example with Enhanced Features
  count = signal(0);
  countHistory = signal<number[]>([]);
  doubleCount = computed(() => this.count() * 2);
  counterStats: Signal<CounterStats> = computed(() => {
    const history = this.countHistory();
    return {
      total: history.reduce((sum, curr) => sum + curr, 0),
      average: history.length
        ? history.reduce((sum, curr) => sum + curr, 0) / history.length
        : 0,
      lastUpdated: new Date(),
    };
  });

  // Todo List Example with Enhanced Features
  todos = signal<string[]>([]);
  todoCount = computed(() => this.todos().length);
  todoInput = new FormControl('');
  completedTodos = signal<Set<number>>(new Set());
  activeTodosCount = computed(
    () => this.todos().length - this.completedTodos().size
  );

  // User Profile Example with Enhanced Features
  userProfile = signal<UserProfile>({
    name: '',
    age: 0,
    preferences: {
      theme: 'light',
      notifications: true,
    },
  });
  nameInput = new FormControl('');
  ageInput = new FormControl<number | null>(null);
  isAdult = computed(() => this.userProfile().age >= 18);
  lastUpdated = signal<Date>(new Date());
  themePreference = computed(() => this.userProfile().preferences.theme);

  constructor() {
    // Effect for form value changes
    effect(() => {
      const name = this.nameInput.value || '';
      const age = this.ageInput.value || 0;

      if (name !== this.userProfile().name || age !== this.userProfile().age) {
        this.updateProfile(name, age);
      }
    });

    // Effect for theme changes
    effect(() => {
      const theme = this.themePreference();
      document.body.classList.toggle('dark-theme', theme === 'dark');
    });
  }

  // Counter methods
  increment() {
    this.count.update((count) => count + 1);
    this.updateCountHistory();
  }

  decrement() {
    this.count.update((count) => count - 1);
    this.updateCountHistory();
  }

  private updateCountHistory() {
    this.countHistory.update((history) => [...history, this.count()].slice(-5));
  }

  // Todo methods
  addTodo() {
    if (this.todoInput.value?.trim()) {
      this.todos.update((todos) => [...todos, this.todoInput.value!]);
      this.todoInput.reset();
    }
  }

  removeTodo(index: number) {
    this.todos.update((todos) => todos.filter((_, i) => i !== index));
    this.completedTodos.update((completed) => {
      const newCompleted = new Set(completed);
      newCompleted.delete(index);
      return newCompleted;
    });
  }

  toggleTodoComplete(index: number) {
    this.completedTodos.update((completed) => {
      const newCompleted = new Set(completed);
      if (completed.has(index)) {
        newCompleted.delete(index);
      } else {
        newCompleted.add(index);
      }
      return newCompleted;
    });
  }

  // User Profile methods
  private updateProfile(name: string, age: number) {
    this.userProfile.update((profile) => ({
      ...profile,
      name,
      age,
    }));
    this.lastUpdated.set(new Date());
  }

  toggleTheme() {
    this.userProfile.update((profile) => ({
      ...profile,
      preferences: {
        ...profile.preferences,
        theme: profile.preferences.theme === 'light' ? 'dark' : 'light',
      },
    }));
  }

  toggleNotifications() {
    this.userProfile.update((profile) => ({
      ...profile,
      preferences: {
        ...profile.preferences,
        notifications: !profile.preferences.notifications,
      },
    }));
  }
}
