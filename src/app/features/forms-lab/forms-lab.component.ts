import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import {
  passwordStrengthValidator,
  ageRangeValidator,
  passwordMatchValidator,
} from './validators/custom-validators';

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
    MatDividerModule,
    MatTabsModule,
    CommonModule,
  ],
  templateUrl: './forms-lab.component.html',
  styleUrl: './forms-lab.component.scss',
})
export class FormsLabComponent {
  private readonly fb = inject(FormBuilder);
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly passwordValue = signal('');

  // Static data
  readonly countries = [
    'Italy',
    'USA',
    'France',
    'Spain',
    'Germany',
    'UK',
  ] as const;
  readonly skillLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
  ] as const;
  readonly themes = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'system', label: 'System Default' },
  ] as const;

  //  Form submission states
  readonly formSubmissionStates = signal({
    basic: false,
    advanced: false,
    dynamic: false,
    validation: false,
  });

  // Form instances
  readonly basicForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly advancedForm = this.fb.group({
    personalInfo: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    }),
    addressInfo: this.fb.group({
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    }),
    preferences: this.fb.group({
      receiveEmails: [false],
      theme: ['light', Validators.required],
      notifications: this.fb.group({
        email: [true],
        sms: [false],
        push: [true],
      }),
    }),
  });

  readonly dynamicForm = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    skills: this.fb.array(
      [this.createSkillFormGroup()],
      [Validators.minLength(1)]
    ),
  });

  readonly validationForm = this.fb.group(
    {
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(/^[a-zA-Z0-9_]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      age: ['', [Validators.required, ageRangeValidator]],
      birthDate: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue],
    },
    {
      validators: [passwordMatchValidator],
    }
  );

  // Computed signals for form validity
  readonly basicFormValid = computed(() => this.basicForm.valid);
  readonly advancedFormValid = computed(() => this.advancedForm.valid);
  readonly dynamicFormValid = computed(() => this.dynamicForm.valid);
  readonly validationFormValid = computed(() => this.validationForm.valid);

  readonly passwordStrength = computed(() => {
    const value = this.passwordValue();

    if (!value) {
      return { score: 0, label: 'No password', class: 'very-weak' };
    }

    let score = 0;
    const checks = {
      hasUpper: /[A-Z]/.test(value),
      hasLower: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecial: /[$@$!%*?&]/.test(value),
      hasLength: value.length >= 8,
    };

    score = Object.values(checks).filter(Boolean).length;

    const strengthLevels = [
      { label: 'Very Weak', class: 'very-weak' },
      { label: 'Weak', class: 'weak' },
      { label: 'Fair', class: 'fair' },
      { label: 'Good', class: 'good' },
      { label: 'Strong', class: 'strong' },
    ];

    const level = strengthLevels[Math.min(score, 4)];

    return {
      score,
      label: level.label,
      class: level.class,
    };
  });

  constructor() {
    this.setupFormSubscriptions();
  }

  private setupFormSubscriptions(): void {
    this.validationForm
      .get('password')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.passwordValue.set(value || '');

        const confirmPasswordControl =
          this.validationForm.get('confirmPassword');

        if (confirmPasswordControl?.value) {
          confirmPasswordControl.updateValueAndValidity();
        }
      });
  }

  // Skill management
  private createSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', [Validators.required, Validators.minLength(2)]],
      skillLevel: ['', Validators.required],
      yearsExperience: [
        '',
        [Validators.required, Validators.min(0), Validators.max(50)],
      ],
    });
  }

  get skillsArray(): FormArray {
    return this.dynamicForm.get('skills') as FormArray;
  }

  public addSkill(): void {
    if (this.skillsArray.length < 10) {
      // Reasonable limit
      this.skillsArray.push(this.createSkillFormGroup());
    }
  }

  public removeSkill(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }

  // Error handling
  public getFieldError(form: FormGroup, fieldPath: string): string | null {
    const field = form.get(fieldPath);
    if (!field || !field.errors) return null;

    const errors = field.errors;

    // Handle specific validation errors with better messages
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength'])
      return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['maxlength'])
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    if (errors['pattern']) {
      if (fieldPath.includes('postalCode'))
        return 'Please enter a valid 5-digit postal code';
      if (fieldPath.includes('username'))
        return 'Only letters, numbers and underscore allowed';
      return 'Invalid format';
    }
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    if (errors['weakPassword'])
      return 'Password must contain uppercase, lowercase, number and special character';
    if (errors['passwordMismatch']) return 'Passwords do not match';
    if (errors['ageRange']) return 'Age must be between 18 and 120';

    return 'Invalid input';
  }

  public shouldShowError(form: FormGroup, fieldPath: string): boolean {
    const field = form.get(fieldPath);
    const isSubmitted = this.formSubmissionStates();

    return !!(
      field &&
      field.errors &&
      (field.touched ||
        isSubmitted.basic ||
        isSubmitted.advanced ||
        isSubmitted.dynamic ||
        isSubmitted.validation)
    );
  }

  // Form submission methods
  public submitBasicForm(): void {
    this.formSubmissionStates.update((state) => ({ ...state, basic: true }));

    if (this.basicForm.valid) {
      console.log('Basic form submitted:', this.basicForm.value);

      // Simulate API call
      setTimeout(() => {
        this.basicForm.reset();
        this.formSubmissionStates.update((state) => ({
          ...state,
          basic: false,
        }));
      }, 2000);
    } else {
      this.basicForm.markAllAsTouched();
    }
  }

  public submitAdvancedForm(): void {
    this.formSubmissionStates.update((state) => ({ ...state, advanced: true }));

    if (this.advancedForm.valid) {
      console.log('Advanced form submitted:', this.advancedForm.value);

      setTimeout(() => {
        this.advancedForm.reset();
        this.formSubmissionStates.update((state) => ({
          ...state,
          advanced: false,
        }));
      }, 2000);
    } else {
      this.advancedForm.markAllAsTouched();
    }
  }

  public submitDynamicForm(): void {
    this.formSubmissionStates.update((state) => ({ ...state, dynamic: true }));

    if (this.dynamicForm.valid) {
      console.log('Dynamic form submitted:', this.dynamicForm.value);

      setTimeout(() => {
        this.dynamicForm.reset();
        this.skillsArray.clear();
        this.skillsArray.push(this.createSkillFormGroup());
        this.formSubmissionStates.update((state) => ({
          ...state,
          dynamic: false,
        }));
      }, 2000);
    } else {
      this.dynamicForm.markAllAsTouched();
    }
  }

  public submitValidationForm(): void {
    this.formSubmissionStates.update((state) => ({
      ...state,
      validation: true,
    }));

    if (this.validationForm.valid) {
      console.log('Validation form submitted:', this.validationForm.value);

      setTimeout(() => {
        this.validationForm.reset();
        this.formSubmissionStates.update((state) => ({
          ...state,
          validation: false,
        }));
      }, 2000);
    } else {
      this.validationForm.markAllAsTouched();
    }
  }

  public togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  public toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update((hidden) => !hidden);
  }
}
