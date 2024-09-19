
import express from "express";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";
// const https=require("https");
import https from "https";
import path from "path";
// importing path from url
import { fileURLToPath } from 'url';

import dotenv from "dotenv";
dotenv.config();  // it loads environment variables from .env file

const app = express();


// in commonJS(require) the __dirname is defined but in ES modules(import) we are defining __dirname manually using fileURL path function.
// defining __dirname in ES modules................

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//......................................................

app.use(bodyParser.urlencoded({extended:true}));
// To use all the static files in public folder

app.use(express.static(path.join(__dirname, 'public')));

//get request to home route sending the local file from public folder
app.get("/",function(req,res){
   res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.post("/",function(req,res){
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email;
    console.log(firstName);
    console.log(lastName);
    console.log(email);
    //creating an object of arrays to send data to the server
    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    EMAIL: email,
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsondata=JSON.stringify(data);

    const url=new URL(`${process.env.MAILCHIMP_URL}${process.env.LIST_ID}`);

    //IMP SYNTAX FOR https.request(url,options,callback function)
    //auth --- authentication=apikey
    //method=post

    const options={
        method:"POST",
        auth:`shaurya:${process.env.API_KEY}`
    }

    //https request
    // creating request constant
    const request= https.request(url,options,function(response){
          console.log(response.statusCode);

          response.on("data",function(data){
               console.log(JSON.parse(data));
          });

          var scode=response.statusCode;
          if(scode==200){
            res.sendFile(path.join(__dirname, "public", "success.html"));
            }
            else{
                res.sendFile(path.join(__dirname, "public", "failure.html"));
            }
     });
     
     //using stringify data
     //sending request to mailchimp server
     request.write(jsondata);

     request.end();
      
});

app.post("/failure.html",function(req,res){
    res.sendFile(path.join(__dirname, "public", "signup.html"));
})

const port = process.env.PORT || 9001;

app.listen(port,()=>{
  console.log(`Starting server on Port ${port}`);
  
});