const login_button_el = document.getElementById("login-button");
login_button_el.addEventListener("client", event => {
    tryLoginBsky();
}, false);

const sess_class = { guest: "stat-guest", connected: "stat-connected" };

document.addEventListener("DOMContentLoaded", event => {
    if (readCookieVal("sess_latest_status") !== "OK") {
        setGuest();
    } else {
        const session = {
            service: readCookieVal("service_address"),
            sess: {
                did: readCookieVal("sess_did"),
                serviceEndpoint: readCookieVal("sess_serviceEndpoint"),
                accessJwt: readCookieVal("sess_accessjwt"),
                refreshJwt: readCookieVal("ess_refreshjwt")
            }
        };
        checkSessionBsky(session);
    }
}, false);

function readCookieVal(key) {
    return (document.cookie.split(/; ?/).filter(c => c.split("=")[0] == key)[0] || "").split("=")[1];
}
function writeCookie(key, val) {
    document.cookie = `${key}=${val}`;
    return val;
}
function deleteCookieVal(key) {
    document.cookie = `${key}=; max-age=0`;
    return key;
}

function setGuest() {
    document.body.classList.add("bsky-loaded");
    document.body.classList.add(sess_class.guest);
    document.querySelector("#login-user-input").focus();
    document.querySelector("#login-button").addEventListener("click", tryLoginBsky, false);
    return;
}

function tryLoginBsky() {
    const login_form = {
        service: document.querySelector("#login-service-input"),
        user: document.querySelector("#login-user-input"),
        password: document.querySelector("#login-password-input")
    };
    if (login_form.service && login_form.user && login_form.password) {
        const service_address = login_form.service.value;
        const trying_identifier = login_form.user.value;
        const trying_password = login_form.password.value;
        fetchBskySession(service_address, trying_identifier, trying_password);
    }
    return;
}

function fetchBskySession(service_address, trying_identifier, trying_password) {
    const post_body = JSON.stringify({ identifier: trying_identifier, password: trying_password });
    fetch(`https://${service_address}/xrpc/com.atproto.server.createSession`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: post_body
    })
        .then(res => {
            if (res.status === 401) {
                document.body.classList.add("bsky-loaded");
                document.querySelector("#login-error-message").innerText = "入力が間違っています";
                throw new Error("check handle or password");
            }
            document.querySelector("#login-error-message").innerText = "";
            return res.json();
        })
        .then(sess => {
            writeCookie("service_address", service_address);
            writeCookie("sess_latest_status", "OK");
            writeCookie("sess_did", sess.did);
            console.log(sess.didDoc);
            writeCookie("sess_serviceEndpoint", sess.didDoc.service[0].serviceEndpoint.replace(/^https?:\/\//, ""));
            writeCookie("sess_accessjwt", sess.accessJwt);
            writeCookie("sess_refreshjwt", sess.accessJwt);
            getoutGuest(service_address, sess);
        });
    return;
}

function checkSessionBsky(stored_connection) {
    fetch(`https://${stored_connection.service}/xrpc/com.atproto.server.getSession`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${stored_connection.sess.accessJwt}`
        }
    })
        .then(res => {
            if (!res.ok) {
                fetch(`https://${stored_connection.service}/xrpc/com.atproto.server.refreshSession`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${stored_connection.sess.refreshJwt}`
                    }
                })
                    .catch(err => {
                        console.log(err);
                        setGuest();
                    })
                    .then(res => {
                        return res.json();
                    })
                    .then(sess => {
                        if (sess.error) {
                            writeCookie("sess_latest_status", "logout");
                            return;
                        }
                        writeCookie("service_address", stored_connection.service);
                        writeCookie("sess_latest_status", "OK");
                        writeCookie("sess_did", sess.did);
                        console.log(sess);
                        writeCookie("sess_serviceEndpoint", sess.didDoc.service[0].serviceEndpoint.replace(/^https?:\/\//, ""));
                        writeCookie("sess_accessjwt", sess.accessJwt);
                        writeCookie("sess_refreshjwt", sess.accessJwt);
                        getoutGuest(stored_connection.service, sess);
                    });
                throw new Error("login reject");
            }
            return res.json();
        })
        .then(sess => {
            getoutGuest(stored_connection.service, { ...sess, ...stored_connection.sess });
        })
    return;
}
function getoutGuest(service_address, sess) {
    fetch(`https://${service_address}/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(sess.did)}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sess.accessJwt}`
        }
    })
        .then(res => {
            return res.json();
        })
        .then(profile => {
            if (document.body.classList.contains("stat-guest")) {
                document.body.classList.remove("stat-guest");
            }
            document.querySelector("#logout-submit-btn").addEventListener("click", _ => {
                tryLogoutBsky();
            }, false);
            renderProfile(profile);
            document.body.classList.add("bsky-loaded");
        });
    return;
}
function tryLogoutBsky() {
    writeCookie("sess_latest_status", "logout");
    deleteCookieVal("sess_did");
    deleteCookieVal("sess_accessjwt");
    deleteCookieVal("sess_refreshjwt");
}
function renderProfile(profile) {
    console.log(profile);
    return;
    if (profile.displayName) {
        [...document.querySelectorAll(".displayname--bsky")].map(el => {
            el.innerText = profile.displayName;
        });
        [...document.querySelectorAll(".handle--bsky")].map(el => {
            el.innerText = profile.handle;
        });
        document.body.style.setProperty("--avatar-image", `url("${profile.avatar}")`);
    }
}


