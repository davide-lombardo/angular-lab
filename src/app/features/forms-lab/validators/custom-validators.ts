import { AbstractControl, ValidationErrors } from "@angular/forms";

export function ageRangeValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (
    value !== undefined &&
    value !== null &&
    (isNaN(value) || value < 18 || value > 120)
  ) {
    return { ageRange: true };
  }
  return null;
}

export function passwordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[$@$!%*?&]/.test(value);

  const valid =
    hasUpper && hasLower && hasNumber && hasSpecial && value.length >= 8;

  if (!valid) {
    return {
      weakPassword: {
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        minLength: value.length >= 8,
      },
    };
  }

  return null;
}

export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    const confirmPasswordControl = control.get('confirmPassword');
    confirmPasswordControl?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  // Clear the error if passwords match
  const confirmPasswordControl = control.get('confirmPassword');
  if (confirmPasswordControl?.errors?.['passwordMismatch']) {
    delete confirmPasswordControl.errors['passwordMismatch'];
    if (Object.keys(confirmPasswordControl.errors).length === 0) {
      confirmPasswordControl.setErrors(null);
    }
  }

  return null;
}