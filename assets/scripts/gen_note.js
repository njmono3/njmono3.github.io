layout("note");
const gen_notes = function () {
    const body_container = document.getElementById("body-container");
    const header = document.getElementById("header");
    const right_container = document.getElementById("right-container");
    const main_container = document.getElementById("main-container");
    const footer = document.getElementById("footer");
    const content = document.querySelector("#content-element");
    const headimg = document.createElement("div");
    headimg.style.width = "100%";
    headimg.style.height = "300px";
    headimg.style.marginBottom = "5px";
    headimg.style.background = `url("../assets/images/${document.querySelector("[note-head-img]").getAttribute("note-head-img") || "note_default.png"}") center center / cover no-repeat`;
    main_container.appendChild(new El("div", "", {}, { class: "main-contents note-contents", align: "left" }, [
        headimg,
        content
    ]).gen());
}
gen_notes();
[...document.querySelectorAll("img")].map(img => img.height = (img.alt.split("~").slice(-1)[0].match(/\d+/g) || [])[0])
