import { Injectable } from '@angular/core';
import { Product } from '../../models/common.model';
import { MOCK_PRODUCTS } from '../../mocks/products';


@Injectable({
  providedIn: 'root'
})
export class MockService {
  private products: Product[] = MOCK_PRODUCTS;

  getProducts(): Product[] {
    return this.products;
  }

  getActiveProducts(): Product[] {
    return this.products.filter(p => p.status === 'ACTIVE');
  }

  getInactiveProducts(): Product[] {
    return this.products.filter(p => p.status === 'INACTIVE');
  }

  getArchivedProducts(): Product[] {
    return this.products.filter(p => p.status === 'ARCHIVED');
  }

  addProduct(product: Product): void {
    this.products.push({
      ...product,
      id: this.getNextId()
    });
  }

  updateProduct(product: Product): void {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
    }
  }

  deleteProduct(id: number): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  private getNextId(): number {
    return Math.max(...this.products.map(p => p.id)) + 1;
  }
}