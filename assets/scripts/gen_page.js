layout();
const setPageTitle = title => document.title = title + " - にものさんの部屋";
const gen_home = function (contents_mode, open = -1) {
    const body_container = document.getElementById("body-container");
    const header = document.getElementById("header");
    const right_container = document.getElementById("right-container");
    const main_container = document.getElementById("main-container");
    const footer = document.getElementById("footer");
    header.innerHTML = "";
    right_container.innerHTML = "";
    main_container.innerHTML = "";
    //footer.innerHTML = "";
    /*ヘッダ==================================================================*/
    /*真ん中:メインコンテンツ=====================================================*/
    if (!["g", "t", "v", "s"].includes(contents_mode)) {
        main_container.appendChild(new El("h1", "にものさんの部屋", {}, { class: "main-title" }).gen());
        El.appendChildren(main_container, liner.dif({ attr: { class: "main-title-line" } }).gen());
    }
    El.appendChildren(main_container, new El("p", ({ "g": "GAME", "t": "TOOL", "v": "VIDEO", "s": "ひとりごと" })[contents_mode] || "HOME", { fontSize: "calc(var(--font-verybig) * var(--is-sp))" }, {}));

    let main_contents;
    main_container.appendChild(main_contents = new El("div", "", {}, { class: "main-contents", align: "left" }).gen());
    main_container.insertBefore(new El("p", ({
        "g": "これまでに作ったゲームを公開しています",
        "t": "これまでに作ったツール・ブラウザ拡張を公開しています",
        "v": "制作した動画を載せています",
        "s": "最近熱中してることやアニメ, " + "動画・ゲームの制作裏話を語っています"
    })[contents_mode] || "ここはホームページです", { fontSize: "calc(var(--font-big) * var(--is-sp))" }, {}).gen(), main_contents);
    sizes.video.width = Math.floor(view_mode ? main_contents.clientWidth * (5 / 6) : main_contents.clientWidth / 2.1);
    sizes.video.height = sizes.video.width / 16 * 9;
    switch (contents_mode) {
        default:
            El.appendChildren(main_contents, [
                //{ text: "GAME", link: "?c=g", comment: "これまでに作ったゲームを公開しています", images: [] },
                { text: "TOOL", link: "", comment: "これまでに作ったツール・ブラウザ拡張を公開しています", images: [{ image: images.nicoExp[0], link: links.nicoExp }, { image: images.Brainfuck[0], link: links.Brainfuck }], attrs: [{}, { onclick: `history.pushState({c:"t"},"","?c=t");gen_home("t");` }, {}] },
                //{ "text": "VIDEO", "link": "?c=v", "comment": "制作した動画を載せています", "images": [] },
                { text: "ひとりごと", link: "./note/nil", comment: "最近してることやアニメ, " + (view_mode ? "" : "<br>") + "動画・ゲームの制作裏話を語っています", images: [] }
            ].map(l => genEnumElement(...Object.values(l))));
            break;
        case "g":
            setPageTitle("GAME");
            El.appendChildren(main_contents, genEnumElement("だんまく", "./games/dmSTG", "弾を避けて敵を攻撃するゲームです", []));
            break;
        case "t":
            setPageTitle("TOOL");
            El.appendChildren(main_contents, genEnumElement("ニコニコ拡張", links.nicoExp, [
                "ニコニコ動画がより快適に使えることを目指した、Chrome拡張機能です。", new El("br"),
                new El("a", "Chrome", {}, { class: "link", href: links.nicoExp_ch }), " / ",
                new El("a", "FireFox", {}, { class: "link", href: links.nicoExp_fi }), " / ",
                new El("a", "GitHub", {}, { class: "link", href: links.nicoExp_gi })
            ], [{ image: images.nicoExp[0], link: links.nicoExp }]));
            El.appendChildren(main_contents, genEnumElement("Bfインタプリタ", links.Brainfuck, "Brainf*ckのインタプリタです", { image: images.Brainfuck[0], link: links.Brainfuck }));
            break;
        case "v":
            setPageTitle("VIDEO");
            main_contents.setAttribute("align", "center");
            El.appendChildren(main_contents, [
                { "nico": "sm39686395", "YouTube": "ysfcyePz0_Q" },
                { "nico": "sm39618642", "YouTube": "p2253CuI8Tc" },
                { "nico": "sm39287405", "YouTube": "V92voerFQxU" },
                { "nico": "sm39165253", "YouTube": "2hz1psTdISo" },
                { "nico": "sm39267768", "YouTube": "WktsSO0VmZ4" },
                { "nico": "sm38206096", "YouTube": "cd4wBuWXNtY" },
                { "nico": "sm38305970", "YouTube": "2UAC4LZR40o" },
                { "nico": "sm37050588", "YouTube": "6Z3JOJ_ySwM" },
                { "nico": "sm37101971", "YouTube": "" }
            ].flatMap(l => [
                (l.YouTube != "") ? new El("a", "", {}, { class: "video-link" }, [
                    `<iframe width="${sizes.video.width}" height="${sizes.video.height}" src="https://www.youtube.com/embed/${l.YouTube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`]) : 0,
                (l.nico != "") ? new El("script", "", {}, { class: "embed-nico", src: `https://embed.nicovideo.jp/watch/${l.nico}/script?w=${sizes.video.width}&h=${sizes.video.height}`, type: "application/javascript" }) : 0
            ]).filter(_ => _));
            break;
        case "s":
            setPageTitle("ひとりごと");
            main_contents.appendChild(new El("a", "note", { fontSize: "var(--font-big)" }, { href: "./note/nil" }).gen());
            break;
    }
    /*右:プロフィール===========================================================*/
    El.appendChildren(right_container, new El("div", "", { margin: view_mode ? "2vw" : "1vw" }, { class: "profile-box", align: "center" }, [
        new El("b", "にものさん", {}, { class: "profile-name" }),
        breaker,
        new El("img", "", { width: view_mode ? "30vw" : "8vw" }, { class: "profile-icon", src: links.nimono, alt: "にものさんのアイコン" }),
        new El("p", "動画/ツール/イラストなどを日々創作しています", {}, { class: "profile-text" }),
        new El("div", "", { margin: view_mode ? "5vw" : "0.75vw" }, { class: "nimono-links" },
            [
                { "text": "ニコニコ", "link": "?l=niconico", "color": "#606060", "img": images.nico },
                { "text": "YouTube", "link": "?l=YouTube", "color": "#ff0000", "img": images.YouTube },
                { "text": "Twitter", "link": "?l=Twitter", "color": "#1d9bf0", "img": images.Twitter },
                { "text": "GitHub", "link": "?l=GitHub", "color": "#606060", "img": images.GitHub }
            ].map(l =>
                new El("a", "", { margin: view_mode ? "0 1vw 1vw" : "0 0.25vw 0.5vw" }, { class: "nimono-link-link", target: "_blank", rel: "noopener noreferrer", href: l.link }, [
                    new El("div", "", { width: view_mode ? "12vw" : "3vw", height: view_mode ? "12vw" : "3vw", backgroundImage: `url(${l.img[0]})` }, {
                        class: "nimono-link-icon", alt: l.text + "_icon", onmouseover: `this.style.backgroundImage = "url(${l.img[1]})"`, onmouseout: `this.style.backgroundImage = "url(${l.img[0]})"`
                    })
                ])
            )
        )
    ]));
    /*======================================================================*/
    let genRoll = (function* () { while (1) { for (let i = 0; i < 4; i++) { yield ["/", "-", "&#92;", "|"][i]; } } })();
    let rolled = [...document.getElementsByClassName("roll-text")].map(e => ({ element: e, interval: {} }));
    rolled.map(l => {
        l.element.parentNode.addEventListener("mouseover", e => {
            clearInterval(l.interval);
            l.interval = setInterval(() => l.element.innerHTML = genRoll.next().value, 100);
        }, false);
        l.element.parentNode.addEventListener("mouseleave", e => {
            clearInterval(l.interval);
            l.element.innerText = "|";
        }, false);
    });
    const page_popstate = e => {
        window.removeEventListener("popstate", page_popstate, { once: true });
        if (open) gen_home(null, open + 1);
        if (open===0) gen_home(!e.state || e.state.c === contents_mode || e.state.c, open + 1);
    }/*[bug]行ったり来たりすると...*/
    window.addEventListener("popstate", page_popstate, { once: true });
}
gen_home(new URLSearchParams(window.location.search).get("c"));
