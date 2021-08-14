import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MaterializeService} from "../../shared/services/materialize.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  form: FormGroup
  Sub: Subscription

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    this.form.disable()
    this.Sub = this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/login'], {
        queryParams: {
          registered: true
        }
      }),
      error: (err) => {
        MaterializeService.toast(err.error.message)
        this.form.enable()
      },
      complete: () => {
        if (this.Sub) {
          this.Sub.unsubscribe()
        }
      }
    })
  }

}
