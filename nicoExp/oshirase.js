window.addEventListener("message", e => {
  if (new URI(e.origin).host.split(".").slice(1).join(".") !== "nicovideo.jp") return;
  if (e.data.type === "set-dark") {
    if (e.data.mode === "add") document.body.classList.add("niconico-darkmode-setting-true");
  }
});
