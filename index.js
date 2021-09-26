console.clear();

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_PASSWORD,
  },
});

// routes
app.post("/submit", (req, res) => {
  const props = Object.entries(req.body);
  let data = "";
  props.forEach((prop) => {
    data = data + `<b>${prop[0]}:</b> ${prop[1]} <br/>`;
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: req.body.to,
    subject: `${req.body.subject || `email from ${req.body.email}`}`,
    html: `
    <h1>${req.body.subject || `email from ${req.body.email}`}</h1>
    ${data}
    `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({
        status: 500,
        message: "ERROR",
        error,
      });
    } else {
      res.json({
        status: 200,
        message: "Ok",
        data,
      });
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});

//
