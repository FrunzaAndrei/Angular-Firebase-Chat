import { Component, OnInit, NgZone } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import * as firebase from "firebase";
import { AngularFireDatabase } from "angularfire2/database";
import { Router } from "@angular/router";

//For Input Email
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  currentUser = undefined;

  //From Password
  hide = true;

  //From Input
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(
    private db: AngularFireDatabase,
    private _router: Router,
    private zone: NgZone
  ) {}

  ngOnInit() {}

  login(values) {
    firebase
      .auth()
      .signInWithEmailAndPassword(values.username, values.password)
      .then(res => {
        this.currentUser = res.user.email;
        if (this.currentUser) {
          // this._router.navigate([`/chat/${this.currentUser}`])
          this._router.navigate([`/chat`], {
            queryParams: { user: this.currentUser },
            skipLocationChange: true
          });
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        this.currentUser = res.user.displayName;
        console.log(this.currentUser);
        if (this.currentUser) {
          this.zone.run(() =>
            this._router.navigate(["/chat"], {
              queryParams: { user: this.currentUser },
              skipLocationChange: false
            })
          );
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  createUserAndPassword(values){
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.username, values.password)
      .then(res => {if (res) this.login(values)})
      .catch(error => {
        console.log("Error: ", error);
      });  
    }
  }

  