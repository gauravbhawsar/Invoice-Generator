import React from "react";
import { Nav, Navbar, Container,Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {  useNavigate } from "react-router";

export default function NavBar() {
    const navigate=useNavigate();
  const logout=()=>{
      localStorage.removeItem('token');
      navigate('/')
  }
 
  return (
    <div>
      <>
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand>Invioce Generator</Navbar.Brand>
            <Nav className="me-auto">
            <Link style={{ textDecoration: "none", color: "white", "marginTop":"6px" }}to="/dashboard" >Dashboard</Link>
            <Link style={{ textDecoration: "none", color: "white", "marginTop":"6px" ,"marginLeft":"40px"}}to="/records" >Records</Link>
            <Link style={{ textDecoration: "none", color: "white","marginLeft":"40px", "marginTop":"6px" }}to="/invoice" >CreateInvoice</Link>
             
              <Button style={{ textDecoration: "none", color: "white", "marginLeft":"40px" }} onClick={()=>logout()} >LOGOUT</Button>
           
            </Nav>
          </Container>
        </Navbar>
      </>
    </div>
  );
}
