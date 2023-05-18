import  React,{useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { Navigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            {/* </Link>{' '} */}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function SignIn() {
    const navigate = useNavigate();
    const [flag, setflag] = useState(false);
    const [loading,setloading] = useState(false);
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
       
        var email =  data.get('email')
        var password = data.get('password')

        axios({
            method: "post",
            url: "http://localhost:3002/api/v1/secure/login",
            data: { email, password },
          }).then((response) => {

            if (response.data.status === "success") {
                //  history.push("/")
                setflag(true);
                localStorage.setItem(
                    "auth_token",
                    JSON.stringify({
                      auth_token: response.data.authtoken,
                      name: response.data.firstname,
                      lastname: response.data.lastname,
                      userid:response.data.id
                    })
                  );
                
              }
          })
          .catch((error) => {

           console.log(error);
          })    
        
        }

        if (flag) {
            return <Navigate to={"/editor/0b060dd5-b6ad-45"} />;
          }
        
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                       
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}