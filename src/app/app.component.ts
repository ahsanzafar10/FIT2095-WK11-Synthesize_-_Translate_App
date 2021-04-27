import { Component } from '@angular/core';

import * as io from "socket.io-client"; // Added


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'w11app';
  socket:SocketIOClient.Socket;

  chosenLanguage = "";
  textInEnglish = "";
  number1 = 0;
  number2 = 0; 
  result: number = 0;
  newId = "";
  mp3Location = "";

  constructor(){
    this.socket=io.connect("http://localhost:8080");
  }

  ngOnInit() {
    this.socket.on('welcomeEvent', function(data) {});


    this.socket.on("translateDoneEvent", (data)=>{
      this.mp3Location = "/audio/" + this.socket.id + ".mp3";

      let ap = <HTMLAudioElement>document.getElementById("ap");

      ap.src = this.mp3Location + "?random=" + new Date().getTime();
      console.log(ap.src);

      ap.load();

     
    });

    this.socket.on('newIdEvent', (data)=> {
      this.newId = data.id;
    });
  }

  translate(){

    let payload = {englishText: this.textInEnglish, language: this.chosenLanguage};
    
    /*I need an event. I am sending a new object/data to the backend */
    // send payload using this event
    this.socket.emit('performTranslate', payload); //After sending this, it needs to listen.

  }

}
