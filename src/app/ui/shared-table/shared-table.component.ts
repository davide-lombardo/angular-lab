import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

@Component({
  selector: 'app-shared-table',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
})
export class SharedTableComponent implements OnInit {
  @Input({ required: false }) showTabs = true;
  @Input({ required: false }) showActions = true;
  @Input({ required: false }) showSearch = true;
  @Input({ required: false }) enablePagination = false;

  grids: Record<string, GridApi> = {};

  activeProducts: Product[] = [];
  inactiveProducts: Product[] = [];
  archivedProducts: Product[] = [];

  activeFilter = '';
  inactiveFilter = '';
  archivedFilter = '';

    // Declare filters object to hold filter values
    filters: Record<string, string> = {
      active: '',
      inactive: '',
      archived: ''
    };

  baseColumnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'code', headerName: 'Code' },
    { field: 'name', headerName: 'Name' },
    { field: 'category', headerName: 'Category' },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        const status = params.value;
        let color = '';
        switch (status) {
          case 'ACTIVE':
            color = 'green';
            break;
          case 'INACTIVE':
            color = 'orange';
            break;
          case 'ARCHIVED':
            color = 'gray';
            break;
        }
        return `<span style="color: ${color}; font-weight: bold;">${status}</span>`;
      },
    },
  ];

  columnDefs: ColDef[] = [];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
  };

  ngOnInit() {
    this.loadProducts();
    this.setUpColumns();
  }

  setUpColumns() {
    this.columnDefs = [...this.baseColumnDefs];

    if (this.showActions) {
      this.columnDefs.push({
        headerName: 'Actions',
        width: 120,
        cellRenderer: () => `
          <button class="action-btn edit"><mat-icon>edit</mat-icon></button>
          <button class="action-btn delete"><mat-icon>delete</mat-icon></button>
        `,
        onCellClicked: (params: any) => {
          const target = params.event.target;
          if (target.closest('.edit')) this.editProduct(params.data);
          if (target.closest('.delete')) this.deleteProduct(params.data);
        },
      });
    }
  }

  loadProducts() {
    const allProducts: Product[] = [
      { id: 1, code: 'A001', name: 'Product A', category: 'Accessories', quantity: 10, status: 'ACTIVE' },
      { id: 2, code: 'B002', name: 'Product B', category: 'Electronics', quantity: 5, status: 'INACTIVE' },
      { id: 3, code: 'C003', name: 'Product C', category: 'Fitness', quantity: 0, status: 'ARCHIVED' },
      { id: 4, code: 'D004', name: 'Product D', category: 'Clothing', quantity: 8, status: 'ACTIVE' },
    ];

    this.activeProducts = allProducts.filter(p => p.status === 'ACTIVE');
    this.inactiveProducts = allProducts.filter(p => p.status === 'INACTIVE');
    this.archivedProducts = allProducts.filter(p => p.status === 'ARCHIVED');
  }

  onGridReady(event: GridReadyEvent, type: 'active' | 'inactive' | 'archived') {
    this.grids[type] = event.api;
    this.onFilterTextBoxChanged(type);
  }

  onFilterTextBoxChanged(type: 'active' | 'inactive' | 'archived') {
    const grid = this.grids[type];
    if (!grid) return;

    const filters = {
      active: this.activeFilter,
      inactive: this.inactiveFilter,
      archived: this.archivedFilter,
    };

    grid.setGridOption('quickFilterText', filters[type]);
  }

  addProduct() {
    console.log('Add new product');
  }

  editProduct(product: Product) {
    console.log('Edit product:', product);
  }

  deleteProduct(product: Product) {
    console.log('Delete product:', product);
  }

  onTabChange(event: { index: number; tab: any }) {
    const labels = ['active', 'inactive', 'archived'];
    const type = labels[event.index] as 'active' | 'inactive' | 'archived';
    this.onFilterTextBoxChanged(type);
  }
}
