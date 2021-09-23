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
  const {
    fullName,
    artistName,
    country,
    email,
    age,
    description,
    images,
    virtualSkit,
  } = req.body;
  const subs =
    images?.map((image, id) => `#${id + 1} ===> ${image}`).join("<br/>") || "";

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: `cosplay submission of ${fullName}`,
    html: `
    <h1>cosplay submission of ${fullName}</h1>
    <b>full name: </b> ${fullName}<br/>
    <b>artist name: </b> ${artistName}<br/>
    <b>email: </b> ${email}<br/>
    <b>country: </b> ${country}<br/>
    <b>age: </b> ${age}<br/>
    <b>description: </b> ${description}<br/>
    <b>images: </b><br/> ${subs}<br/>
    <b>virtualSkit: </b> ${virtualSkit}<br/>
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
        data: info.response,
      });
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
