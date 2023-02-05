const time_text = d => `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;

const apnd_ipt = document.querySelector(".AppendText");
const apnd_btn = document.querySelector(".AppendButton");
const ts_list_el = document.querySelector(".TimeStamp-list");

const cookies = document.cookie.split(";").reduce((acc, item) => ({ ...acc, [item.split("=")[0].trim()]: item.split("=").slice(1) }), {});

const timestamp = JSON.parse(decodeURIComponent(cookies["ts"] || "[]"));
timestamp.map(item => {
    const new_item_el = document.createElement("li");
    new_item_el.classList.add("TimeStamp-item");
    new_item_el.innerText = `${item.time} - ${decodeURIComponent(item.label)}`
    ts_list_el.appendChild(new_item_el);
});

apnd_btn.addEventListener("click", _ => {
    const new_item = ({ time: time_text(new Date()), label: encodeURIComponent(apnd_ipt.value) });
    timestamp.push(new_item);

    const new_item_el = document.createElement("li");
    new_item_el.classList.add("TimeStamp-item");
    new_item_el.innerText = `${new_item.time} - ${decodeURIComponent(new_item.label)}`
    ts_list_el.appendChild(new_item_el);

    document.cookie = "ts=" + encodeURIComponent(JSON.stringify(timestamp));
    return;
}, false);

const exprt_btn = document.querySelector(".ExportButton");
exprt_btn.addEventListener("click", _ => {
    const dl_el = document.createElement("a");
    dl_el.download = "ts.json";
    dl_el.href = `data:text/json;base64,${btoa(JSON.stringify(timestamp))}`;
    dl_el.click();
}, false);
