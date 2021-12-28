/*定義部*/
let view_size = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
};
let view_mode = (view_size.width < view_size.height);//縦画面1, 横画面0でスタイルを変更
let contents_mode = new URLSearchParams(window.location.search).get("c");
let page_body = document.body;
let page_title = document.getElementsByTagName("title")[0];
let page_header = document.createElement("div");
let page_footer = document.createElement("div");
let main_body_container = document.createElement("div");
let main_right_container = document.createElement("div");
let main_main_container = document.createElement("div");
let main_left_container = document.createElement("div");
let main_title = document.createElement("b");
let main_contents = document.createElement("div");
let site_navigation = document.createElement("div");
let site_page_list = document.createElement("ul");
let nimono_profile = document.createElement("div");
let nimono_icon = document.createElement("img");
let nimono_links = document.createElement("div");
let nimono_link_link = document.createElement("a");
let nimono_link_icon = document.createElement("div");

let title_element = document.createElement("b");
let text_element = document.createElement("p");
let label_element = document.createElement("b");
let link_element = [document.createElement("a"), document.createElement("a")];
let list_element = document.createElement("li");
let image_element = document.createElement("img");
let breaker = document.createElement("br");
let spacer = document.createElement("img");
let liner = document.createElement("hr");
let embed_nico = document.createElement("script");
/*======================================================================*/
let links = {
    "nimono": "./assets/images/nimono.png",
    "nicoExp": "https://github.com/nimono3/nicoExpansion"
};
let images = {
    "nimono": ["./assets/images/nimono.png"],
    "nico": ["./assets/images/nico-logo-256.png", "./assets/images/nico-logo-dark-256.png"],
    "YouTube": ["./assets/images/youtube-white.png", "./assets/images/youtube-red.png"],
    "Twitter": ["./assets/images/Twitter-social-icons-circle-white.png", "./assets/images/Twitter-social-icons-circle-blue.png"],
    "GitHub": ["./assets/images/GitHub-Mark-Light-120px-plus.png", "./assets/images/GitHub-Mark.png"],
    "nicoExp": ["./assets/images/nicoExp01.png"]
};
let sizes = {
    "small": "",
    "medium": view_mode ? "4vw" : "1.5vw",
    "big": view_mode ? "7vw" : "2vw",
    "verybig": "",
    "video": {
        "width": 0,
        "height": 0
    }
};
/*大枠===================================================================*/
page_body.className = "main-body";
page_header.className = "main-header";
page_header.style.height = view_mode ? "55px" : "35px";
page_body.appendChild(page_header);
main_body_container.className = "main-body-container";
page_body.appendChild(main_body_container);
if (view_mode) page_body.style.display = "inline";
if (view_mode) main_body_container.style.display = "inline";
{
    main_right_container.className = "main-right-container";
    main_right_container.style.width = view_mode ? "80vw" : "20vw";
    main_right_container.style.marginTop = view_mode ? "0" : "45px";
    main_right_container.style.marginBottom = view_mode ? "5px" : "10px";
    main_right_container.style.marginLeft = view_mode ? "auto" : "0.5vw";
    main_body_container.insertBefore(main_right_container, main_body_container.firstChild);

    main_main_container.className = "main-main-container";
    main_main_container.style.width = view_mode ? "80vw" : "65vw";
    main_main_container.style.marginTop = view_mode ? "60px" : "45px";
    main_main_container.style.marginBottom = view_mode ? "0" : "10px";
    main_main_container.style.marginRight = view_mode ? "auto" : "0.5vw";
    main_main_container.setAttribute("align", "center");
    main_body_container.insertBefore(main_main_container, main_body_container.firstChild);

    main_left_container.className = "main-left-container";
    main_left_container.style.width = view_mode ? "80vw" : "20vw";
    main_left_container.style.marginTop = view_mode ? "0" : "45px";
    main_left_container.style.marginBottom = view_mode ? "0" : "10px";
    //view_mode ? main_body_container.appendChild(main_left_container) : main_body_container.insertBefore(main_left_container, main_body_container.firstChild);/**/
}
page_footer.setAttribute("align", "center");
page_footer.className = "main-footer";
if (!view_mode) page_body.appendChild(page_footer);
/*ヘッダ==================================================================*/
label_element.className = "header-text";
label_element.style.fontSize = view_mode ? "55px" : "35px";
label_element.style.lineHeight = view_mode ? "55px" : "35px";
label_element.innerHTML = "";
page_header.appendChild(label_element.cloneNode(1));
label_element.style.lineHeight = "";
/*真ん中:メインコンテンツ=====================================================*/
if (contents_mode == null) {
    main_title.innerHTML = "にものさんの部屋";
    main_title.className = "main-title";
    main_title.style.fontSize = view_mode ? "9vw" : "3vw";
    main_main_container.appendChild(main_title);

    liner.className = "main-title-line";
    main_main_container.appendChild(liner.cloneNode(1));
}
text_element.className = "text";
text_element.style.fontSize = sizes.big;
text_element.innerHTML = ({ "null": "HOME", "g": "GAME", "t": "TOOL", "v": "VIDEO", "s": "ひとりごと" })[contents_mode];
main_main_container.appendChild(text_element.cloneNode(1));

