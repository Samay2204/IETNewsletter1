import express from "express";

const app = express();

const port = 9001;

// const bodyParser = require("body-parser");
import bodyParser from "body-parser";

// const https=require("https");
import https from "https";

import path from "path";

// importing path from url
import { fileURLToPath } from 'url';


// defining __dirname in ES modules................

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//......................................................

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

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
    const url="https://us14.api.mailchimp.com/3.0/lists/40ab1e45a4";

    //IMP SYNTAX FOR https.request(url,options,callback function)
    //auth --- authentication=apikey
    //method=post

    const options={
        method:"POST",
        auth:"shaurya:233336cb383849d10ca06d9d1b78a379-us14"
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


app.listen(port,()=>{
  console.log(`Starting server on Port ${port}`);
  
});