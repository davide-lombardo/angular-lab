import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forms-lab',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forms-lab.component.html',
  styleUrl: './forms-lab.component.scss'
})
export class FormsLabComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: '',
      email: '',
    });
  }

  submit() {
    console.log(this.form.value);
  }
}
