import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(URL, {
    withCredentials: true,
});

export default socket;