import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { createGesture } from "@ionic/angular";
import { TokenData } from "src/app/models/token";
import { AuthService } from "src/app/services/auth/auth.service";
import { ToastService } from "src/app/services/toast/toast.service";
import { UserService } from "src/app/services/user/user.service";

@Component({
	selector: "app-signin",
	templateUrl: "./signin.page.html",
	styleUrls: ["./signin.page.scss"],
	standalone: false,
})
export class SigninPage implements OnInit {
	signingIn: boolean = false;
	signInForm!: FormGroup;
	constructor(
		private formBuilder: FormBuilder,
		private toastService: ToastService,
		private userService: UserService,
		private authService: AuthService,
		private router: Router,
		private titleServce: Title,
	) {}

	ngOnInit() {
		this.titleServce.setTitle("Entrar - BlueWave");

		this.signInForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required]],
		});
	}

	signin() {
		if (this.signInForm.invalid) {
			const message = "Preencha todos os campos corretamente.";
			this.toastService.presentToast({ message: message, color: "danger" });

			return;
		}
		this.signingIn = true;

		this.userService.login(this.signInForm.value).subscribe({
			next: (data) => {
				this.toastService.presentToast({ message: "Login realizado!", color: "success" });
				this.signingIn = false;
				this.authService.setToken(data);
				this.router.navigate(["/feed"]);

				this.signingIn = false;
			},
			error: (err) => {
				this.toastService.presentToast({ message: err.error.error });

				if (err.statusText === "Unauthorized" || err.status === 401) {
					this.toastService.presentToast({ message: "Verifique seu email e senha e tente novamente" });
				}

				this.signingIn = false;
			},
		});
	}
}
