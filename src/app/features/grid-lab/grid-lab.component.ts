import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface Car {
  make: string;
  model: string;
  price: number;
}


import { SharedTableComponent } from '../../ui/shared-table/shared-table.component';

@Component({
  selector: 'app-grid-lab',
  imports: [CommonModule, SharedTableComponent],
  templateUrl: './grid-lab.component.html',
  styleUrls: ['./grid-lab.component.scss'],
})
export class GridLabComponent {

}
