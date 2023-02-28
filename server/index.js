const express = require("express");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const SecreteKey = "dskjvhsx9832y48y3sanc";
const mongoose = require("mongoose");
const User = require("./Schemas/user_schema");
const Invoice = require("./Schemas/invoice_schema");
const nodemailer = require("nodemailer");
const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const app = express();
app.use(express.json());

app.use(cors());
mongoose.connect("mongodb://localhost:27017/invoiceApp");

app.post("/register", async (req, res) => {
  console.log(req.body);
  let ins = new User({
    firstName: req.body.firstName,
    email: req.body.email,
    lastName: req.body.lastName,
    password: req.body.password,
    userName: req.body.userName,
  });
  ins.save((err) => {
    console.log(err);
    if (err) {
      res.send("user exist with same email id");
    } else {
      res.send("data added");
    }
  });
});
app.post("/login", async (req, res) => {
  console.log(req.body);
  User.findOne(
    { email: req.body.email, password: req.body.password },
    (err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        let payload = {
          id: data._id,
          email: data.email,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
        };
        const token = jwt.sign(payload, SecreteKey, { expiresIn: 30000 });

        res.json({ error: 0, msg: "login succesfull", token: token });
      }
    }
  );
});

app.post("/addInvoice", async (req, res) => {
  console.log(req.body);
  let invc = new Invoice({
    dueDate: req.body.dueDate,
    items: req.body.items,
    status: req.body.status,
    invoiceNumber: req.body.invoiceNumber,
    createdAt: req.body.createdAt,
    client: req.body.client,
    owner: req.body.owner,
    totalAmount: req.body.totalAmount,
  });
  invc.save((err) => {
    console.log(err);
    if (err) {
      res.send("internal error");
    } else {
      res.send("invioce added");
    }
  });
});
app.post("/getInvoiceByUser", async (req, res) => {
  Invoice.find({ owner: req.body.email }, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
app.post("/deleteInvoice", (req, res) => {
  console.log(req.body);
  Invoice.deleteOne({ _id: req.body.id }, (err, data) => {
    if (err) throw err;
    else {
      res.send(data);
    }
  });
});
app.post("/updateStatus", (req, res) => {
  console.log(req.body);
  Invoice.updateOne(
    { _id: req.body._id },
    { $set: { status: "PAID" } },
    (err, data) => {
      if (err) throw err;
      else {
        res.send(data);
      }
    }
  );
});

app.post("/sentEmail/:oemail/:cemail", upload.single("file"), (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: "gauravbhawsar98@gmail.com",
      pass: "Gaurav@1998",
    },
  });
  let mailOptions = {
    from: "",
    to: req.params.cemail,
    subject: "Invoice PDF",
    text: `Dear Customer,
   Your Have Successfully downloaded the pdf and We have attached the pdf here. Please find Attached PDF.
   Thank You!`,
    attachments: [
      {
        filename: "invoice.pdf",
        content: req.file.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + data.response);
    }
  });
  res.send("Email Sent!");
});

app.listen(7799, (err) => {
  if (err) console.log(err);
  console.log("working on Port 7799");
});
