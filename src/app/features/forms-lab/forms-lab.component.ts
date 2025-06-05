
import { Component, OnInit } from '@angular/core';
import { 
  FormArray,
  FormBuilder, 
  FormGroup, 
  FormControl,
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';

// Custom validator function
function ageRangeValidator(control: FormControl): {[key: string]: boolean} | null {
  if (control.value !== undefined && (isNaN(control.value) || control.value < 18 || control.value > 120)) {
    return { 'ageRange': true };
  }
  return null;
}

@Component({
  selector: 'app-forms-lab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatDividerModule
],
  templateUrl: './forms-lab.component.html',
  styleUrl: './forms-lab.component.scss'
})
export class FormsLabComponent implements OnInit {
  // Basic form
  basicForm!: FormGroup;
  
  // Advanced form with nested groups
  advancedForm!: FormGroup;
  
  // Dynamic form with FormArray
  dynamicForm!: FormGroup;
  
  // Validation form with custom validators
  validationForm!: FormGroup;
  
  // Form submission states
  basicFormSubmitted = false;
  advancedFormSubmitted = false;
  dynamicFormSubmitted = false;
  validationFormSubmitted = false;
  
  // Select options for demo purposes
  countries = ['Italy', 'USA', 'France', 'Spain', 'Germany', 'UK'];
  skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  constructor(private fb: FormBuilder) {
    // Initialize all forms in constructor
    this.initForms();
  }
  
  ngOnInit(): void {
    // Subscribe to form changes for demonstration
    this.basicForm.valueChanges.subscribe(value => {
      console.log('Basic form values:', value);
    });
  }
  
  private initForms(): void {
    // Basic form initialization
    this.basicForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    
    // Advanced form with nested groups
    this.advancedForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),
      addressInfo: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]]
      }),
      preferences: this.fb.group({
        receiveEmails: [false],
        theme: ['light']
      })
    });
    
    // Dynamic form with FormArray
    this.dynamicForm = this.fb.group({
      userName: ['', Validators.required],
      skills: this.fb.array([
        this.createSkillFormGroup()
      ])
    });
    
    // Validation form with custom validators
    this.validationForm = this.fb.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.pattern('[a-zA-Z0-9_]*')
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ]],
      confirmPassword: ['', Validators.required],
      age: ['', [Validators.required, ageRangeValidator]],
      birthDate: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }
  
  // Helper method to create a skill form group
  createSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      skillLevel: ['', Validators.required],
      yearsExperience: ['', [Validators.required, Validators.min(0)]]
    });
  }
  
  // Custom validator for password matching
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  // Form Array methods
  get skillsArray(): FormArray {
    return this.dynamicForm.get('skills') as FormArray;
  }
  
  addSkill(): void {
    this.skillsArray.push(this.createSkillFormGroup());
  }
  
  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }
  
  // Form submission methods
  submitBasicForm(): void {
    this.basicFormSubmitted = true;
    
    if (this.basicForm.valid) {
      console.log('Basic form submitted:', this.basicForm.value);
      // Here you would typically send the data to a service
      
      // Reset the form after successful submission
      setTimeout(() => {
        this.basicForm.reset();
        this.basicFormSubmitted = false;
      }, 3000);
    }
  }
  
  submitAdvancedForm(): void {
    this.advancedFormSubmitted = true;
    
    if (this.advancedForm.valid) {
      console.log('Advanced form submitted:', this.advancedForm.value);
      // Reset after submission
      setTimeout(() => {
        this.advancedForm.reset();
        this.advancedFormSubmitted = false;
      }, 3000);
    }
  }
  
  submitDynamicForm(): void {
    this.dynamicFormSubmitted = true;
    
    if (this.dynamicForm.valid) {
      console.log('Dynamic form submitted:', this.dynamicForm.value);
      // Reset after submission
      setTimeout(() => {
        this.dynamicForm.reset();
        this.dynamicFormSubmitted = false;
        // Reset to just one skill entry
        this.skillsArray.clear();
        this.addSkill();
      }, 3000);
    }
  }
  
  submitValidationForm(): void {
    this.validationFormSubmitted = true;
    
    if (this.validationForm.valid) {
      console.log('Validation form submitted:', this.validationForm.value);
      // Reset after submission
      setTimeout(() => {
        this.validationForm.reset();
        this.validationFormSubmitted = false;
      }, 3000);
    }
  }
}