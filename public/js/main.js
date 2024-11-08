const createUserBtn = document.getElementById("create-user");
const username = document.getElementById("username");
const allusersHtml = document.getElementById("allusers");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const endCallBtn = document.getElementById("end-call-btn");
const toggleVideoBtn = document.getElementById("vid-call-btn");
const toggleAudioBtn = document.getElementById("mic-call-btn");
const socket = io();
let localStream;
let caller = [];

// ICE server configuration
const PeerConnection = (function () {
  let peerConnection;

  const createPeerConnection = () => {
    const config = {
      iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "683476fd9a2b31ef5b7643c3",
          credential: "LxaSTPlWMuANe/T1",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "683476fd9a2b31ef5b7643c3",
          credential: "LxaSTPlWMuANe/T1",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "683476fd9a2b31ef5b7643c3",
          credential: "LxaSTPlWMuANe/T1",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "683476fd9a2b31ef5b7643c3",
          credential: "LxaSTPlWMuANe/T1",
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
    peerConnection.onconnectionstatechange = () => {
      if (
        peerConnection.connectionState === "disconnected" ||
        peerConnection.connectionState === "failed" ||
        peerConnection.connectionState === "closed"
      ) {
        // Stop and clear the remote video
        remoteVideo.srcObject = null;
      }
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
let userCreated = false;
// createUserBtn.addEventListener("click", (e) => {
//   if (username.value !== "") {
//     const usernameContainer = document.querySelector(".username-input");
//     socket.emit("join-user", username.value);
//     usernameContainer.style.display = "none";
//   }
// });
createUserBtn.addEventListener("click", () => {
  if (username.value.trim()) {
    const usernameContainer = document.querySelector(".username-input");
    socket.emit("join-user", username.value.trim());
    usernameContainer.style.display = "none";
    userCreated = true; // Set flag to true after user is created
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
localVideo.classList.remove("remote-video");

// End call method
const endCall = () => {
  const pc = PeerConnection.getInstance();
  if (pc) {
    pc.close();
    peerConnection = null;
    endCallBtn.style.display = "none";
    remoteVideo.srcObject = null;
    localVideo.classList.add("remote-video");
    caller = [];
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
    // localVideo.classList.remove("remote-video");
  }
};

// Toggle video and audio functions
let videoEnabled = true;
let audioEnabled = true;
let vidON = "/images/video-camera.png";
let videoOFF = "/images/no-video.png";
toggleVideoBtn.addEventListener("click", () => {
  videoEnabled = !videoEnabled;
  localStream.getVideoTracks().forEach((track) => {
    track.enabled = videoEnabled;
  });
  // toggleVideoBtn.innerHTML = videoEnabled
  //   ? "Turn Off Video"
  //   : "Turn On Video";
  toggleVideoBtn.innerHTML = `<img src="${
    videoEnabled ? vidON : videoOFF
  }" alt="${videoEnabled ? "Turn Off Video" : "Turn On Video"}">`;
});
let micMute = "/images/mute.png";
let micOn = "/images/record.png";
toggleAudioBtn.addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  localStream.getAudioTracks().forEach((track) => {
    track.enabled = audioEnabled;
  });
  toggleAudioBtn.innerHTML = `<img src="${
    audioEnabled ? micOn : micMute
  }" alt="${audioEnabled ? "Mute Audio" : "Unmute Audio"}">`;
});

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
document.getElementById("btn-up").addEventListener("mousedown", () => {
  activeDirection = "UP";
  triggerMovement(activeDirection);
});
document.getElementById("btn-down").addEventListener("mousedown", () => {
  activeDirection = "DOWN";
  triggerMovement(activeDirection);
});

// Stop movement on mouse button release
document.addEventListener("mouseup", () => {
  if (activeDirection == "UP" || activeDirection == "DOWN") {
    triggerMovement("headStop");
    activeDirection = null; // Reset active direction
  } else if (
    activeDirection == "front" ||
    activeDirection == "back" ||
    activeDirection == "left" ||
    activeDirection == "right"
  ) {
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
    case "e":
      if (activeDirection !== "UP") {
        activeDirection = "UP";
        triggerMovement(activeDirection);
      }
      break;
    case "r":
      if (activeDirection !== "DOWN") {
        activeDirection = "DOWN";
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
document.addEventListener("keyup", (event) => {
  if (["e", "r"].includes(event.key.toLowerCase())) {
    triggerMovement("headStop"); // Trigger the stop action on key release
    activeDirection = null; // Reset active direction
  }
});

// Function to handle directions
// function triggerMovement(direction) {
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
const triggerMovement = (direction) => {
  if (!userCreated) return; // Only proceed if user is created
  fetch(`/api/move/${direction}`, { method: "POST" })
    .then((response) => response.json())
    .then((data) => console.log(`Action: ${direction}`, data))
    .catch((error) => console.error("Error:", error));
};

// Start the video streaming
startMyVideo();
