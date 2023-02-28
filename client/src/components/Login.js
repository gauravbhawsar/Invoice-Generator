import React, { useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/button";
import { useNavigate } from "react-router";
import { FormControl, InputLabel, Input, InputAdornment } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";

function Login() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handler = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };
  const checkdata = async () => {
    const formData = {
      email: state.email,
      password: state.password,
    };
    await axios
      .post("http://localhost:7799/login", formData)

      .then((res) => {
        if (res.data.error === 0) {
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          navigate("/records");
        } else {
          alert("check email or password");
        }
      });
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(./images/loginBG.png)`,
          height: "100vh",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Container
          style={{
            height: "70%",
            width: "30%",
            borderRadius: "1%",
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
              paddingBottom: "20px",
            }}
          >
            Login
          </h1>

          <FormControl
            fullWidth
            sx={{ m: 1, width: "30ch" }}
            variant="standard"
          >
            <InputLabel htmlFor="component-simple">Email</InputLabel>
            <Input
              id="component-simple"
              type="email"
              name="email"
              onBlur={(e) => handler(e)}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl
            fullWidth
            sx={{ m: 1, width: "30ch" }}
            variant="standard"
            className="mt-4"
          >
            <InputLabel htmlFor="component-simple">Password</InputLabel>
            <Input
              id="component-simple"
              type="password"
              name="password"
              onBlur={(e) => handler(e)}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            className="mt-3"
            style={{ width: "50%" }}
            onClick={() => checkdata()}
          >
            Login
          </Button>
          <p className="mt-2">
            Or sign Up Using{" "}
            <a href="/registration">
              <span style={{ fontFamily: "fantasy", color: "grey" }}>
                SIGN UP
              </span>
            </a>
          </p>
        </Container>
      </div>
    </>
  );
}

export default Login;
