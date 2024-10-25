// import express from "express";
// import cors from "cors"; // Import CORS
// import { createServer } from "http";
// import { Server } from "socket.io";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";

// const app = express();
// const server = createServer(app);
// const io = new Server(server);
// const allusers = {};

// // /your/system/path
// const __dirname = dirname(fileURLToPath(import.meta.url));

// // Enable CORS for all origins (you can restrict this later)
// app.use(
//   cors({
//     origin: "*", // Replace with your client's domain
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

// // Exposing public directory to outside world
// app.use(express.static("public"));

// // Handle incoming HTTP request
// app.get("/", (req, res) => {
//   console.log("GET Request /");
//   res.sendFile(join(__dirname + "/app/index.html"));
// });

// // Handle socket connections
// io.on("connection", (socket) => {
//   console.log(
//     `Someone connected to socket server and socket id is ${socket.id}`
//   );

//   socket.on("join-user", (username) => {
//     console.log(`${username} joined socket connection`);
//     allusers[username] = { username, id: socket.id };
//     // Inform everyone that someone joined
//     io.emit("joined", allusers);
//   });

//   socket.on("offer", ({ from, to, offer }) => {
//     console.log({ from, to, offer });
//     io.to(allusers[to].id).emit("offer", { from, to, offer });
//   });

//   socket.on("answer", ({ from, to, answer }) => {
//     io.to(allusers[from].id).emit("answer", { from, to, answer });
//   });

//   socket.on("end-call", ({ from, to }) => {
//     io.to(allusers[to].id).emit("end-call", { from, to });
//   });

//   socket.on("call-ended", (caller) => {
//     const [from, to] = caller;
//     io.to(allusers[from].id).emit("call-ended", caller);
//     io.to(allusers[to].id).emit("call-ended", caller);
//   });

//   socket.on("icecandidate", (candidate) => {
//     console.log({ candidate });
//     // Broadcast to other peers
//     socket.broadcast.emit("icecandidate", candidate);
//   });
// });

// // Store the current movement state
// let movementData = { direction: null };

// // Movement API routes
// app.post("/api/move/:direction", (req, res) => {
//   const { direction } = req.params;
//   let message = "";
//   console.log("GET request received with direction: ", direction); // Add this log

//   console.log(`Move: ${direction}`);

//   // Logic to handle the movedment based on the direction
//   switch (direction) {
//     case "front":
//       message = "Moving forward";
//       movementData.direction = "forward";
//       break;
//     case "back":
//       message = "Moving backward";
//       movementData.direction = "backward";
//       break;
//     case "left":
//       message = "Turning left";
//       movementData.direction = "left";
//       break;
//     case "right":
//       message = "Turning right";
//       movementData.direction = "right";
//       break;
//     case "stop":
//       message = "STOP";
//       movementData.direction = "stop";
//       break;
//     default:
//       return res.status(400).send({ error: "Invalid direction" });
//   }

//   // Send back a response with data
//   res.send({ direction, message });
// });

// // API to access the movement data
// app.get("/api/movement-data", (req, res) => {
//   if (movementData.direction) {
//     res.send({ status: "success", movement: movementData });
//   } else {
//     res.status(400).send({ error: "No movement data available" });
//   }
// });

// server.listen(3000, () => {
//   console.log(`Server listening on port 3000`);
// });

import express from "express";
import cors from "cors"; // Import CORS
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();
const server = createServer(app);
const io = new Server(server);
const allusers = {};

// /your/system/path
const __dirname = dirname(fileURLToPath(import.meta.url));

// Enable CORS for all origins (you can restrict this later)
app.use(
  cors({
    origin: "*", // Replace with your client's domain
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Exposing public directory to outside world
app.use(express.static("public"));

// Handle incoming HTTP request
app.get("/", (req, res) => {
  console.log("GET Request /");
  res.sendFile(join(__dirname + "/app/index.html"));
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log(
    `Someone connected to socket server and socket id is ${socket.id}`
  );

  socket.on("join-user", (username) => {
    console.log(`${username} joined socket connection`);
    allusers[username] = { username, id: socket.id };
    // Inform everyone that someone joined
    io.emit("joined", allusers);
  });

  socket.on("offer", ({ from, to, offer }) => {
    console.log({ from, to, offer });
    if (allusers[to]) {
      io.to(allusers[to].id).emit("offer", { from, to, offer });
    } else {
      console.error(`User ${to} not found in allusers`);
    }
  });

  socket.on("answer", ({ from, to, answer }) => {
    if (allusers[from]) {
      io.to(allusers[from].id).emit("answer", { from, to, answer });
    } else {
      console.error(`User ${from} not found in allusers`);
    }
  });

  socket.on("end-call", ({ from, to }) => {
    if (allusers[to]) {
      io.to(allusers[to].id).emit("end-call", { from, to });
    } else {
      console.error(`User ${to} not found in allusers`);
    }
  });

  socket.on("call-ended", (caller) => {
    const [from, to] = caller;

    // Check if both 'from' and 'to' users exist in 'allusers'
    if (allusers[from] && allusers[to]) {
      io.to(allusers[from].id).emit("call-ended", caller);
      io.to(allusers[to].id).emit("call-ended", caller);
    } else {
      console.error(
        `One or both users not found in allusers: from=${from}, to=${to}`
      );
    }
  });

  socket.on("icecandidate", (candidate) => {
    console.log({ candidate });
    // Broadcast to other peers
    socket.broadcast.emit("icecandidate", candidate);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    // Find and remove the disconnected user from 'allusers'
    const username = Object.keys(allusers).find(
      (key) => allusers[key].id === socket.id
    );
    if (username) {
      delete allusers[username];
      console.log(`${username} has disconnected`);
      // Notify other users about the disconnection
      io.emit("user-disconnected", username);
    }
  });
});

// Store the current movement state
let movementData = { direction: null };

// Movement API routes
app.post("/api/move/:direction", (req, res) => {
  const { direction } = req.params;
  let message = "";
  console.log("POST request received with direction: ", direction);

  console.log(`Move: ${direction}`);

  // Logic to handle the movement based on the direction
  switch (direction) {
    case "front":
      message = "Moving forward";
      movementData.direction = "forward";
      break;
    case "back":
      message = "Moving backward";
      movementData.direction = "backward";
      break;
    case "left":
      message = "Turning left";
      movementData.direction = "left";
      break;
    case "right":
      message = "Turning right";
      movementData.direction = "right";
      break;
    case "stop":
      message = "STOP";
      movementData.direction = "stop";
      break;
    default:
      return res.status(400).send({ error: "Invalid direction" });
  }

  // Send back a response with data
  res.send({ direction, message });
});

// API to access the movement data
app.get("/api/movement-data", (req, res) => {
  if (movementData.direction) {
    res.send({ status: "success", movement: movementData });
  } else {
    res.status(400).send({ error: "No movement data available" });
  }
});

server.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});
