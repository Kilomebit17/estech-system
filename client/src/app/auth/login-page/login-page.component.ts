import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterializeService} from "../../shared/services/materialize.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup
  Sub!: Subscription
  passportType:boolean = false
  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterializeService.toast('Okay, now login')
      } else if (params['accessDenied']) {
        MaterializeService.toast('Please login in system')
      } else if (params['sessionFailed']) {
        MaterializeService.toast('For begin, login in system')
      }else if (params['logout']) {
        MaterializeService.toast('Logout is success')
      }
    })
  }

  onSubmit() {
    this.form.disable()
    this.Sub = this.auth.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/overview'])
      },
      error: (error) => {
        MaterializeService.toast(error.error.message)
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