main_contents.className = "main-contents";
main_contents.setAttribute("align", "left");
main_main_container.appendChild(main_contents);
text_element.className = "text";
text_element.style.fontSize = sizes.medium;
text_element.innerHTML = ({
    "null": "ここはホームページです",
    "g": "これまでに作ったゲームを公開しています",
    "t": "これまでに作ったツール・ブラウザ拡張を公開しています",
    "v": "制作した動画を載せています",
    "s": "最近熱中してることやアニメ, " + "動画・ゲームの制作裏話を語っています"
})[contents_mode];
main_main_container.insertBefore(text_element.cloneNode(1), main_contents);
sizes.video.width = Math.floor(view_mode ? main_contents.clientWidth * (5 / 6) : main_contents.clientWidth / 2.1);
sizes.video.height = sizes.video.width / 16 * 9;
switch (contents_mode) {
    default:
        link_element[0].className = "contents-link";
        link_element[0].style.fontSize = sizes.big;
        text_element.className = "text";
        text_element.style.fontSize = sizes.medium;
        image_element.className = "contents-image-image";
        image_element.style.height = view_mode ? "40vw" : "15vw";
        link_element[1].className = "contents-image-link";
        [
            //{ "text": "GAME", "link": "?c=g", "comment": "これまでに作ったゲームを公開しています" },
            { "text": "TOOL", "link": "?c=t", "comment": "これまでに作ったツール・ブラウザ拡張を公開しています", "images": [{ "image": images.nicoExp[0], "link": links.nicoExp }] },
            { "text": "VIDEO", "link": "?c=v", "comment": "制作した動画を載せています", "images": [] },
            { "text": "ひとりごと", "link": "?c=s", "comment": "最近熱中してることやアニメ, " + (view_mode ? "" : "<br>") + "動画・ゲームの制作裏話を語っています", "images": [] }
        ].map(l => {
            link_element[0].href = l.link;
            link_element[0].innerHTML = "|" + l.text;
            main_contents.appendChild(link_element[0].cloneNode(1));
            text_element.innerHTML = l.comment;
            main_contents.appendChild(text_element.cloneNode(1));
            l.images.map(i => {
                image_element.src = i.image;
                link_element[1].href = i.link;
                link_element[1].appendChild(image_element.cloneNode(1));
                main_contents.appendChild(link_element[1].cloneNode(1));
            });
            main_contents.appendChild(breaker.cloneNode(1));
        });
        break;
    case "g":
        link_element[0].className = "link";
        link_element[0].href = "./games/dmSTG.html";
        link_element[0].style.fontSize = sizes.big;
        link_element[0].innerHTML = "だんまく";
        main_contents.appendChild(link_element[0].cloneNode(1));

        text_element.className = "text";
        text_element.style.fontSize = sizes.medium;
        text_element.innerHTML = "弾を避けて敵を攻撃するゲームです";
        main_contents.appendChild(text_element.cloneNode(1));
        break;
    case "t":
        link_element[0].className = "link";
        link_element[0].href = links.nicoExp;
        link_element[0].style.fontSize = sizes.big;
        link_element[0].innerHTML = "ニコニコ拡張";
        main_contents.appendChild(link_element[0].cloneNode(1));

        text_element.className = "text";
        text_element.style.fontSize = sizes.medium;
        text_element.innerHTML = "ニコニコ動画がより快適に使えることを目指した、Chrome拡張機能です。";
        main_contents.appendChild(text_element.cloneNode(1));

        image_element.className = "contents-image-image";
        image_element.style.height = view_mode ? "40vw" : "15vw";
        image_element.src = images.nicoExp[0];
        link_element[1].href = links.nicoExp;
        link_element[1].appendChild(image_element.cloneNode(1));
        main_contents.appendChild(link_element[1].cloneNode(1));
        break;
    case "v":
        main_contents.setAttribute("align", "center");
        embed_nico.className = "embed-nico";
        embed_nico.type = "application/javascript";
        link_element[0].className = "video-link";
        [
            { "nico": "sm39686395", "YouTube": "ysfcyePz0_Q" },
            { "nico": "sm39618642", "YouTube": "p2253CuI8Tc" },
            { "nico": "sm39287405", "YouTube": "V92voerFQxU" },
            { "nico": "sm39165253", "YouTube": "2hz1psTdISo" },
            { "nico": "sm39267768", "YouTube": "WktsSO0VmZ4" },
            { "nico": "sm38206096", "YouTube": "cd4wBuWXNtY" },
            { "nico": "sm38305970", "YouTube": "2UAC4LZR40o" },
            { "nico": "sm37050588", "YouTube": "6Z3JOJ_ySwM" },
            { "nico": "sm37101971", "YouTube": "" }
        ].map(l => {
            link_element[0].innerHTML = "<iframe width=\"" + sizes.video.width + "\" height=\"" + sizes.video.height + "\" src=\"https://www.youtube.com/embed/" + l.YouTube + "\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>";
            embed_nico.src = "https://embed.nicovideo.jp/watch/" + l.nico + "/script?w=" + sizes.video.width + "&h=" + sizes.video.height;
            if (l.YouTube != "") main_contents.appendChild(link_element[0].cloneNode(1));
            main_contents.appendChild(embed_nico.cloneNode(1));
        });
        break;
    case "s":
        main_contents.setAttribute("align", "center");
        text_element.className = "text";
        text_element.style.margin = "auto";
        text_element.style.fontSize = sizes.medium;
        text_element.innerHTML = "Coming Soon...";
        main_contents.appendChild(text_element.cloneNode(1));
        break;
}
/*右:プロフィール===========================================================*/
nimono_profile.className = "profile-box";
nimono_profile.style.margin = view_mode ? "2vw" : "1vw";
nimono_profile.setAttribute("align", "center");
main_right_container.appendChild(nimono_profile);
label_element.className = "profile-label";
{
    title_element.className = "profile-name";
    title_element.style.fontSize = view_mode ? "8vw" : "1.75vw";
    title_element.innerHTML = "にものさん";
    nimono_profile.appendChild(title_element.cloneNode(1));

    nimono_profile.appendChild(breaker.cloneNode(1));

    nimono_icon.src = links.nimono;
    nimono_icon.className = "profile-icon";
    nimono_icon.setAttribute("alt", "にものさんのアイコン");
    nimono_icon.style.width = view_mode ? "30vw" : "8vw";
    nimono_profile.appendChild(nimono_icon);

    text_element.className = "profile-text";
    text_element.style.fontSize = view_mode ? "5vw" : "1.25vw";
    text_element.innerHTML = "動画/ゲーム/イラストなどを日々創作しています";
    nimono_profile.appendChild(text_element.cloneNode(1));

    nimono_links.className = "nimono-links";
    nimono_links.style.margin = view_mode ? "5vw" : "0.75vw";
    nimono_profile.appendChild(nimono_links);

    {
        nimono_link_link.setAttribute("target", "_blank");
        nimono_link_link.setAttribute("rel", "noopener noreferrer");
        nimono_link_link.className = "nimono-link-link";
        nimono_link_link.style.marginLeft = view_mode ? "1vw" : "0.25vw";
        nimono_link_link.style.marginRight = view_mode ? "1vw" : "0.25vw";
        nimono_link_link.style.marginBottom = view_mode ? "1vw" : "0.5vw";

        nimono_link_icon.className = "nimono-link-icon";
        nimono_link_icon.style.width = view_mode ? "12vw" : "3vw";
        nimono_link_icon.style.height = view_mode ? "12vw" : "3vw";
        nimono_link_link.appendChild(nimono_link_icon);

        label_element.className = "nimono-link-text";
        label_element.style.fontSize = sizes.medium;
        nimono_link_link.appendChild(label_element);
        [
            { "text": "ニコニコ", "link": "?l=niconico", "color": "#606060", "img": images.nico },
            { "text": "YouTube", "link": "?l=YouTube", "color": "#ff0000", "img": images.YouTube },
            { "text": "Twitter", "link": "?l=Twitter", "color": "#1d9bf0", "img": images.Twitter },
            { "text": "GitHub", "link": "?l=GitHub", "color": "#606060", "img": images.GitHub }
        ].map(l => {/*/
            label_element.innerHTML = " " + l.text;
            label_element.setAttribute("onmouseover", "this.style.color = \"" + l.color + "\"");
            label_element.setAttribute("onmouseout", "this.style.color = \"#fafafa\"");/**/

            nimono_link_icon.style.backgroundImage = "url(" + l.img[0] + ")";
            nimono_link_icon.setAttribute("alt", l.text + "_icon");
            nimono_link_icon.setAttribute("onmouseover", "this.style.backgroundImage = \"url(" + l.img[1] + ")\"");
            nimono_link_icon.setAttribute("onmouseout", "this.style.backgroundImage = \"url(" + l.img[0] + ")\"");

            nimono_link_link.href = l.link;
            nimono_links.appendChild(nimono_link_link.cloneNode(1));
        });
    }
}
/*左:閲覧中のページ=========================================================*/
site_navigation.className = "site-navigation";
main_left_container.appendChild(site_navigation);
{
    site_page_list.className = "site-page-list";
    site_navigation.appendChild(site_page_list);
    {
        link_element[0].className = "navi-links";
        link_element[0].style.fontSize = view_mode ? "8vw" : "1.75vw";
        list_element.className = "navi-links-list";
        list_element.appendChild(link_element[0]);
        [
            { "text": "HOME", "link": "./index.html" },
            { "text": "GAME", "link": "?c=g" },
            { "text": "TOOL", "link": "?c=t" },
            { "text": "VIDEO", "link": "?c=v" },
            { "text": "ひとりごと", "link": "?c=s" }
        ].map(l => {
            link_element[0].innerText = l.text;
            link_element[0].href = l.link;
            site_page_list.appendChild(list_element.cloneNode(1));
        });
    }
}
/*フッタ==================================================================*/
label_element.className = "footer-text";
label_element.innerHTML = "<br><br>";
page_footer.appendChild(label_element.cloneNode(1));
/*動的処理================================================================*/
let i = 0;
let rolled = Array.from(document.getElementsByClassName("contents-link")).map(e => ({ "element": e, "over": false }));
setInterval(loop, 100);
function loop() {
    for (let j = 0; j < rolled.length; j++) if (rolled[j].over) rolled[j].element.innerHTML = ["/", "-", "\\", "|"][i % 4] + rolled[j].element.innerHTML.slice(1); else rolled[j].element.innerHTML = "|" + rolled[j].element.innerHTML.slice(1);
    main_body_container.style.paddingBottom = page_footer.clientHeight + "px";
    i++;
}
for (let j = 0; j < rolled.length; j++) {
    rolled[j].element.addEventListener("mouseover", e => {
        rolled[j].over = true;
    }, false);
    rolled[j].element.addEventListener("mouseleave", e => {
        rolled[j].over = false;
    }, false);
}