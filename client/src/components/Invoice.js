import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import axios from "axios";
import moment from "moment";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { Container, Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import NavBar from "./Navbar";
import ReactToPdf from "react-to-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const ref = React.createRef();
const options = {
  orientation: "portrait",
  unit: "in",
  format: "A4",
};

const initialState = {
  items: [{ itemName: "", unitPrice: "", quantity: "", discount: "" }],
  totalAmount: 0,
  client: { name: "", email: "", phone: "" },
  owner: "",
  createdAt: "",
  dueDate: "",
  invoiceNumber: Math.floor(Math.random() * 100000),
  status: "unpaid",
};
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  table: {
    minWidth: 650,
  },

  headerContainer: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(1),
  },
}));

const Invoice = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [invoiceData, setInvoiceData] = useState(initialState);
  const [clients, setClient] = useState({ name: "", email: "", phone: "" });
  const [user, setUser] = useState("");
  const [creatAt, setCreatAt] = useState("");
  const [totalamount, setTotalAmount] = useState(0);
  useEffect(() => {
    let token = localStorage.getItem("token");
    let decode = jwt_decode(token);
    setUser(decode);
  }, []);
  useEffect(() => {
    let cdate = new Date();
    let sdate = new Date();

    let dued = cdate.setDate(cdate.getDate() + 3);
    dued = moment(dued).format("MMM Do YYYY");
    sdate = moment(sdate).format("MMM Do YYYY");

    setInvoiceData({
      ...invoiceData,
      dueDate: dued,
      createdAt: sdate,
    });
    Total();
  }, []);

  const Total = () => {
    var arr = document.getElementsByName("amount");
    var totalPrice = 0;
    arr.forEach((a) => {
      if (a.value) {
        totalPrice += +a.value;
      }
    });

    setTotalAmount(totalPrice);
  };

  const handleChange = (index, e) => {
    const values = [...invoiceData.items];
    values[index][e.target.name] = e.target.value;
    setInvoiceData({
      ...invoiceData,
      client: clients,
      items: values,
      owner: user.email,
      totalAmount: totalamount,
    });
    Total();
  };
  const RemoveField = (index) => {
    const values = invoiceData.items;
    values.splice(index, 1);
    setInvoiceData((prevState) => ({ ...prevState, values }));
    Total();
  };
  const AddField = (e) => {
    e.preventDefault();

    setInvoiceData((prevState) => ({
      ...prevState,
      items: [
        ...prevState.items,
        { itemName: "", unitPrice: "", quantity: "", discount: "", amount: "" },
      ],
    }));
    Total();
  };

  const submitInvoice = async () => {
    console.log(invoiceData);

    await axios
      .post("http://localhost:7799/addInvoice", invoiceData)
      .then((res) => console.log(res.data));
    navigate("/records");
  };
  const sendPdf = () => {
    const input = document.getElementById("pdfToPrint");
    console.log(input);

    html2canvas(input, { useCORS: true }).then((canvas) => {
      const pdf = new jsPDF();
      const img = canvas.toDataURL(
        "https://image.shutterstock.com/image-vector/invoice-typographic-stamp-sign-badge-260nw-1027820257.jpg"
      );
      pdf.addImage(img, "JPEG", 15, 40, 180, 160);
      const filedata = pdf.output("blob");

      let formData = new FormData();
      formData.append("file", filedata, "samplefile");
      axios.post(
        `http://localhost:7799/sentEmail/${user.email}/${clients.email}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    });
  };

  return (
    <div>
      <NavBar />
      <div ref={ref} id="pdfToPrint">
        <form className="mu-form">
          <Container className={classes.headerContainer}>
            <Grid container justifyContent="space-between">
              <Grid item></Grid>
              <Grid item>
                <Typography
                  variant="overline"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  INVOICE
                </Typography>
              </Grid>
            </Grid>
          </Container>
          <Divider />
          <Container>
            <Grid
              container
              justifyContent="space-between"
              style={{ marginTop: "40px" }}
            >
              <Grid item style={{ width: "50%" }}>
                <Container>
                  <Typography
                    variant="overline"
                    style={{ color: "black", paddingRight: "3px" }}
                    gutterBottom
                  >
                    Bill From
                  </Typography>{" "}
                  <br></br>
                  <Typography
                    variant="overline"
                    style={{ color: "grey", paddingRight: "3px" }}
                    gutterBottom
                  >
                    {user.userName}
                  </Typography>
                  <br></br>
                  <Typography
                    variant="overline"
                    style={{ color: "grey", paddingRight: "3px" }}
                    gutterBottom
                  >
                    {user.email}
                  </Typography>
                </Container>
                <Container>
                  <Typography
                    variant="overline"
                    style={{ color: "black", paddingRight: "3px" }}
                    gutterBottom
                  >
                    Bill to
                  </Typography>
                  <InputBase
                    style={{ width: "100%" }}
                    outline="dark"
                    sx={{ ml: 1, flex: 1 }}
                    type="text"
                    name="name"
                    onChange={(e) =>
                      setClient({ ...clients, name: e.target.value })
                    }
                    placeholder="client name"
                  />
                  <InputBase
                    style={{ width: "100%" }}
                    outline="dark"
                    sx={{ ml: 1, flex: 1 }}
                    type="text"
                    name="email"
                    onChange={(e) =>
                      setClient({ ...clients, email: e.target.value })
                    }
                    placeholder="client email"
                  />
                  <InputBase
                    style={{ width: "100%" }}
                    outline="dark"
                    sx={{ ml: 1, flex: 1 }}
                    type="number"
                    name="phone"
                    onChange={(e) =>
                      setClient({ ...clients, phone: e.target.value })
                    }
                    placeholder="client number"
                  />
                </Container>
              </Grid>

              <Grid item style={{ marginRight: 20, textAlign: "right" }}>
                <Typography
                  variant="overline"
                  style={{ color: "gray" }}
                  gutterBottom
                >
                  Status
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    color: invoiceData.status === "paid" ? "green" : "red",
                  }}
                >
                  {/* <select name="status">
                        <option  onClick={()=>setInvoiceData({...setInvoiceData,status:"paid"})}>paid</option>
                        <option  onClick={()=>setInvoiceData({...setInvoiceData,status:"unpaid"})}>unpaid</option>
                        
                        </select> */}
                  {invoiceData.status === "paid" ? "Paid" : "Unpaid"}
                </Typography>
                <Typography
                  variant="overline"
                  style={{ color: "gray" }}
                  gutterBottom
                >
                  Date
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {moment().format("MMM Do YYYY")}
                </Typography>
                <Typography
                  variant="overline"
                  style={{ color: "gray" }}
                  gutterBottom
                >
                  Due Date
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {invoiceData.dueDate}
                </Typography>
                <Typography variant="overline" gutterBottom>
                  Amount
                </Typography>
                <Typography variant="h6" gutterBottom>
                  ${totalamount}
                </Typography>
              </Grid>
            </Grid>
          </Container>
          <div>
            <TableContainer component={Paper} className="tb-container">
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Disc(%)</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceData.items.map((itemField, index) => (
                    <TableRow key={index}>
                      <TableCell scope="row" style={{ width: "40%" }}>
                        {" "}
                        <InputBase
                          style={{ width: "100%" }}
                          outline="none"
                          sx={{ ml: 1, flex: 1 }}
                          type="text"
                          name="itemName"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.itemName}
                          placeholder="Item name or description"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="quantity"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.quantity}
                          placeholder="0"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="unitPrice"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.unitPrice}
                          placeholder="0"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="discount"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.discount}
                          placeholder="0"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="amount"
                          onChange={(e) => handleChange(index, e)}
                          value={
                            itemField.quantity * itemField.unitPrice -
                            (itemField.quantity *
                              itemField.unitPrice *
                              itemField.discount) /
                              100
                          }
                          disabled
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => RemoveField(index)}>
                          <DeleteOutlineRoundedIcon
                            style={{ width: "20px", height: "20px" }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div>
              <button onClick={AddField}>+</button>
            </div>
          </div>
        </form>
      </div>
      <Grid container justifyContent="center">
        <ReactToPdf
          targetRef={ref}
          filename="div-blue.pdf"
          options={options}
          x={0}
          y={0}
          scale={0.5}
        >
          {({ toPdf }) => (
            <Button
              variant="contained"
              style={{ justifyContentContent: "center" }}
              onClick={() => {
                toPdf();
                submitInvoice();
              }}
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<SaveIcon />}
            >
              save and continue
            </Button>
          )}
        </ReactToPdf>
        <Button
          variant="contained"
          style={{ justifyContentContent: "center" }}
          onClick={() => sendPdf()}
          color="primary"
          size="large"
          className={classes.button}
        >
          sent mail
        </Button>
      </Grid>
    </div>
  );
};

export default Invoice;
