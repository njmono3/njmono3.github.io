layout("note");
const gen_notes = function () {
    const body_container = document.getElementById("body-container");
    const header = document.getElementById("header");
    const right_container = document.getElementById("right-container");
    const main_container = document.getElementById("main-container");
    const footer = document.getElementById("footer");
    main_container.appendChild(new El("div", "", {}, { class: "main-contents note-contents", align: "left" }, [document.querySelector("#content-element")]).gen());
}
gen_notes();
[...document.querySelectorAll("img")].map(
    img => 
    (
        ((img.previousElementSibling || {tagName: ""}).tagName !== "IMG" && img.insertAdjacentHTML("beforebegin", "<br>")),
        img.height = (img.alt.split("~").slice(-1)[0].match(/\d+/g) || [])[0]
    )
)
