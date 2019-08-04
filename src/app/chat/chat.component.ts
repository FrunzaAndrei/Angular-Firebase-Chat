import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as firebase from "firebase";
import { AngularFireList, AngularFireDatabase } from "angularfire2/database";
import { element } from "protractor";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  private currentUserName = undefined;
  public messages = [];
  public keyS = [];

  public currentUploadedFiles = [];
  public isUploading: boolean = false;
  public progress : Number = 0;

  constructor(
    private _route: ActivatedRoute,
    private db: AngularFireDatabase,
    private _router: Router
  ) {
    this._route.queryParams.subscribe(res => {
      this.currentUserName = res.user;
    });
  }

  ngOnInit() {
    this.getMessages();
  }

  postMessage(mess) {
    let date = new Date();
  
    let today = `${date.getDate()} / ${date.getMonth() +
      1} / ${date.getFullYear()} (${date.getHours()}: ${date.getMinutes()} :${date.getSeconds()})`;

      if (this.currentUploadedFiles.length){

        this.isUploading = true;
        this.uploadImagesToFirebase().then(urls => {
            this.sendToDatabase(mess, today, urls)
     
          // console.log("Upload Completed!");
          this.isUploading = false;
          this.progress = 0;
          this.currentUploadedFiles = [];
          this.focusOnLastElem();
        });
      } else{
        this.sendToDatabase(mess,today);
        this.focusOnLastElem();
       
      }
  }

  sendToDatabase(mess,today,urls?){
    firebase
    .database()
    .ref("messages")
    .push({
      name: this.currentUserName,
      message: mess,
      date: today,
      images: urls? urls : ""
    });
  }

  focusOnLastElem(){
    document.getElementById("matCardContent").scrollIntoView(false);
  }

  uploadImagesToFirebase() {
    return new Promise((resolve, reject) => {
      let urls = [];
      var storageRef = firebase.storage().ref();

      this.currentUploadedFiles.filter(image => {
        var uploadTask = storageRef.child(`images/${image.name}`).put(image);
        uploadTask.on(
          "state_changed",
          snapshot => {
            this.progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + this.progress + "% done");
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING:
                console.log("Upload is running");
                break;
            }
          },
          error => {},
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              urls.push(downloadURL);

              // console.log(urls.length, this.currentUploadedFiles.length);
              if (urls.length === this.currentUploadedFiles.length) {
                resolve(urls);
              }
            });
          }
        );
      });
    });
  }

  getMessages() {
    this.db
      .list("messages", ref => ref.limitToLast(999))
      .snapshotChanges()
      .subscribe(res => {
        this.messages = [];
        res.filter(element => {
          this.messages.push({
            key: element.key,
            value: element.payload.val()
          });
        });
        // console.log(this.messages);
      });

 
 
  this.focusOnLastElem();
  }

  deleteThisMesg(item, user) {
    if (this.currentUserName == user) {
      this.db.object("messages/" + item).remove();
    } else alert("Poti sterge doar mesajele trimise de tine!");
  }

  public handleFileInput(files) {
    for (let i in files) {
      if (files[i] instanceof File) this.currentUploadedFiles.push(files[i]);
    }
  }
}
