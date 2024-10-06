// const createUserBtn = document.getElementById("create-user");
// const username = document.getElementById("username");
// const allusersHtml = document.getElementById("allusers");
// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");
// const endCallBtn = document.getElementById("end-call-btn");
// const socket = io();
// let localStream;
// let caller = [];

// // Single Method for peer connection
// const PeerConnection = (function () {
//   let peerConnection;

//   const createPeerConnection = () => {
//     const config = {
//       iceServers: [
//         {
//           urls: "stun:stun.l.google.com:19302",
//         },
//       ],
//     };
//     peerConnection = new RTCPeerConnection(config);

//     // add local stream to peer connection
//     localStream.getTracks().forEach((track) => {
//       console.log("Adding track: ", track);
//       peerConnection.addTrack(track, localStream);
//     });
//     // listen to remote stream and add to peer connection
//     peerConnection.ontrack = function (event) {
//       remoteVideo.srcObject = event.streams[0];
//       const remoteAudio = new Audio();
//       remoteAudio.srcObject = event.streams[0];
//       remoteAudio.play();
//     };
//     // listen for ice candidate
//     peerConnection.onicecandidate = function (event) {
//       if (event.candidate) {
//         socket.emit("icecandidate", event.candidate);
//       }
//     };

//     return peerConnection;
//   };

//   return {
//     getInstance: () => {
//       if (!peerConnection) {
//         peerConnection = createPeerConnection();
//       }
//       return peerConnection;
//     },
//   };
// })();

// // handle browser events
// createUserBtn.addEventListener("click", (e) => {
//   if (username.value !== "") {
//     const usernameContainer = document.querySelector(".username-input");
//     socket.emit("join-user", username.value);
//     usernameContainer.style.display = "none";
//   }
// });
// endCallBtn.addEventListener("click", (e) => {
//   socket.emit("call-ended", caller);
// });

// // handle socket events
// socket.on("joined", (allusers) => {
//   console.log({ allusers });
//   const createUsersHtml = () => {
//     allusersHtml.innerHTML = "";

//     for (const user in allusers) {
//       const li = document.createElement("li");
//       li.textContent = `${user} ${user === username.value ? "(You)" : ""}`;

//       if (user !== username.value) {
//         const button = document.createElement("button");
//         button.classList.add("call-btn");
//         button.addEventListener("click", (e) => {
//           startCall(user);
//         });
//         const img = document.createElement("img");
//         img.setAttribute("src", "/images/phone.png");
//         img.setAttribute("width", 20);

//         button.appendChild(img);

//         li.appendChild(button);
//       }

//       allusersHtml.appendChild(li);
//     }
//   };

//   createUsersHtml();
// });
// socket.on("offer", async ({ from, to, offer }) => {
//   const pc = PeerConnection.getInstance();
//   //   // set remote description
//   await pc.setRemoteDescription(offer);
//   const answer = await pc.createAnswer();
//   await pc.setLocalDescription(answer);
//   socket.emit("answer", { from, to, answer: pc.localDescription });
//   caller = [from, to];
// });
// socket.on("answer", async ({ from, to, answer }) => {
//   const pc = PeerConnection.getInstance();
//   await pc.setRemoteDescription(answer);
//   // show end call button
//   endCallBtn.style.display = "block";
//   socket.emit("end-call", { from, to });
//   caller = [from, to];
// });
// socket.on("icecandidate", async (candidate) => {
//   console.log({ candidate });
//   const pc = PeerConnection.getInstance();
//   await pc.addIceCandidate(new RTCIceCandidate(candidate));
// });
// socket.on("end-call", ({ from, to }) => {
//   endCallBtn.style.display = "block";
// });
// socket.on("call-ended", (caller) => {
//   endCall();
// });

// // start call method
// const startCall = async (user) => {
//   console.log({ user });
//   const pc = PeerConnection.getInstance();
//   const offer = await pc.createOffer();
//   console.log({ offer });
//   await pc.setLocalDescription(offer);
//   socket.emit("offer", {
//     from: username.value,
//     to: user,
//     offer: pc.localDescription,
//   });
// };

