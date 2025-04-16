import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface Car {
  make: string;
  model: string;
  price: number;
}

import { themeBalham } from 'ag-grid-community';

@Component({
  selector: 'app-grid-lab',
  imports: [CommonModule, AgGridAngular],
  templateUrl: './grid-lab.component.html',
  styleUrls: ['./grid-lab.component.scss'],
})
export class GridLabComponent {
  public theme = themeBalham;

  columnDefs: ColDef<Car>[] = [
    { field: 'make', sortable: true, filter: true },
    { field: 'model', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
  ];

  rowData = [
    { make: 'Toyota', model: 'Corolla', price: 25000 },
    { make: 'Ford', model: 'Focus', price: 20000 },
    { make: 'BMW', model: '3 Series', price: 35000 },
  ];

  defaultColDef = {
    resizable: true,
    flex: 1,
  };
}
