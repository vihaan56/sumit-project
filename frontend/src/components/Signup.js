import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import axios from "axios";

const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [flag, setflag] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [message, setmessage] = useState("");

  if (localStorage.getItem("auth_token") != null) {
    const authaxios = axios.create({
      baseURL: "http://localhost:3002",
      headers: {
        "auth-token": JSON.parse(localStorage.getItem("auth_token")).auth_token,
      },
    });
    const headers = {
      auth: JSON.parse(localStorage.getItem("auth_token")).auth_token,
    };
    authaxios
      .post(`http://localhost:3002/api/v1/secure/checktoken`, {
        headers: headers,
      })
      .then((response) => {
        console.log(response);

        if (response.data.status === "success") {
          //  history.push("/")
          setflag(true);
        }
      })
      .catch((response) => {
        console.log(response);
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const firstname = data.get("firstName");
    const lastname = data.get("lastName");
    const email = data.get("email");
    const password = data.get("password");
    setloading(true);

    axios({
      method: "post",
      url: "http://localhost:3002/api/v1/secure/register",
      data: { firstname, lastname, email, password },
    })
      .then((response) => {
        if (response.data.status === "success") {
          //  history.push("/")
          seterror(false);
          setflag(true);

          setloading(false);
          localStorage.setItem(
            "auth_token",
            JSON.stringify({
              auth_token: response.data.authtoken,
              name: response.data.firstname,
              lastname: response.data.lastname,
              userid: response.data.id,
            })
          );
        } else if (response.data.status === "error") {
          seterror(true);
          setloading(false);

          setmessage(response.data.message);
        }
      })
      .catch((error) => {
        setloading(false);

        seterror(true);
        setmessage("Some internal server error occurred");
      });
  };

  if (flag) {
    return (
      <Navigate
        to={`/user/${JSON.parse(localStorage.getItem("auth_token")).userid}`}
      />
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <br></br>
          {error ? <Alert severity="error">{message}</Alert> : ""}

          <Box
            component="form"
            validate="true"
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading?("Loading..."):("Sign Up")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