// const endCall = () => {
//   const pc = PeerConnection.getInstance();
//   if (pc) {
//     pc.close();
//     endCallBtn.style.display = "none";
//   }
// };

// // initialize app
// const startMyVideo = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     console.log({ stream });
//     localStream = stream;
//     localVideo.srcObject = stream;
//     console.log("Audio Tracks: ", localStream.getAudioTracks()); // Debug: check audio tracks
//     console.log("Video Tracks: ", localStream.getVideoTracks()); // Debug: check video tracks
//   } catch (error) {
//     console.error("Error accessing media devices:", error);
//   }
// };

// startMyVideo();

// const createUserBtn = document.getElementById("create-user");
// const username = document.getElementById("username");
// const allusersHtml = document.getElementById("allusers");
// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");
// const endCallBtn = document.getElementById("end-call-btn");
// const socket = io();
// let localStream;
// let caller = [];

// // Single Method for peer connection
// const PeerConnection = (function () {
//   let peerConnection;

//   const createPeerConnection = () => {
//     const config = {
//       iceServers: [
//         {
//           urls: "stun:stun.l.google.com:19302", // STUN server
//         },
//         {
//           urls: "turn:277cdc3df423272ccb9603bf", // TURN server (provided by you)
//           username: "277cdc3df423272ccb9603bf", // Username for TURN server
//           credential: "5lUr+a08TbwkUoAz", // Password for TURN server
//         },
//       ],
//     };
//     peerConnection = new RTCPeerConnection(config);

//     // add local stream to peer connection
//     localStream.getTracks().forEach((track) => {
//       console.log("Adding track: ", track);
//       peerConnection.addTrack(track, localStream);
//     });

//     // listen to remote stream and add to peer connection
//     peerConnection.ontrack = function (event) {
//       remoteVideo.srcObject = event.streams[0];
//       const remoteAudio = new Audio();
//       remoteAudio.srcObject = event.streams[0];
//       remoteAudio.play();
//     };

//     // listen for ice candidate
//     peerConnection.onicecandidate = function (event) {
//       if (event.candidate) {
//         console.log("ICE candidate:", event.candidate); // Log ICE candidates
//         socket.emit("icecandidate", event.candidate);
//       } else {
//         console.log("All ICE candidates have been sent.");
//       }
//     };

//     return peerConnection;
//   };

//   return {
//     getInstance: () => {
//       if (!peerConnection || peerConnection.signalingState === "closed") {
//         peerConnection = createPeerConnection();
//       }
//       return peerConnection;
//     },
//   };
// })();

// // handle browser events
// createUserBtn.addEventListener("click", (e) => {
//   if (username.value !== "") {
//     const usernameContainer = document.querySelector(".username-input");
//     socket.emit("join-user", username.value);
//     usernameContainer.style.display = "none";
//   }
// });

// endCallBtn.addEventListener("click", (e) => {
//   socket.emit("call-ended", caller);
// });

// // handle socket events
// socket.on("joined", (allusers) => {
//   console.log({ allusers });
//   const createUsersHtml = () => {
//     allusersHtml.innerHTML = "";

//     for (const user in allusers) {
//       const li = document.createElement("li");
//       li.textContent = `${user} ${user === username.value ? "(You)" : ""}`;

//       if (user !== username.value) {
//         const button = document.createElement("button");
//         button.classList.add("call-btn");
//         button.addEventListener("click", (e) => {
//           startCall(user);
//         });
//         const img = document.createElement("img");
//         img.setAttribute("src", "/images/phone.png");
//         img.setAttribute("width", 20);

//         button.appendChild(img);

//         li.appendChild(button);
//       }

//       allusersHtml.appendChild(li);
//     }
//   };

//   createUsersHtml();
// });

// socket.on("offer", async ({ from, to, offer }) => {
//   const pc = PeerConnection.getInstance();
//   // set remote description
//   await pc.setRemoteDescription(offer);
//   const answer = await pc.createAnswer();
//   await pc.setLocalDescription(answer);
//   socket.emit("answer", { from, to, answer: pc.localDescription });
//   caller = [from, to];
// });

// socket.on("answer", async ({ from, to, answer }) => {
//   const pc = PeerConnection.getInstance();
//   await pc.setRemoteDescription(answer);
//   // show end call button
//   endCallBtn.style.display = "block";
//   socket.emit("end-call", { from, to });
//   caller = [from, to];
// });

