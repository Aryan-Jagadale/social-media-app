import React, { useEffect, useState } from "react";
import "./login.css";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
//import { useDispatch, useSelector } from "react-redux";
//import { loginUser } from "../../Actions/User";
//import { useAlert } from "react-alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login">
      <form className="loginForm">
        <Typography
          variant="h3"
          style={{
            padding: "2vmax",
          }}
        >
          Social App
        </Typography>

        <input
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <Link to="/forgot/password">
          <Typography>Forgot Password?</Typography>
        </Link>

        <Button type="submit">Login</Button>

        <Link to="/register">
          <Typography>New User?</Typography>
        </Link>
      </form>
    </div>
  );
};

export default Login;
