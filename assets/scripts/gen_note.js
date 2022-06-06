layout();
[...document.querySelectorAll("img")].map(
    img => 
    (
        ((img.previousElementSibling || {tagName: ""}).tagName !== "IMG" && img.insertAdjacentHTML("beforebegin", "<br>")),
        img.height = (img.alt.split("~").slice(-1)[0].match(/\d+/g) || [])[0]
    )
)
