import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {AuthService} from '../services/auth.service'
import {ShareService} from '../services/share.service'
import { NzMessageService } from 'ng-zorro-antd/message';
import {Router} from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  errors: any;
  data: any;

  isLoading: boolean = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private message: NzMessageService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  // login
  login(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }

    if(!this.loginForm.invalid){
      this.isLoading = true;

      const payload = {
        username: this.loginForm.controls['username'].value,
        password: this.loginForm.controls['password'].value
      }

      console.log("payload: ",payload)

      this.authService.login(payload).toPromise()
      .then(
        (data) => {
          console.log("data: ",data)
          this.data = ShareService.parseObject(data)
          // set access token
          localStorage.setItem("ums_token", this.data.data.token)
          this.message.success("login successfully", {nzDuration: environment.MESSAGE_DURATION})

        },

        (error) => {
          // handle errors
          this.errors = ShareService.parseObject(Object.values(error)[7]);
          console.warn(this.errors)
          this.message.error(this.errors.data.error.login.toLowerCase(), {nzDuration: environment.MESSAGE_DURATION})
        }
      )
      .finally(() => this.isLoading = false)
    }

  }

  // register
  goToRegisterPage(){
    this.router.navigateByUrl('/register')
  }

}
