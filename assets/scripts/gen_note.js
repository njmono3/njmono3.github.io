const parser = function (string) {//簡易マークダウンもどき
    return string
        .replace(/####(.+)/g, `</p><h4 class="note">$1</h4><p>`)
        .replace(/###(.+)/g, `</p><h3 class="note">$1</h3><p>`)
        .replace(/##(.+)/g, `</p><h2 class="note">$1</h2><p>`)
        .replace(/#(.+)/g, `</p><h1 class="note">$1</h1><p>`)
        .replace(/([^]+)/g, "<p>$1</p>")
        .replace(/!\[(.+), ?(\d+)\]\((.+) "(.+)"\)/g, `</p><div class="image-div" style="height: $2px;"><img alt="$1" src="$3" title="$4"/></div><p>`)
        .replace(/\[(.+)\]\((.+) "(.+)" "(.+)"\)/g, `<a href="$2" title="$3" target="$4">$1</a>`)
        .replace(/\n\*\*\*\n?/g, `</p><hr class="strong-line"/><p>`)
        .replace(/\n---\n?/g, `</p><hr class="weak-line"/><p>`)
        .replace(/\*([^*]+)\*/g, "<b>$1</b>")
        .replace(/<p>[\s\n]*/g, "<p>")
        .replace(/<p><\/p>/g, "")
        .replace(/(?<!<p>)\n/g, "<br/>");
}
layout();
const setPageTitle = title => document.title = title + " - にものさんの部屋";
const split_char = String.fromCharCode(0xe01A);
const gen_notes = function (note = "0", p = "0") {
    const body_container = document.getElementById("body-container");
    const header = document.getElementById("header");
    const right_container = document.getElementById("right-container");
    const main_container = document.getElementById("main-container");
    const footer = document.getElementById("footer");
    let main_contents;
    main_container.appendChild(main_contents = new El("div", "", {}, { class: "main-contents note-contents", align: "left" }).gen());

    if (1) {
        const gen_page = (name) => xhr.get(`./note/${name}.txt`, (stat, restext) => {
            if (stat === "ok") {
                setPageTitle(name);
                El.appendChildren(main_contents, parser(restext));
            }
        }, "responseText");

        xhr.get(`./assets/datas/readable_note.txt`, (stat, restext) => {
            if (stat === "ok") {
                let note_data = restext.split("\n").map(line => (d => d[0] === note && d)(line.split(split_char))).filter(_ => _)[0];
                gen_page(note_data[1]);
            }
        }, "responseText");
    }
}
gen_notes((o => Object.keys(o).filter(k => !o[k]).shift())(getQueryObject()) || "0", getQueryObject().p || "0");