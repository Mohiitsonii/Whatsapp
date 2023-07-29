const express = require("express");
const body_parser = require("body-parser");
const { default: axios } = require("axios");
require('dotenv').config();

const app = express();
app.use(body_parser.json());

app.listen(8000 ||process.env.PORT, () => {
  console.log("webhook is listing");
});

const mytoken = process.env.TOKEN;
const token = process.env.MY_TOKEN

// console.log(mytoken,token)


app.get("/webhooks", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query[" hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challenge);
    } else {
      res.status(404);
    }
  }
});

app.post("/webhook", (req, res) => {
  let body_param = req.body;
  console.log(JSON.stringify(body_param, null, 2));
  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.message &&
      body_param.entry[0].changes[0].value.message[0]
    ) {
      let phn_no_id = body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body.entry[0].changes[0].value.message[0].from;
      let msg_body = body.entry[0].changes[0].value.message[0].text.body;

      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v17.0/" +
          phn_no_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi....I am mohit ",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },

      });
      res.sendStatus(200);
    }
    else{
      res.sendStatus(404);
    }
  }
});

app.get("/",(req,res)=>{
  console.log("The service is going on")
})