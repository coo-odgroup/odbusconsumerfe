import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';

import { Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { OTPService } from '../services/otp.service';
import { NotificationService } from '../services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../services/login.service';
import { SignupService } from '../services/signup.service';
import { LoginChecker } from '../helpers/loginChecker';
import { EncryptionService } from '../encrypt.service';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-new-login-page',
  templateUrl: './new-login-page.component.html',
  styleUrls: ['./new-login-page.component.css']
})
export class NewLoginPageComponent implements OnInit, OnDestroy {

  isMobile: boolean = false;

  /* =====================================================
     OTP INPUT REFERENCES
  ====================================================== */

  @ViewChildren('otp0, otp1, otp2, otp3, otp4')
  otpInputs!: QueryList<ElementRef>;


  /* =====================================================
     AUTH STATE
  ====================================================== */

  authMode: 'login' | 'signup' = 'login';

  loginMethod: 'phone' | 'email' = 'phone';


  /* =====================================================
     FORM DATA
  ====================================================== */

  name = '';

  authValue = '';

  signupPhone = '';
  signupEmail = '';


  /* =====================================================
     OTP DATA
  ====================================================== */

  // OTP is always 6 digits
  otp: string[] = ['', '', '', '', ''];

  showOtp = false;

  otpError = '';

  authError = '';

  userId: any;


  /* =====================================================
     TIMER
  ====================================================== */

  resendTimer = 20;

  private timerInterval: any;


  /* =====================================================
     LOADING
  ====================================================== */

  isLoading = false;


  /* =====================================================
     SESSION
  ====================================================== */

  session: LoginChecker;


  constructor(
    public router: Router,
    public fb: FormBuilder,

    private notify: NotificationService,

    private otpService: OTPService,

    private spinner: NgxSpinnerService,

    public loginService: LoginService,

    private signupService: SignupService,

    private seo: SeoService,

    private enc: EncryptionService,

    private location: Location,

    private deviceService: DeviceDetectorService
  ) {

    this.session = new LoginChecker();

    this.isMobile = this.deviceService.isMobile();

    const currentUrl =
      location.path().replace('/', '');

    this.seo.seolist(currentUrl);
  }



  /* =====================================================
     INIT
  ====================================================== */

  ngOnInit(): void {

    this.userId =
      localStorage.getItem('userId');


    /*
     * Same behaviour as your existing OTP component.
     */

    if (this.session.isLoggedIn()) {

      this.router.navigate(['myaccount']);

      return;
    }


    // Always open the login screen when the page loads.
    // OTP screen is shown only after a successful GET OTP request.
    this.showOtp = false;

  }


  /* =====================================================
     SWITCH LOGIN / SIGNUP
  ====================================================== */

  switchAuthMode(
    mode: 'login' | 'signup'
  ): void {

    this.authMode = mode;

    this.authError = '';

    this.authValue = '';
    this.name = '';
    this.signupPhone = '';
    this.signupEmail = '';
    this.loginMethod = 'phone';
  }


  /* =====================================================
     SWITCH PHONE / EMAIL
  ====================================================== */

  switchMethod(
    method: 'phone' | 'email'
  ): void {

    this.loginMethod = method;

    this.authValue = '';

    this.authError = '';
  }


  /* =====================================================
     CLEAR ERROR
  ====================================================== */

  clearAuthError(): void {

    this.authError = '';
  }


  /* =====================================================
     VALIDATE INPUT
  ====================================================== */

  private validateAuth(): boolean {

    this.authError = '';

    if (this.authMode === 'signup') {
      if (!this.name.trim()) {
        this.authError = 'Please enter your name.';
        return false;
      }

      const phone = this.signupPhone.replace(/\D/g, '');
      if (phone.length !== 10) {
        this.authError = 'Please enter a valid 10-digit mobile number.';
        return false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.signupEmail.trim())) {
        this.authError = 'Please enter a valid email address.';
        return false;
      }

      return true;
    }

