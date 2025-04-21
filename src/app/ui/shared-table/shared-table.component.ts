import { CommonModule, NgIf, TitleCasePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { FilterFormType, Product } from '../../models/common.model';
import { MockService } from '../../services/mocks/mocks.service';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';

type TabType = 'active' | 'inactive' | 'archived';

@Component({
  selector: 'app-shared-table',
  standalone: true,
  imports: [
    TitleCasePipe,
    AgGridModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
})
export class SharedTableComponent {
  // Feature flags
  showTabs = input(true);
  showActions = input(true);
  showSearch = input(true);
  enablePagination = input(false);
  pageSize = input(10);
  enableExport = input(false);
  enableColumnResize = input(true);
  enableSorting = input(true);
  enableFiltering = input(true);
  enableHeaderFilters = input(false);
  rowSelection = input<'single' | 'multiple'>('multiple');

  // UI Labels
  title = input('Products');
  searchPlaceholder = input('Search products...');
  addButtonLabel = input('Add');
  searchLabel = input('Search');
  activeTabLabel = input('Active Products');
  inactiveTabLabel = input('Inactive Products');
  archivedTabLabel = input('Archived Products');

  // Services
  private mockService = inject(MockService);
  private fb = inject(FormBuilder);

  // State management
  grids: Record<TabType, GridApi> = {} as Record<TabType, GridApi>;
  activeItems = signal<Product[]>([]);
  inactiveItems = signal<Product[]>([]);
  archivedItems = signal<Product[]>([]);
  filters = signal<Record<TabType, string>>({
    active: '',
    inactive: '',
    archived: '',
  });
  columnDefs = signal<ColDef[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Forms
  filterForms = {
    active: this.fb.group({ search: [''] }),
    inactive: this.fb.group({ search: [''] }),
    archived: this.fb.group({ search: [''] }),
  };

  // Grid configuration
  get defaultColDef(): ColDef {
    return {
      flex: 1,
      minWidth: 100,
      resizable: this.enableColumnResize(),
      sortable: this.enableSorting(),
      filter: this.enableHeaderFilters() ? 'agTextColumnFilter' : false,
      floatingFilter: this.enableHeaderFilters(),
    };
  }

  readonly baseColumnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'code', headerName: 'Code' },
    { field: 'name', headerName: 'Name' },
    { field: 'category', headerName: 'Category' },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    this.createStatusColumn(),
  ];

  constructor() {
    effect(() => {
      this.loadItems();
      this.setUpColumns();
      this.setupFilterSubscriptions();
    });
  }

  setUpColumns() {
    const newColumns = [...this.baseColumnDefs];

    if (this.showActions()) {
      newColumns.push({
        headerName: 'Actions',
        width: 120,
        cellRenderer: ActionButtonsComponent,
        cellRendererParams: {
          context: {
            componentParent: this,
          },
        },
      });
    }

    this.columnDefs.set(newColumns);
  }

  loadItems() {
    this.activeItems.set(this.mockService.getActiveProducts());
    this.inactiveItems.set(this.mockService.getInactiveProducts());
    this.archivedItems.set(this.mockService.getArchivedProducts());
  }

  private setupFilterSubscriptions() {
    (
      Object.entries(this.filterForms) as [
        FilterFormType,
        FormGroup<{ search: FormControl<string> }>
      ][]
    ).forEach(([type, form]) => {
      const searchControl = form.get('search');
      if (searchControl) {
        searchControl.valueChanges.subscribe((value: string) => {
          this.filters.update((current) => ({
            ...current,
            [type]: value || '',
          }));
          this.onFilterTextBoxChanged(type);
        });
      }
    });
  }

  private createStatusColumn(): ColDef {
    return {
      field: 'status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        const colors: Record<string, string> = {
          ACTIVE: 'green',
          INACTIVE: 'orange',
          ARCHIVED: 'gray',
        };
        const color = colors[params.value] || '';
        return `<span style="color: ${color}; font-weight: bold;">${params.value}</span>`;
      },
    };
  }

  updateFilter(type: 'active' | 'inactive' | 'archived', event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target?.value ?? '';

    this.filters.update((current) => ({
      ...current,
      [type]: value,
    }));
    this.onFilterTextBoxChanged(type);
  }

  exportToExcel() {
    if (!this.enableExport()) return;
    const currentGrid = this.getCurrentGrid();
    if (currentGrid) {
      currentGrid.exportDataAsCsv({
        fileName: `${this.title()}_export_${new Date().toISOString()}.csv`,
      });
    }
  }

  private getCurrentGrid(): GridApi | null {
    const activeTab = this.getCurrentTab();
    return this.grids[activeTab] || null;
  }

  private getCurrentTab(): TabType {
    // Implementation depends on how you track the current tab
    return 'active'; // Default to active
  }

  // Event handlers
  onGridReady(event: GridReadyEvent, type: 'active' | 'inactive' | 'archived') {
    this.grids[type] = event.api;
    this.onFilterTextBoxChanged(type);
  }

  onFilterTextBoxChanged(type: 'active' | 'inactive' | 'archived') {
    const grid = this.grids[type];
    if (!grid) return;

    const currentFilters = this.filters();
    grid.setGridOption('quickFilterText', currentFilters[type]);
  }

  onTabChange(event: { index: number; tab: any }) {
    const labels = ['active', 'inactive', 'archived'];
    const type = labels[event.index] as 'active' | 'inactive' | 'archived';
    this.onFilterTextBoxChanged(type);
  }

  // CRUD operations
  addItem() {
    console.log('Add new item');
  }

  editItem(item: Product) {
    console.log('Edit item:', item);
  }

  deleteItem(item: Product) {
    console.log('Delete item:', item);
  }
}