const url_regexp = new RegExp(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
const nico_regexp = new RegExp(/^https?:\/\/(nico\.ms|([a-zA-Z]+\.)?nicovideo\.jp)/);
const canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.opacity = "0";
canvas.style.pointerEvents = "none";
canvas.width = "1000";
canvas.height = "563";
document.body.appendChild(canvas);
function postBsky(post_text, post_opt=({})) {
    const post_embed_reserve = [];
    const post_facets = [...post_text.matchAll(url_regexp)].map(links => {
        const byte_start = (new TextEncoder()).encode(post_text.substring(0, links.index)).byteLength;
        const link_uri = `https://${links[0]}`.replace(/^(https:\/\/)(https?:\/\/)/, "$2");
        if (link_uri.match(nico_regexp)) {
            post_embed_reserve.push(link_uri);
        }
        return ({
            "index": {
                "byteStart": byte_start,
                "byteEnd": byte_start + links[0].length
            },
            "features": [
                {
                    "$type": "app.bsky.richtext.facet#link",
                    "uri": link_uri
                }
            ]
        });
    });
    const sess = {
        did: readCookieVal("sess_did"),
        serviceEndpoint: readCookieVal("sess_serviceEndpoint"),
        accessJwt: readCookieVal("sess_accessjwt"),
        refreshJwt: readCookieVal("sess_refreshjwt")
    };
    const post_body = {
        collection: "app.bsky.feed.post",
        record: {
            $type: "app.bsky.feed.post",
            createdAt: (new Date()).toISOString(),
            text: post_text,
            facets: post_facets,
            via: "njmono3 app",
            ...post_opt
        },
        repo: sess.did
    };
    if (post_embed_reserve.length && 0) {
        fetch(post_embed_reserve[0])
            .then(res => res.text())
            .then(text => {
                const el = new DOMParser().parseFromString(text, "text/html");
                const ogp = {};
                [...el.head.children].map(child => {
                    const property = child.getAttribute("property");
                    if (!property.match(/^og:/)) return;
                    ogp[property.replace(/^og:/, "")] = child.getAttribute("content");
                });
                ogp["image"] = ogp["image"].match(/:\/\//) ? ogp["image"] : ogp["url"] + ogp["image"];
                return ogp;
            })
            .then(ogp => {
                post_body.embed = {
                    "$type": "app.bsky.embed.external",
                    "external": {
                        "uri": ogp.url,
                        "title": ogp.title,
                        "description": ogp.description
                    }
                };
                fetch(ogp.image)
                    .then(res => res.arrayBuffer())
                    .then(buf => {
                        const unit8arr = new Uint8Array(buf);
                        fetch(`https://${sess.serviceEndpoint}/xrpc/com.atproto.repo.uploadBlob`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "image/jpeg",
                                "Authorgization": `Bearer ${sess.accessJwt}`
                            },
                            data: unit8arr
                        })
                            .then()
                    });
                post_body.embed.external.thumb = {
                    "$type": "blob",
                    "ref": {
                        "$link": ""
                    },
                    "memeType": "",
                    "size": 0
                };
            });
    } else {
        fetch(`https://${sess.serviceEndpoint}/xrpc/com.atproto.repo.createRecord`, {
            method: "POST",
            referrerPolicy: "strict-origin-when-cross-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sess.accessJwt}`
            },
            body: JSON.stringify(post_body)
        })
            .then(_ => {
                document.querySelector("#post-record-result").innerText = "";
            });
    }
    return;
}