    if (!this.authValue.trim()) {
      this.authError = this.loginMethod === 'phone'
        ? 'Please enter your mobile number.'
        : 'Please enter your email address.';
      return false;
    }

    if (this.loginMethod === 'phone') {
      const phone = this.authValue.replace(/\D/g, '');
      if (phone.length !== 10) {
        this.authError = 'Please enter a valid 10-digit mobile number.';
        return false;
      }
    }

    if (this.loginMethod === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.authValue.trim())) {
        this.authError = 'Please enter a valid email address.';
        return false;
      }
    }

    return true;
  }

  /* =====================================================
     GET OTP
  ====================================================== */

  getOtp(): void {

    if (!this.validateAuth()) {
      return;
    }


    this.isLoading = true;

    this.spinner.show();


    /*
     * Keep the same information in localStorage
     * that your existing OTP component uses.
     */

    localStorage.setItem(
      'otp_type',
      this.authMode
    );


    const viaValue = this.authMode === 'signup'
      ? `${this.signupPhone} / ${this.signupEmail}`
      : this.authValue;

    localStorage.setItem('via', viaValue);


    /*
     * IMPORTANT:
     * Keep the parameter structure used by
     * your existing LoginComponent / SignupComponent.
     *
     * If your current service expects different
     * property names, only this object needs to
     * match that existing component.
     */

    const param: any = this.authMode === 'signup'
      ? {
        name: this.name.trim(),
        phone: this.signupPhone.replace(/\D/g, ''),
        email: this.signupEmail.trim()
      }
      : {
        via: this.loginMethod,
        phone: this.loginMethod === 'phone' ? this.authValue.trim() : '',
        email: this.loginMethod === 'email' ? this.authValue.trim() : '',
        name: ''
      };


    localStorage.setItem(
      'resendParam',
      JSON.stringify(param)
    );


    if (
      this.authMode === 'login'
    ) {

      this.loginService
        .signin(param)
        .subscribe({

          next: (res: any) => {

            this.isLoading = false;

            this.spinner.hide();


            if (res.status == 1) {

              const data =
                this.enc.decrypt(res.data);


              const parsedData =
                JSON.parse(data);


              this.userId =
                parsedData.id;


              localStorage.setItem(
                'userId',
                this.userId
              );


              this.showOtp = true;

              this.otp =
                ['', '', '', '', ''];

              this.otpError = '';

              this.startTimer();


              this.notify.notify(
                'OTP has been sent to ' +
                this.authValue,
                'Success'
              );


              setTimeout(() => {

                this.focusOtp(0);

              }, 100);

            }
            else {

              this.authError =
                res.message ||
                'Unable to send OTP.';

              this.notify.notify(
                this.authError,
                'Error'
              );
            }

          },

          error: (error: any) => {

            this.isLoading = false;

            this.spinner.hide();

            this.authError =
              error?.error?.message ||
              'Something went wrong.';

            this.notify.notify(
              this.authError,
              'Error'
            );
          }

        });

    }
    else {

      this.signupService
        .signup(param)
        .subscribe({

          next: (res: any) => {

            this.isLoading = false;

            this.spinner.hide();


            if (res.status == 1) {

              const data =
                this.enc.decrypt(res.data);


              const parsedData =
                JSON.parse(data);


              this.userId =
                parsedData.id;


              localStorage.setItem(
                'userId',
                this.userId
              );


              this.showOtp = true;

              this.otp =
                ['', '', '', '', ''];

              this.otpError = '';

              this.startTimer();


              this.notify.notify(
                'OTP has been sent to ' +
                this.authValue,
                'Success'
              );


              setTimeout(() => {

                this.focusOtp(0);

              }, 100);

            }
            else {

              this.authError =
                res.message ||
                'Unable to send OTP.';

              this.notify.notify(
                this.authError,
                'Error'
              );
            }

          },

          error: (error: any) => {

            this.isLoading = false;

            this.spinner.hide();

            this.authError =
              error?.error?.message ||
              'Something went wrong.';

            this.notify.notify(
              this.authError,
              'Error'
            );
          }

        });

    }

  }


  /* =====================================================
     OTP INPUT
  ====================================================== */

  onOtpInput(
    event: any,
    index: number
  ): void {

    const input =
      event.target as HTMLInputElement;


    let value =
      input.value.replace(/\D/g, '');


    if (!value) {

      this.otp[index] = '';

      return;
    }


    /*
     * Keep only one digit.
     */

    value =
      value.charAt(0);


    this.otp[index] =
      value;


    input.value =
      value;


    /*
     * Move to next box.
     */

    if (
      index < 4 &&
      value
    ) {

      this.focusOtp(index + 1);
    }


    /*
     * Auto verify when all
     * 5 digits are entered.
     */

    if (
      this.otp.join('').length === 5
    ) {

      this.verifyOtp();
    }

  }


  /* =====================================================
     OTP KEYBOARD
  ====================================================== */

  onOtpKeyDown(
    event: KeyboardEvent,
    index: number
  ): void {

    if (
      event.key === 'Backspace' &&
      !this.otp[index] &&
      index > 0
    ) {

      this.focusOtp(index - 1);
    }

  }


  /* =====================================================
     FOCUS OTP
  ====================================================== */

  private focusOtp(index: number): void {

    const inputs =
      this.otpInputs?.toArray();


    if (
      inputs &&
      inputs[index]
    ) {

      inputs[index]
        .nativeElement
        .focus();
    }

  }


  /* =====================================================
     VERIFY OTP
  ====================================================== */

  verifyOtp(): void {

    this.otpError = '';


    const otpValue =
      this.otp.join('');


    if (
      otpValue.length !== 5
    ) {

      this.otpError =
        'Please enter the complete 5-digit OTP.';

      return;
    }


    if (!this.userId) {

      this.otpError =
        'Your session has expired. Please request a new OTP.';

      return;
    }


    this.isLoading = true;

    this.spinner.show();


    const param = {

      userId:
        this.userId,

      otp:
        otpValue

    };


    this.otpService
      .submit_otp(param)
      .subscribe({

        next: (res: any) => {

          if (res.status == 1) {

            let data =
              this.enc.decrypt(res.data);


            data =
              JSON.parse(data);


            /*
             * Same session logic as your
             * existing OtpComponent.
             */

            this.session.setLoggedInUser(
              JSON.stringify(data)
            );


            localStorage.removeItem(
              'userId'
            );

            localStorage.removeItem(
              'otp_type'
            );

            localStorage.removeItem(
              'resendParam'
            );

            localStorage.removeItem(
              'via'
            );


            this.notify.notify(
              'OTP verification is successful',
              'Success'
            );


            this.router.navigate([
              'dashboard'
            ]);

          }
          else {

            this.otpError =
              res.message ||
              'Invalid OTP.';

            this.notify.notify(
              this.otpError,
              'Error'
            );
          }


          this.isLoading = false;

          this.spinner.hide();

        },

        error: (error: any) => {

          this.isLoading = false;

          this.spinner.hide();


          this.otpError =
            error?.error?.message ||
            'Invalid OTP.';

          this.notify.notify(
            this.otpError,
            'Error'
          );

        }

      });

  }


  /* =====================================================
     TIMER
  ====================================================== */

  private startTimer(): void {

    this.stopTimer();

    this.resendTimer = 20;


    this.timerInterval =
      setInterval(() => {

        if (
          this.resendTimer > 0
        ) {

          this.resendTimer--;

        }
        else {

          this.stopTimer();

        }

      }, 1000);

  }


  /* =====================================================
     STOP TIMER
  ====================================================== */

  private stopTimer(): void {

    if (
      this.timerInterval
    ) {

      clearInterval(
        this.timerInterval
      );

      this.timerInterval = null;

    }

  }


  /* =====================================================
     RESEND OTP
  ====================================================== */

  resendOtp(): void {

    this.isLoading = true;

    this.spinner.show();

    this.otpError = '';


    const typ =
      localStorage.getItem(
        'otp_type'
      );


    const via =
      localStorage.getItem(
        'via'
      );


    let param: any = null;


    const storedData =
      localStorage.getItem(
        'resendParam'
      );


    if (storedData) {

      param =
        JSON.parse(storedData);

    }


    if (!param) {

      this.isLoading = false;

      this.spinner.hide();

      this.otpError =
        'Unable to resend OTP. Please try again.';

      return;
    }


    /*
     * Same login resend logic
     * from your existing OtpComponent.
     */

    if (typ === 'login') {

      this.loginService
        .signin(param)
        .subscribe({

          next: (res: any) => {

            this.isLoading = false;

            this.spinner.hide();


            if (res.status == 1) {

              if (
                res.message ===
                'Not a Registered User'
              ) {

                this.notify.notify(
                  res.message,
                  'Error'
                );

              }
              else {

                this.startTimer();

                this.notify.notify(
                  'OTP has been sent to ' +
                  via,
                  'Success'
                );

              }

            }
            else {

              this.notify.notify(
                res.message,
                'Error'
              );

            }

          },

          error: (error: any) => {

            this.isLoading = false;

            this.spinner.hide();

            this.notify.notify(
              error?.error?.message ||
              'Unable to resend OTP.',
              'Error'
            );

          }

        });

    }


    /*
     * Same signup resend logic
     * from your existing OtpComponent.
     */

    else if (
      typ === 'signup'
    ) {

      this.signupService
        .signup(param)
        .subscribe({

          next: (res: any) => {

            this.isLoading = false;

            this.spinner.hide();


            if (res.status == 1) {

              this.startTimer();


              let data =
                this.enc.decrypt(res.data);


              data =
                JSON.parse(data);







              this.notify.notify(
                'OTP has been sent to ' +
                via,
                'Success'
              );

            }
            else {

              this.notify.notify(
                res.message,
                'Error'
              );

            }

          },

          error: (error: any) => {

            this.isLoading = false;

            this.spinner.hide();

            this.notify.notify(
              error?.error?.message ||
              'Unable to resend OTP.',
              'Error'
            );

          }

        });

    }

  }


  /* =====================================================
     BACK TO LOGIN
  ====================================================== */

  backToLogin(): void {

    this.stopTimer();

    this.showOtp = false;

    this.otp =
      ['', '', '', '', ''];

    this.otpError = '';

    this.isLoading = false;

  }


  /* =====================================================
     MASK CONTACT
  ====================================================== */

  get maskedContact(): string {

    if (this.authMode === 'signup') {
      const phone = this.signupPhone || '';
      const email = this.signupEmail || '';

      const maskedPhone = phone.length >= 4
        ? '******' + phone.slice(-4)
        : phone;

      const parts = email.split('@');
      const maskedEmail = parts.length === 2
        ? (parts[0].length > 2 ? parts[0].substring(0, 2) + '***' : '***') + '@' + parts[1]
        : email;

      return `${maskedPhone} & ${maskedEmail}`;
    }

    if (this.loginMethod === 'phone') {
      const value = this.authValue || '';
      if (value.length >= 4) {
        return '******' + value.slice(-4);
      }
    }

    if (this.loginMethod === 'email') {
      const email = this.authValue || '';
      const parts = email.split('@');
      if (parts.length === 2) {
        const masked = parts[0].length > 2
          ? parts[0].substring(0, 2) + '***'
          : '***';
        return masked + '@' + parts[1];
      }
    }

    return this.authValue;
  }

  /* =====================================================
     DESTROY
  ====================================================== */

  ngOnDestroy(): void {

    this.stopTimer();

  }

}