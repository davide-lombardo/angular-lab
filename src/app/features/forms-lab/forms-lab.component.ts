import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forms-lab',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './forms-lab.component.html',
  styleUrl: './forms-lab.component.scss'
})
export class FormsLabComponent {
 // Initialize reactive form
 form: FormGroup;

 constructor(private fb: FormBuilder) {
   // Create form with validators
   this.form = this.fb.group({
     name: ['', Validators.required],
     email: ['', [Validators.required, Validators.email]]
   });
 }

 ngOnInit(): void {
   // Subscribe to form changes for demonstration
   this.form.valueChanges.subscribe(value => {
     console.log('Form values:', value);
   });
 }

 submit(): void {
   if (this.form.valid) {
     console.log('Form submitted:', this.form.value);
   }
 }
}
