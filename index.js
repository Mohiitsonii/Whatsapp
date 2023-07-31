const express = require("express");
const body_parser = require("body-parser");
const { default: axios } = require("axios");
require('dotenv').config();

const app = express();
app.use(body_parser.json());

app.listen(8000 ||process.env.PORT, () => {
  console.log("webhook is listing");
});

const api_key = process.env.MY_TOKEN;
const random_token = process.env.TOKEN;

// console.log(mytoken,token)


app.get("/webhook", (req, res) => {
 const mode = req.query["hub.mode"];
 const challenge = req.query["hub.challenge"];
 const token = req.query["hub.verify_token"];

 console.log(
   "this is Webhook called ",
   req.query["hub.mode"],
   req.query["hub.challenge"],
   req.query["hub.verify_token"]
 );
//  console.log("this is params",req.params);
//   console.log(mode, challenge, token);
  console.log(mode, challenge, token);
  // res.status.send(mode,)

  if (mode && token) {
    if (mode === "subscribe" && token === random_token) { 
      res.status(200).send(challenge);
    } else {
      res.status(404);
    }
  }
});

app.post("/webhook", (req, res) => {
  //i want some

  let body_param = req.body;

  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    console.log("inside body param");
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      console.log("phone number " + phon_no_id);
      console.log("from " + from);
      console.log("boady param " + msg_body);

      axios({
        method: "POST",
        url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/messages",
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi.. I'm mohit, your message is " + msg_body,
          },
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/",(req,res)=>{
  res.status(200).send("hello Everything is working fine")
  // console.log("The service is going on")
})