import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table'; 

@Component({
  selector: 'app-primeng-lab',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './primeng-lab.component.html',
  styleUrls: ['./primeng-lab.component.scss']
})
export class PrimeNgLabComponent {
  products = signal([
    { id: 1, name: 'Apple', category: 'Fruit', price: 1.2 },
    { id: 2, name: 'Banana', category: 'Fruit', price: 0.8 },
    { id: 3, name: 'Carrot', category: 'Vegetable', price: 1.0 }
  ]);

  count = signal(0);

  increment() {
    this.count.update(n => n + 1);
  }

  columns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'price', header: 'Price' }
  ];
}
