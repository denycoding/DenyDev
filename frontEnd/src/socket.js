import { io } from "socket.io-client";

const SOCKET_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const socket = io(SOCKET_URL, {
  autoConnect: false, // connect manually after login
  auth: (cb) => {
    // read the token fresh on every connection attempt
    cb({ token: localStorage.getItem("token") });
  },
});

export default socket;
