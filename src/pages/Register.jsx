import { useState } from 'react';
import { Stack, Button, Container, FormControl, InputAdornment, 
        InputLabel, OutlinedInput, IconButton, Typography, Alert, AlertTitle, Link} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../providers/AuthProvider';
import { Navigate, NavLink} from 'react-router-dom';
import "../styles/Login.css"

function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formFields, setFormFields] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [status, setStatus] = useState({
        type: "",
        message: ""
    })

    const {accessToken, setAccessToken} = useAuth();
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleChange = (event) => {
        setFormFields({...formFields, [event.target.name]: event.target.value})
    }

    async function handleClick(e) {
        try {
            e.preventDefault();
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: formFields.username,
                    email: formFields.email,
                    password: formFields.password
                })
            }
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, options);
            const data = await response.json();
            console.log(response.status);
            (response.status >= 400) ? setStatus({
                type: "error",
                message: data.message
            }) : setStatus({
                type: "success",
                message: data.message
            })
        }
        catch (error) {
            console.log(error);
        }
        
    }
    return (
        accessToken ? <Navigate to="/" /> : 
        <Stack
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
            <Typography variant="h1" sx={{fontSize: 30}}>Mafia Web App</Typography>
            <FormControl sx={{ m: 1, width: '40ch'}} variant="outlined">
                <InputLabel htmlFor="email">Username</InputLabel>
                <OutlinedInput
                    id="username"
                    name="username"
                    required
                    type="text"
                    label="Username"
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ m: 1, width: '40ch'}} variant="outlined">
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                    id="email"
                    name="email"
                    required
                    type="text"
                    label="Email"
                    onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                    id="password"
                    name="password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChange}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Password"
                />
            </FormControl>
            <Button variant="contained" sx={{m: 1}} onClick={handleClick}>Register</Button>
            {
                status.type ? (
                    <Alert severity={status.type} sx={{mb: 1}}>
                        <AlertTitle>{status.type}</AlertTitle>
                        {status.message}
                    </Alert>
                ) : null
            }
            <Link component={NavLink} to="/login">Already have an account? Log in here!</Link>
        </Stack>
    );
}

export default function Register() {
    return (
        <RegisterForm></RegisterForm>
    )
}