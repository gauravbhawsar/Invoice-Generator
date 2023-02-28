import {useEffect,useState} from "react"
import axios from "axios"
import {Button} from "react-bootstrap";
import jwt_decode from "jwt-decode";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import NavBar from './Navbar'

const Records = () => {
    const[invoice,setInvoice]=useState([]);
    let inv;
    useEffect(() => {
        refreshContent();
    },[])
    const refreshContent=async()=>{
        let token=localStorage.getItem('token');
        let decode=jwt_decode(token);
        let data={email: decode.email};
        // console.log(data);
       await axios.post("http://localhost:7799/getInvoiceByUser",data)
       .then((res) => inv=res.data);
            setInvoice(inv);
        }
    const deleteInvoice= async (incId) =>{
       
        let invoiceid={id: incId._id};
     
        await axios.post("http://localhost:7799/deleteInvoice",invoiceid)
        .then((res)=>res.data);
        refreshContent();
    }
    const updateStatus= async (sta) =>{
        
        await axios.post("http://localhost:7799/updateStatus",sta)
        .then((res)=>res.data);
        refreshContent();
    }
    return (
        <div>
            <NavBar/>
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Sr No </TableCell>
            <TableCell>Invoice No </TableCell>
            <TableCell >Client Name</TableCell>
            <TableCell >Status</TableCell>
            <TableCell >Amount</TableCell>
            <TableCell >Action</TableCell>
    
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice && invoice.map((row,i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell>{i}</TableCell>
              <TableCell component="th" scope="row">
                {row.invoiceNumber}
              </TableCell>
              <TableCell>{row.client.name}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.totalAmount}</TableCell>
              <TableCell><Button onClick={()=>updateStatus(row)} >Update</Button> <Button onClick={()=>deleteInvoice(row)}>Delete</Button></TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
    )
}

export default Records
