const login_button_el = document.getElementById("login-button");
const post_button_el = document.getElementById("post-button");

const client_id = encodeURIComponent("https://njmono3.github.io/oauth-client-metadata.json");
//const request_uri = encodeURIComponent("urn:ietf:params:oauth:request_uri:req-b8d94454fd5599466b60af49f4a83dfb");

login_button_el.addEventListener("click", event => {
    //location.href = `https://bsky.social/oauth/authorize?client_id=${client_id}&request_uri=${request_uri}`;
    location.href = `https://bsky.social/oauth/authorize?client_id=${client_id}`;
}, false);