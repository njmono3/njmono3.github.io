const login_button_el = document.getElementById("login-button");
const post_button_el = document.getElementById("post-button");

const client_id = encodeURIComponent("https://njmono3.github.io/oauth-client-metadata.json");

const auth_metadata_endpoint = "https://bsky.social/.well-known/oauth-authorization-server";

login_button_el.addEventListener("click", event => {
    fetch(auth_metadata_endpoint, {
        method: "GET"
    })
        .then(res => res.json())
        .then(auth_metadata_json => {
            const auth_req_endpoint = auth_metadata_json.pushed_authorization_request_endpoint;
            fetch(auth_req_endpoint + "?" + "did=did:plc:tpkejgkmpl7xz322emd5lwy2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
                .then(res => res.json())
                .then(auth_req_json => {
                    console.log(auth_req_json);
                    const request_uri = auth_req_json.request_uri;
                    if (request_uri) {
                        location.href = `https://bsky.social/oauth/authorize?client_id=${client_id}&request_uri=${request_uri}`;
                    }
                });
        });
}, false);