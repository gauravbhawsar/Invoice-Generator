import React, {useState, useEffect} from 'react'
import jwt_decode from 'jwt-decode';
import axios from "axios";
import Navbar from './Navbar';
import { Navigate } from 'react-router'
import { Col, Row } from "react-bootstrap";
import { Card, CardContent } from '@mui/material';
import {Container} from "react-bootstrap";

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

export default function Dashboard() {
    
    const [status, setstatus] = useState({invoices:[],paymentReceived:0, pendingAmount:0, totalAmount:0, paidInvoice:0, unpaidInvoice:0,totalInvoice:0  })
    useEffect(async() => {
        if (localStorage.getItem('token') !== undefined) {
            let token = localStorage.getItem('token');
            let decode = jwt_decode(token);
            let data = [];
            let formdaata={
                email:decode.email
            }
           await axios.post("http://localhost:7799/getInvoiceByUser",formdaata).then(res=>{
                data=[...res.data]
                
            })
            
            let total=0
            let upaid=0
            let pamount=0
            let totalinvoice=0
            data.forEach(ele=>{
                
                totalinvoice +=1
                if(ele.status === "unpaid"){
                    upaid +=1
                    
                    total += ele.totalAmount
                    pamount +=ele.totalAmount
                    
                }
                else{
                    
                    total += ele.totalAmount
                    
                }
            })
            setstatus({invoices:data, paymentReceived: total-pamount, pendingAmount:pamount, totalAmount:total, paidInvoice:totalinvoice-upaid, unpaidInvoice:upaid,totalInvoice:totalinvoice })
        }
     }, [])

    
    
 
    return (
        <>
        {localStorage.getItem('token')!==undefined ?
        <div>
            <Navbar/>
            <Container>
            <Row className='m-3'>
            <Col>
            <Card>
                <CardContent>
             <MonetizationOnIcon style={{fontSize: 35}}/>  <label className='font-weight-bold'>Payment Received: </label><br/> {status.paymentReceived}
                </CardContent>
           </Card>
            </Col>
            <Col>
            <Card>
                <CardContent>
               <PendingActionsIcon style={{fontSize: 35}}/> <label className='font-weight-bold'> Pending Amount: </label> <br/> {status.pendingAmount}
                </CardContent>
           </Card>
            </Col>
            <Col>
            <Card>
                <CardContent>
                <AccountBalanceWalletIcon  style={{fontSize: 35}}/>  <label className='font-weight-bold'> Total Amount: </label><br/> {status.totalAmount}
                </CardContent>
           </Card>
            </Col>
           
           </Row>

           <Row className='m-3'>
            <Col>
            <Card>
                <CardContent>
               <DescriptionIcon style={{fontSize: 35}}/> <label className='font-weight-bold'>  Paid Invoice: </label> <br/> {status.paidInvoice}
                </CardContent>
           </Card>
            </Col>
            <Col>
            <Card>
                <CardContent>
                <PendingActionsIcon style={{fontSize: 35}}/>  <label className='font-weight-bold'>  Unpaid Invoice: </label> <br/> {status.unpaidInvoice}
                </CardContent>
           </Card>
            </Col>
            <Col>
            <Card>
                <CardContent>
                
               <ReceiptIcon style={{fontSize: 35}}/> <label className='font-weight-bold'> Total Invoice: </label> <br/> {status.totalInvoice}
                </CardContent>
           </Card>
            </Col>
           
           </Row>
           </Container>
           </div>
        
        : <Navigate to="/"></Navigate>}
        </>
    )
}