let express = require('express');
let app = express();
const fs = require("fs");
let path = require("path");

let socket = require('socket.io');
let server = require('http').Server(app);

app.use("/audio", express.static(path.join(__dirname, "mp3s")));
app.use("/", express.static(path.join(__dirname, "dist/w11app")));

let io = socket(server);  // io represents the backend socket.io server. Not the HTTP server. 

// Whenever you see .on, this means that you are waiting on an event to occur. If event occurs, then go and execute a call back.
io.on('connection', function(socket){
    // socket represents the client
    
    // Want to send a message to client
   /* In order to send a message to the client, I have to attach my data with an event. Need to put a label, where label represents 
   the name of the event that should be triggered at the client side. And the client side should be waiting for that event in order to get
   triggered. */ 

   socket.emit("welcomeEvent", "Thank you for your connection");


   socket.on('performTranslate', function(data)  {
    console.log("started");
       textToSpeechCall(socket, data.englishText, data.language); //long bg operation

       //emit an event
       console.log("finished");

       console.log(data);

   });
    
}); 

server.listen(8080);


/* 
When I say io.emit, means you are sending to all sockets that are connected to the io.
When I say socket.emit, you are sending a request to one single client.
*/




function textToSpeechCall(socket, text, language) {
    const textToSpeech = require("@google-cloud/text-to-speech");
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();
    // The text to synthesize
    // const text = "Hello from FIT2095 Week 11 lecture";
    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML Voice Gender (optional)
        voice: { languageCode: language, ssmlGender: "NEUTRAL" },
        // Select the type of audio encoding
        audioConfig: { audioEncoding: "MP3" },
    };
    // Performs the Text-to-Speech request
    client.synthesizeSpeech(request, (err, response) => {
        if (err) {
            console.error("ERROR:", err);
            return;
        }
        // Write the binary audio content to a local file
        let outputDest = "mp3s/" + socket.id + ".mp3"
        fs.writeFile(outputDest, response.audioContent, "binary", err => {
            if (err) {
                console.error("ERROR:", err);
                return;
            }
            socket.emit('translateDoneEvent', "Translation");
            console.log("Audio content written to file:" + outputDest);
            
        });
    });
    
}