const post_record_input = document.querySelector("#post-record-input");
post_record_input.value = '{\n  "$type": "app.bsky.feed.post",\n  "text": "text here",\n  "facets": [],\n  "createdAt": "%%datetime%%",\n  "via": "njmono3 app"\n}';
document.querySelector("#record-submit-btn").addEventListener("click", _ => {
    document.querySelector("#post-record-result").innerText = "sending...";
    const input_text = post_record_input.value;
    if (true) {
        const [post_text, post_opt_text, post_embed_link] = input_text.split("%%split%%");
        const post_opt = post_opt_text ? JSON.parse(post_opt_text + "") : undefined;
        postBsky(post_text, post_opt, post_embed_link || 0);
    } else {
        const [unparsed_json, record_option] = input_text.replaceAll("%%datetime%%", (new Date()).toISOString()).split("%%option%%");
        postRecord(JSON.parse(unparsed_json), record_option);
    }
}, false);

const decodeQuery = q => q.split("&").reduce((acc, d) => (dset => ({ ...acc, [dset[0]]: dset.slice(1).join("=") }))(d.split("=")), {});
function postRecord(post_record, record_option) {
    const ropt = record_option == "" || record_option == undefined ? {mode: "create"} : decodeQuery(record_option);
    if (!~["create", "put", "delete"].indexOf(ropt.mode)) {
        document.querySelector("#post-record-result").innerText = "x";
        return;
    }
    const sess = {
        did: readCookieVal("sess_did"),
        serviceEndpoint: readCookieVal("serviceEndpoint"),
        accessJwt: readCookieVal("sess_accessjwt"),
        refreshJwt: readCookieVal("bsky_sess_refreshjwt")
    };
    const post_body = {
        collection: post_record["$type"],
        record: post_record,
        repo: sess.did,
        ...(ropt.rkey ? { rkey: ropt.rkey } : {}),
        ...(ropt.validate ? { validate: ropt.validate == "true" } : {}),
        ...(ropt.swapRecord ? { validate: ropt.swapRecord } : {}),
        ...(ropt.json ? JSON.parse(decodeURIComponent(ropt.json)) : {})
    };
    fetch(`https://${sess.serviceEndpoint}/xrpc/com.atproto.repo.${ropt.mode}Record`, {
        method: "POST",
        referrerPolicy: "strict-origin-when-cross-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sess.accessJwt}`
        },
        body: JSON.stringify(post_body)
    })
        .then(res => {
            if (!res.ok) throw new Error("rejected [create record]");
            document.querySelector("#post-record-result").innerText = "";
            return res.json();
        })
        .then(resjson => {
            console.log(resjson);
            if (post_record["$type"].match(/^com\.vwousu\.report\./)) {
                console.log("start process [vwousu report]");
                fetch(`https://api.vwousu.com/xrpc/com.vwousu.report.postReport`, {
                    method: "POST",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ target: post_body, post: resjson })
                })
                    .then(res => {
                        if (!res.ok) throw new Error("rejected [vwousu api]");
                        res.json().then(resjson => {
                            console.log(resjson);
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        })
        .catch(err => {
            document.querySelector("#post-record-result").innerText = "x";
            console.log(err);
        });
    return;
}