// socket.on("icecandidate", async (candidate) => {
//   console.log("Received ICE candidate:", candidate); // Log received candidates
//   const pc = PeerConnection.getInstance();
//   await pc.addIceCandidate(new RTCIceCandidate(candidate));
// });

// socket.on("end-call", ({ from, to }) => {
//   endCallBtn.style.display = "block";
// });

// socket.on("call-ended", (caller) => {
//   endCall();
// });

// // start call method
// const startCall = async (user) => {
//   console.log({ user });
//   let pc = PeerConnection.getInstance();

//   if (pc.signalingState === "closed") {
//     peerConnection = null; // Reset to allow new connection
//     pc = PeerConnection.getInstance(); // Recreate connection
//   }

//   const offer = await pc.createOffer();
//   console.log({ offer });
//   await pc.setLocalDescription(offer);
//   socket.emit("offer", {
//     from: username.value,
//     to: user,
//     offer: pc.localDescription,
//   });
// };

// // end call method
// const endCall = () => {
//   const pc = PeerConnection.getInstance();
//   if (pc) {
//     pc.close();
//     peerConnection = null; // Reset peer connection after ending the call
//     endCallBtn.style.display = "none";
//   }
// };

// // initialize app
// const startMyVideo = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     console.log({ stream });
//     localStream = stream;
//     localVideo.srcObject = stream;
//     console.log("Audio Tracks: ", localStream.getAudioTracks()); // Debug: check audio tracks
//     console.log("Video Tracks: ", localStream.getVideoTracks()); // Debug: check video tracks
//   } catch (error) {
//     console.error("Error accessing media devices:", error);
//   }
// };
// document.getElementById("btn-front").addEventListener("click", () => {
//   handleDirection("front");
// });

// document.getElementById("btn-back").addEventListener("click", () => {
//   handleDirection("back");
// });

// document.getElementById("btn-left").addEventListener("click", () => {
//   handleDirection("left");
// });

// document.getElementById("btn-right").addEventListener("click", () => {
//   handleDirection("right");
// });
// document.getElementById("btn-stop").addEventListener("click", () => {
//   handleDirection("stop");
// });

// function handleDirection(direction) {
//   fetch(`/api/move/${direction}`, {
//     method: "POST",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(`Action: ${direction}`, data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }
// document.getElementById("btn-front").addEventListener("click", () => {
//   handleDirection("front");
// });

// document.getElementById("btn-back").addEventListener("click", () => {
//   handleDirection("back");
// });

// document.getElementById("btn-left").addEventListener("click", () => {
//   handleDirection("left");
// });

// document.getElementById("btn-right").addEventListener("click", () => {
//   handleDirection("right");
// });
// document.getElementById("btn-stop").addEventListener("click", () => {
//   handleDirection("stop");
// });

// function handleDirection(direction) {
//   fetch(`/api/move/${direction}`, {
//     method: "POST",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(`Action: ${direction}`, data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// startMyVideo();

const createUserBtn = document.getElementById("create-user");
const username = document.getElementById("username");
const allusersHtml = document.getElementById("allusers");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const endCallBtn = document.getElementById("end-call-btn");
const socket = io();
let localStream;
let caller = [];

// Single Method for peer connection
const PeerConnection = (function () {
  let peerConnection;

  const createPeerConnection = () => {
    const config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          url: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    };
    peerConnection = new RTCPeerConnection(config);

    // Add local stream to peer connection
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Listen to remote stream and add to peer connection
    peerConnection.ontrack = function (event) {
      remoteVideo.srcObject = event.streams[0];
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play();
    };

    // Listen for ice candidate
    peerConnection.onicecandidate = function (event) {
      if (event.candidate) {
        socket.emit("icecandidate", event.candidate);
      }
    };

    return peerConnection;
  };

  return {
    getInstance: () => {
      if (!peerConnection || peerConnection.signalingState === "closed") {
        peerConnection = createPeerConnection();
      }
      return peerConnection;
    },
  };
})();

