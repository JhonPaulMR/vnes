import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

// Função original para validar se as passwords coincidem.
export function passwordMatcher(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLoginView = true;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Formulário de login com as suas validações originais.
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Formulário de registo com TODAS as suas validações originais restauradas.
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        // A sua validação original com RegExp para password forte foi restaurada.
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatcher }); // Validador de grupo para passwords.
  }

  // Função para alternar entre as vistas.
  toggleView(isLogin: boolean): void {
    this.isLoginView = isLogin;
  }

  // Submissão do login.
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value);
    }
  }

  // Submissão do registo.
  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      // Remove 'confirmPassword' antes de enviar para o serviço.
      const { confirmPassword, ...userData } = this.registerForm.value;
      const registered = this.authService.register(userData);
      if (registered) {
        this.toggleView(true); // Muda para a vista de login após o sucesso.
        this.registerForm.reset();
      }
    }
  }

  // Getters originais restaurados para corresponder ao seu HTML.
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }

  get registerUsername() { return this.registerForm.get('username'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerPassword() { return this.registerForm.get('password'); }
  get registerConfirmPassword() { return this.registerForm.get('confirmPassword'); }
}
