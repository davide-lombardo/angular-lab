import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, combineLatest, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-rxjs-lab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './rxjs-lab.component.html',
  styleUrls: ['./rxjs-lab.component.scss'],
})
export class RxjsLabComponent implements OnDestroy {
  firstName = new FormControl('');
  lastName = new FormControl('');
  fullName = '';
  subscriptions: Subscription[] = [];

  constructor() {
    const nameSub = combineLatest([
      this.firstName.valueChanges.pipe(startWith('')),
      this.lastName.valueChanges.pipe(startWith('')),
    ])
      .pipe(
        debounceTime(200),
        map(([first, last]) => `${first} ${last}`.trim())
      )
      .subscribe((full) => {
        this.fullName = full;
      });

    this.subscriptions.push(nameSub);
  }

  reset() {
    this.firstName.setValue('');
    this.lastName.setValue('');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
