let parser = function (string) {//簡易マークダウンもどき
    return string
        .replace(/####(.+)/g, "</p><h4>$1</h4><p>")
        .replace(/###(.+)/g, "</p><h3>$1</h3><p>")
        .replace(/##(.+)/g, "</p><h2>$1</h2><p>")
        .replace(/#(.+)/g, "</p><h1>$1</h1><p>")
        .replace(/([^]+)/g, "<p>$1</p>")
        .replace(/!\[(.+)\]\((.+) "(.+)"\)/g, `</p><img alt="$1" src="$2" title="$3"/><p>`)
        .replace(/\[(.+)\]\((.+) "(.+)" "(.+)"\)/g, `<a href="$2" title="$3" target="$4">$1</a>`)
        .replace(/\*([^*]+)\*/g, "<b>$1</b>")
        .replace(/<p>[\s\n]*/g, "<p>")
        .replace(/<p><\/p>/g, "")
        .replace(/(?<!<p>)\n/g, "<br/>");
}
layout();
const gen_notes = function (n = "nil", p = "0") {
    const body_container = document.getElementById("body-container");
    const header = document.getElementById("header");
    const right_container = document.getElementById("right-container");
    const main_container = document.getElementById("main-container");
    const footer = document.getElementById("footer");
    let main_contents;
    main_container.appendChild(main_contents = new El("div", "", {}, { class: "main-contents", align: "left" }).gen());

    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState == 4) {
            if (req.status) {
                if (200 <= req.status && req.status < 300 || req.status == 304) {
                    let restext = req.responseText;
                    El.appendChildren(main_contents, parser(restext));
                }
            }
        }
    }
    req.open("GET", `./note/${n}.txt`);
    req.send()
}
gen_notes(new URLSearchParams(window.location.search).get("n") || "nil", new URLSearchParams(window.location.search).get("page") || "0");