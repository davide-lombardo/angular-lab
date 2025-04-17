import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-icon-button color="primary" (click)="onEdit()">
      <mat-icon>edit</mat-icon>
    </button>
    <button mat-icon-button color="warn" (click)="onDelete()">
      <mat-icon>delete</mat-icon>
    </button>
  `
})
export class ActionButtonsComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onEdit() {
    const parent = (this.params.context as any).componentParent;
    if (parent?.editItem) {
      parent.editItem(this.params.data);
    }
  }

  onDelete() {
    const parent = (this.params.context as any).componentParent;
    if (parent?.deleteItem) {
      parent.deleteItem(this.params.data);
    }
  }
}