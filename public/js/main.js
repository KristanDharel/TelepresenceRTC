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
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        // {
        //   urls: "turn:numb.viagenie.ca", // Public TURN server
        //   credential: "webrtc", // Public credential
        //   username: "sylvain.poitras@gmail.com",
        // },
      ],
    };
    peerConnection = new RTCPeerConnection(config);

    peerConnection.oniceconnectionstatechange = (e) => {
      console.log(
        "ICE connection state change:",
        peerConnection.iceConnectionState
      );
    };

    peerConnection.onsignalingstatechange = (e) => {
      console.log("Signaling state change:", peerConnection.signalingState);
    };

    peerConnection.ontrack = function (event) {
      console.log("Received remote track:", event.track.kind);
      if (event.track.kind === "video") {
        remoteVideo.srcObject = event.streams[0];
      } else if (event.track.kind === "audio") {
        const remoteAudio = new Audio();
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play();
      }
    };

    peerConnection.onicecandidate = function (event) {
      if (event.candidate) {
        console.log("ICE candidate:", event.candidate);
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

socket.on("joined", (allusers) => {
  console.log({ allusers });
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
  try {
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", { from, to, answer: pc.localDescription });
    caller = [from, to];
  } catch (error) {
    console.error("Error handling offer:", error);
  }
});

socket.on("answer", async ({ from, to, answer }) => {
  const pc = PeerConnection.getInstance();
  try {
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    endCallBtn.style.display = "block";
    socket.emit("end-call", { from, to });
    caller = [from, to];
  } catch (error) {
    console.error("Error handling answer:", error);
  }
});

socket.on("icecandidate", async (candidate) => {
  console.log("Received ICE candidate:", candidate);
  const pc = PeerConnection.getInstance();
  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (error) {
    console.error("Error adding ICE candidate:", error);
  }
});

socket.on("end-call", ({ from, to }) => {
  endCallBtn.style.display = "block";
});

socket.on("call-ended", (caller) => {
  endCall();
});

const startCall = async (user) => {
  console.log("Starting call with:", user);
  let pc = PeerConnection.getInstance();

  if (pc.signalingState === "closed") {
    pc = PeerConnection.getInstance(); // Recreate connection
  }

  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", {
      from: username.value,
      to: user,
      offer: pc.localDescription,
    });
  } catch (error) {
    console.error("Error starting call:", error);
  }
};

const endCall = () => {
  const pc = PeerConnection.getInstance();
  if (pc) {
    pc.close();
    endCallBtn.style.display = "none";
  }
};

const startMyVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });
    console.log("Local stream obtained:", stream);
    localStream = stream;
    localVideo.srcObject = stream;

    const pc = PeerConnection.getInstance();
    stream.getTracks().forEach((track) => {
      console.log("Adding track to peer connection:", track);
      pc.addTrack(track, stream);
    });

    console.log("Audio Tracks:", localStream.getAudioTracks());
    console.log("Video Tracks:", localStream.getVideoTracks());
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};
document.getElementById("btn-front").addEventListener("click", () => {
  handleDirection("front");
});

document.getElementById("btn-back").addEventListener("click", () => {
  handleDirection("back");
});

document.getElementById("btn-left").addEventListener("click", () => {
  handleDirection("left");
});

document.getElementById("btn-right").addEventListener("click", () => {
  handleDirection("right");
});

function handleDirection(direction) {
  fetch(`/api/move/${direction}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(`Action: ${direction}`, data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
document.getElementById("btn-front").addEventListener("click", () => {
  handleDirection("front");
});

document.getElementById("btn-back").addEventListener("click", () => {
  handleDirection("back");
});

document.getElementById("btn-left").addEventListener("click", () => {
  handleDirection("left");
});

document.getElementById("btn-right").addEventListener("click", () => {
  handleDirection("right");
});

function handleDirection(direction) {
  fetch(`/api/move/${direction}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(`Action: ${direction}`, data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

startMyVideo();
