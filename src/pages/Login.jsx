import { useState } from 'react';
import { Stack, Button, Container, FormControl, InputAdornment, 
        InputLabel, OutlinedInput, IconButton, Link, Typography} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../providers/AuthProvider';
import { Navigate, NavLink } from 'react-router-dom';
import "../styles/Login.css"

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formFields, setFormFields] = useState({
        email: "",
        password: ""
    })

    const {accessToken, setAccessToken, setUsername} = useAuth();
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
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formFields.email,
                    password: formFields.password
                })
            }
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, options);
            const data = await response.json();
            console.log(...response.headers);
            setAccessToken(data.accessToken);
            setUsername(data.username);
        }
        catch (error) {
            console.log(error);
        }
    }
    console.log(`Access Token ${accessToken}`);
    return (
        accessToken ? <Navigate to="/" /> : 
        <Stack
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
            <Typography variant="h1" sx={{fontSize: 30}}>Mafia Web App</Typography>
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
            <Button variant="contained" sx={{m: 1}} onClick={handleClick}>Log In</Button>
            <Link component={NavLink} to="/register">Don't have an account? Register here!</Link>
        </Stack>
    );
}

export default function Login() {
    return (
        <LoginForm></LoginForm>
    )
}