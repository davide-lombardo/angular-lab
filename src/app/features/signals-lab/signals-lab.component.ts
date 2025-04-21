import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

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
    MatListModule
  ],
  templateUrl: './signals-lab.component.html',
  styleUrls: ['./signals-lab.component.scss']
})
export class SignalsLabComponent {
  // Counter signals
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  // Todo list signals
  todos = signal<string[]>([]);
  todoCount = computed(() => this.todos().length);
  todoInput = new FormControl('');

  increment() {
    this.count.update(count => count + 1);
  }

  decrement() {
    this.count.update(count => count - 1);
  }

  addTodo() {
    if (this.todoInput.value?.trim()) {
      this.todos.update(todos => [...todos, this.todoInput.value!]);
      this.todoInput.reset();
    }
  }

  removeTodo(index: number) {
    this.todos.update(todos => todos.filter((_, i) => i !== index));
  }
}