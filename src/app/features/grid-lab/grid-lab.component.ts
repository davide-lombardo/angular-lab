
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
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-grid-lab',
  imports: [SharedTableComponent, MatCardModule],
  templateUrl: './grid-lab.component.html',
  styleUrls: ['./grid-lab.component.scss'],
})
export class GridLabComponent {

}
