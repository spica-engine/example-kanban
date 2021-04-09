import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-email-login",
  templateUrl: "./email-login.component.html",
  styleUrls: ["./email-login.component.scss"]
})
export class EmailLoginComponent implements OnInit {
  constructor(private auth: AuthService, private fb: FormBuilder) {}

  form: FormGroup;
  type: "login" | "signup" | "reset" = "signup";
  loading: boolean = false;
  serverMessage: string;

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.minLength(6), Validators.required]],
      passwordConfirm: ["", []]
    });
  }

  changeType(val) {
    this.type = val;
  }

  get isLogin() {
    return this.type === "login";
  }

  get isSignup() {
    return this.type === "signup";
  }

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  get passwordConfirm() {
    return this.form.get("passwordConfirm");
  }

  get passwordDoesMatch() {
    if (this.type !== "signup") {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmit() {
    this.loading = true;

    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        await this.auth.login(email, password);
      }
      if (this.isSignup) {
        await this.auth.register(email, password);
        this.serverMessage = "Registration completed";
      }
    } catch (error) {
      this.serverMessage = error.message;
    }

    this.loading = false;
  }
}
