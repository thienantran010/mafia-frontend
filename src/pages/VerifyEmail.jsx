import { Typography, Container, Link, Stack } from '@mui/material';
import { useParams, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';


// this page never gets seen because AuthProvider will redirect to
// login page if there is no access token
export default function VerifyEmail() {
    const { id } = useParams()
    const [status, setStatus] = useState("Confirming your email...");

    useEffect(() => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/auth/${id}`;
        const options = {
            method: "POST",
        }
        const verifyEmail = async () => {
            const response = await fetch(url, options);
            const data = await response.json();
            setStatus(data.message);
        }

        verifyEmail().catch((error) => console.log(error));
    }, [])

    return (
        <Container>
            <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh">
                <Typography variant="h4" sx={{m: 1}}>{status}</Typography>
                <Link component={NavLink} to="/login">Login here!</Link>
            </Stack>
        </Container>
    )
}