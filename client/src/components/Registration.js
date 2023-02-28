import React from "react";
import axios from "axios";
import {  Container } from "react-bootstrap";
import {FormControl,InputLabel,Input,InputAdornment} from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/button";
const regForFirstName = RegExp("[a-zA-Z][a-zA-Z ]*");
const regForUserName = RegExp(/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])[a-zA-Z0-9]+$/);
const regForEmail = RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");
const regForpassword = RegExp("^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&*])(?=.{8,})");
export default function Registration() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    firstName: null,
    lastName: null,
    userName:null,
    email: null,
    password: null,
    conpassword: null,
    errors: {
      firstName: "",
      lastName: "",
      userName:"",
      email: "",
      password: "",
      conpassword: "",
    },
  });

  const handler = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });

    let errors = state.errors;

    switch (name) {
      case "firstName":
        errors.firstName = regForFirstName.test(value)
          ? ""
          : "Invalid Name, Use Character Only";
        setState({ ...state, firstName: value });
        break;

      case "lastName":
        errors.lastName = regForFirstName.test(value)
          ? ""
          : "Invalid Last Name, Use Character Only";
        setState({ ...state, lastName: value });
        break;
        case "userName":
        errors.userName = regForUserName.test(value)
          ? ""
          : "Invalid User Name";
        setState({ ...state, userName: value });
        break;

      case "email":
        errors.email = regForEmail.test(value) ? "" : "Invalid Email-Id";
        setState({ ...state, email: value });
        break;
      case "password":
        errors.password = regForpassword.test(value) ? "Invalid Email-Id" : "";
        setState({ ...state, password: value });
        break;
      case "conpassword":
        errors.conpassword = 
          state.password === value ? "" : "password is not matched";
        break;
      default:
        return alert("form validated");
    }
    setState({ ...state, [name]: value });
  };
  const formSubmit = async (event) => {
    const formData = {
      firstName: state.firstName,
      lastName:state.lastName,
      userName:state.userName,
      email: state.email,
      password: state.password,
     
    };
    if (validate(state.errors)) {
    
       await axios.post("http://localhost:7799/register", formData)

        .then((res) => res.data);
        navigate('/');
    } else {
      alert("Invalid form");
    }
  };
  const validate = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const { errors } = state;
  return (
    <div  style={{"backgroundImage":`url(./images/loginBG.png)`,"height":'100vh',alignItems:"center", display:"flex"}}>
    <Container 
      style={{
          height:"95%",
        width: "30%",
        borderRadius:'1%',
        border: "1px",
        padding: "50px",
        backgroundColor: "white",
      }}
    >
      <h1
        style={{
          color: "black",
          marginBottom: "10px",
          fontFamily: "poppins",
          textAlign: "center",
          paddingBottom:"20px"
        }}
      >
        Register
      </h1>
      <FormControl fullWidth sx={{ m: 1,width: '30ch' }} variant="standard">
      <InputLabel  htmlFor="component-simple" >First Name</InputLabel>
      <Input  id="component-simple" type="email"
          name="firstName" onBlur={(e) => handler(e)} startAdornment={
          <InputAdornment position="start">
            <BadgeIcon/>
          </InputAdornment>
        }/> 
        {errors.firstName.length > 0 && (
            <span style={{ color: "red" }}>{errors.firstName}</span>
          )}
    </FormControl>
    <FormControl fullWidth sx={{ m: 1,width: '30ch' }} variant="standard">
      <InputLabel  htmlFor="component-simple" >Last Name</InputLabel>
      <Input  id="component-simple" type="email"
          name="lastName" onBlur={(e) => handler(e)} startAdornment={
          <InputAdornment position="start">
            <BadgeIcon/>
          </InputAdornment>
        }/> 
        {errors.lastName.length > 0 && (
            <span style={{ color: "red" }}>{errors.lastName}</span>
          )}
    </FormControl><FormControl fullWidth sx={{ m: 1,width: '30ch' }} variant="standard">
      <InputLabel  htmlFor="component-simple" >User Name</InputLabel>
      <Input  id="component-simple" type="email"
          name="userName" onBlur={(e) => handler(e)} startAdornment={
          <InputAdornment position="start">
            <BadgeIcon/>
          </InputAdornment>
        }/> 
        {errors.userName.length > 0 && (
            <span style={{ color: "red" }}>{errors.userName}</span>
          )}
    </FormControl>
      <FormControl fullWidth sx={{ m: 1,width: '30ch' }} variant="standard">
      
      <InputLabel  htmlFor="component-simple" >Email</InputLabel>
      
      <Input  id="component-simple" type="email"
          name="email"   startAdornment={
          <InputAdornment position="start">
            <AccountCircleIcon/>
          </InputAdornment>
        }/> {errors.email.length > 0 && (
            <span style={{ color: "red" }}>{errors.email}</span>
          )}
    </FormControl>
    <FormControl fullWidth sx={{ m: 1,width: '30ch' }} variant="standard" className="mt-4">
      <InputLabel htmlFor="component-simple">Password</InputLabel>
      <Input id="component-simple" type="password"
          name="password" startAdornment={
          <InputAdornment position="start">
            <LockIcon/>
          </InputAdornment>
        } />
        {errors.password.length > 0 && (
            <span style={{ color: "red" }}>{errors.password}</span>
          )}
    </FormControl>
    <FormControl fullWidth sx={{ m: 1,width: '30ch' }} variant="standard">
      <InputLabel  htmlFor="component-simple" >Confirm Password</InputLabel>
      <Input  id="component-simple" type="password"
          name="conpassword" onBlur={(e) => handler(e)} startAdornment={
          <InputAdornment position="start">
            <LockIcon/>
          </InputAdornment>
        }/> 
        {errors.conpassword.length > 0 && (
            <span style={{ color: "red" }}>{errors.conpassword}</span>
          )}
    </FormControl>
      
      
        <Button
          className="mt-3"
          style={{ width: "50%"}}
          onClick={() => formSubmit()}
        >
          Register
        </Button>
        <p className="mt-2">If already registerd click to <a href="/">Login</a></p>

        
         
      
    </Container>
    </div>
    
  );
}
