// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const setStatus = (status) => {
  const statusNode = document.getElementById("browserOnOffLineStatus");
  statusNode.innerText = status ? "Online" : "Offline";
};

setStatus(navigator.onLine);

window.addEventListener("online", () => {
  setStatus(true);
});

window.addEventListener("offline", () => {
  setStatus(false);
});
