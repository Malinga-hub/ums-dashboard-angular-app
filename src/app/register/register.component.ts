import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms'
import {AuthService} from '../services/auth.service'
import {ShareService} from '../services/share.service'
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup

  current = 0;
  index = '1';
  isLoading:boolean = false;

  errors: any;
  data:any;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private message: NzMessageService) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      username: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, [Validators.required, Validators.pattern(/[0-9]{9}/), Validators.maxLength(9)]],
      phoneNumberPrefix: [null, Validators.required],
      firstName: [null, [Validators.required, Validators.pattern(/[a-zA-Z]+/)]],
      lastName: [null, [Validators.required, Validators.pattern(/[a-zA-Z]+/)]],
      address: [null],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    })
  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    this.register()
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = '1';
        break;
      }
      case 1: {
        this.index = '2';
        break;
      }
      case 2: {
        this.index = '3';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  // go to login
  goToLoginPage(){
    this.router.navigateByUrl('/login')
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.registerForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  register(){

    if(!this.registerForm.invalid){

      this.isLoading = true;

      const payload = {
        firstName: this.registerForm.controls['firstName'].value,
        lastName: this.registerForm.controls['lastName'].value,
        email: this.registerForm.controls['username'].value,
        phoneNumber: this.registerForm.controls['phoneNumberPrefix'].value+this.registerForm.controls['phoneNumber'].value,
        address: this.registerForm.controls['address'].value,
        password: this.registerForm.controls['password'].value
      }

      console.log("payload: ",payload)

      this.authService.register(payload).toPromise()
      .then(
        (data)=>{
          this.data = ShareService.parseObject(data)

          console.log("data: ", this.data)

          switch(this.data.code){
            case 201:
              this.message.success("registration complete. Please login", {nzDuration: environment.MESSAGE_DURATION})
              this.router.navigateByUrl('/login')
              break;
            default:
              this.message.error(this.data.data.error.record, {nzDuration: environment.MESSAGE_DURATION})
              break;
          }
        },
        (error)=>{
          this.errors = ShareService.parseObject(Object.values(error)[7])
          console.warn("errors: ",this.errors)
          this.message.error(this.errors.data.error.record, {nzDuration: environment.MESSAGE_DURATION})
        }
      )
      .finally(()=>{
        this.isLoading = false;
      })
    }
  }

  resetForm(){
    this.registerForm.reset()
  }


}
