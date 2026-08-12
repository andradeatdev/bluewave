import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { User } from "src/app/models/user";
import { ToastService } from "src/app/services/toast/toast.service";
import { UserService } from "src/app/services/user/user.service";
import { validateSignUp } from "src/app/validators/signup";

@Component({
	selector: "app-signup",
	templateUrl: "./signup.page.html",
	styleUrls: ["./signup.page.scss"],
	standalone: false,
})
export class SignupPage implements OnInit {
	signingup: boolean = false;
	signUpForm!: FormGroup;
	helperText: string = "";

	constructor(
		private formBuilder: FormBuilder,
		private toastService: ToastService,
		private userService: UserService,
		private router: Router,
		private titleServce: Title,
	) {}

	ngOnInit() {
		this.titleServce.setTitle("Cadastro - BlueWave");

		this.signUpForm = this.formBuilder.group(
			{
				name: ["", [Validators.required]],
				nick: ["", [Validators.required]],
				email: ["", [Validators.required, Validators.email]],
				password: ["", [Validators.required]],
				confirmPassword: ["", [Validators.required]],
			},
			{ validators: validateSignUp },
		);
	}

	signup() {
        const values = this.signUpForm.value

        if (values.password !== values.confirmPassword) {
			this.toastService.presentToast({ message: "Senhas não coincidem", color: "danger" });
			return;
        }

		if (this.signUpForm.invalid) {
			this.toastService.presentToast({ message:  "Preencha todos os campos corretamente.", color: "danger" });
			return
		}
		this.signingup = true;

		this.userService.create(this.signUpForm.value).subscribe({
			next: (user: User) => {
                this.toastService.presentToast({ message: "Conta criada.", color: "success" });
				this.signingup = false;
				this.router.navigate(["/signin"]);
			},
			error: (err) => {
				const erro = err.error.erro;
				const duplicate = erro?.includes("Duplicate entry");

				if (duplicate) {
					this.helperText = "Apelido e/ou email já em uso.";
				}

				if (!duplicate) {
					this.toastService.presentToast({ message: "Ocorreu um erro ao realizar o cadastro.", color: "danger" });
				}

				this.signingup = false;
			},
		});
	}
}