// Handle browser events
createUserBtn.addEventListener("click", (e) => {
  if (username.value !== "") {
    const usernameContainer = document.querySelector(".username-input");
    socket.emit("join-user", username.value);
    usernameContainer.style.display = "none";
  }
});

endCallBtn.addEventListener("click", (e) => {
  socket.emit("call-ended", caller);
});

// Handle socket events
socket.on("joined", (allusers) => {
  const createUsersHtml = () => {
    allusersHtml.innerHTML = "";

    for (const user in allusers) {
      const li = document.createElement("li");
      li.textContent = `${user} ${user === username.value ? "(You)" : ""}`;

      if (user !== username.value) {
        const button = document.createElement("button");
        button.classList.add("call-btn");
        button.addEventListener("click", (e) => {
          startCall(user);
        });
        const img = document.createElement("img");
        img.setAttribute("src", "/images/phone.png");
        img.setAttribute("width", 20);

        button.appendChild(img);
        li.appendChild(button);
      }

      allusersHtml.appendChild(li);
    }
  };

  createUsersHtml();
});

socket.on("offer", async ({ from, to, offer }) => {
  const pc = PeerConnection.getInstance();
  await pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit("answer", { from, to, answer: pc.localDescription });
  caller = [from, to];
});

socket.on("answer", async ({ from, to, answer }) => {
  const pc = PeerConnection.getInstance();
  await pc.setRemoteDescription(answer);
  endCallBtn.style.display = "block";
  socket.emit("end-call", { from, to });
  caller = [from, to];
});

socket.on("icecandidate", async (candidate) => {
  const pc = PeerConnection.getInstance();
  await pc.addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("end-call", ({ from, to }) => {
  endCallBtn.style.display = "block";
});

socket.on("call-ended", (caller) => {
  endCall();
});

// Start call method
const startCall = async (user) => {
  let pc = PeerConnection.getInstance();
  if (pc.signalingState === "closed") {
    peerConnection = null;
    pc = PeerConnection.getInstance();
  }

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit("offer", {
    from: username.value,
    to: user,
    offer: pc.localDescription,
  });
};

// End call method
const endCall = () => {
  const pc = PeerConnection.getInstance();
  if (pc) {
    pc.close();
    peerConnection = null;
    endCallBtn.style.display = "none";
  }
};

// Initialize video streaming
const startMyVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    localStream = stream;
    localVideo.srcObject = stream;
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};

// Movement buttons and keyboard event handlers
let activeDirection = null;

// Mouse control: Start moving on button press
document.getElementById("btn-front").addEventListener("mousedown", () => {
  activeDirection = "front";
  triggerMovement(activeDirection); // Trigger the movement immediately on hold
});

document.getElementById("btn-back").addEventListener("mousedown", () => {
  activeDirection = "back";
  triggerMovement(activeDirection);
});

document.getElementById("btn-left").addEventListener("mousedown", () => {
  activeDirection = "left";
  triggerMovement(activeDirection);
});

document.getElementById("btn-right").addEventListener("mousedown", () => {
  activeDirection = "right";
  triggerMovement(activeDirection);
});

// Stop movement on mouse button release
document.addEventListener("mouseup", () => {
  if (activeDirection) {
    triggerMovement("stop"); // Trigger the stop action when the button is released
    activeDirection = null; // Reset active direction
  }
});

// Keyboard event handlers (start moving on key press, stop on key release)
document.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "w":
      if (activeDirection !== "front") {
        activeDirection = "front";
        triggerMovement(activeDirection);
      }
      break;
    case "a":
      if (activeDirection !== "left") {
        activeDirection = "left";
        triggerMovement(activeDirection);
      }
      break;
    case "d":
      if (activeDirection !== "right") {
        activeDirection = "right";
        triggerMovement(activeDirection);
      }
      break;
  }
});

document.addEventListener("keyup", (event) => {
  if (["w", "a", "d"].includes(event.key.toLowerCase())) {
    triggerMovement("stop"); // Trigger the stop action on key release
    activeDirection = null; // Reset active direction
  }
});

// Function to handle directions
function triggerMovement(direction) {
  fetch(`/api/move/${direction}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(`Action: ${direction}`, data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Start the video streaming
startMyVideo();
