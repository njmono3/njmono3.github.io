const icon = {
  nicoexp: "../../assets/images/nicoExp128.png",
  //nicoru: "https://secure-dcdn.cdn.nimg.jp/nfront/inform/168d439de9621eeeeddec11dd760b2ef.png"
  nicoru: "https://inform.nicovideo.jp/168d439de9621eeeeddec11dd760b2ef.png"
}
const oshirase_list = [
  /*{
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfjzYp4X5xqq5PVAQ_P3zcbdZycKvFXuqJZO0k31bBvfVaZNg/viewform?usp=sf_link",
    icon: icon.nicoexp,
    title: "あなたの回答、お待ちしています",
    d: {
      title: "第一回ユーザーアンケート (~04/05)",
    },
    time: "2023-3-"
  },*/
  {
    link: "https://twitter.com/00nom2/status/1635143474772332545",
    icon: "",
    title: "更新停止",
    d: {
      title: "目途が立っていません",
    },
    time: "2025-4-26"
  },
  {
    link: "https://twitter.com/00nom2/status/1635143474772332545",
    icon: "",
    title: "v3.10.0 追加機能",
    d: {
      title: "お知らせの発信を始めました - @00nom2",
    },
    time: "2023-3-13"
  },
  {
    link: "https://twitter.com/00nom2/status/1635128879181606915",
    icon: "",
    title: "検索機能をアップデート",
    d: {
      title: "Google検索引用だけだと使いづらいので... - @00nom2",
    },
    time: "2023-1-"
  },
  {
    link: "https://twitter.com/00nom2/status/1617095813892820992",
    icon: "",
    title: "v3.9.9 追加機能",
    d: {
      title: "niconico Darkmodeの崩れを補填 - @00nom2",
    },
    time: "2023-1-22"
  },
  {
    link: "",
    icon: icon.nicoru,
    title: "v3.9.0 追加機能",
    d: {
      title: "ニコるを99+まで表示できます",
    },
    time: "2022-12-30"
  }
];

El.appendChildren(document.querySelector(".oshirase-list"), oshirase_list.map(item => {
  return El(".oshirase-item", [
    El("a.oshirase-item-link", { ...(item.link ? ({ href: item.link }) : ({ title: "リンクなし" })), target: "_blank" }, [
      El(".oshirase-icon", [
        El("img.oshirase-icon-image").attr({ src: item.icon })
      ]),
      El(".oshirase-title", [item.title]),
      El(".oshirase-d", [
        El(".oshirase-d-title", [item.d.title])
      ]),
      El(".oshirase-time", [(time => `${(time[0] == new Date().getFullYear() ? "" : time[0] + "年")}${time[1]}月${time[2] ? time[2] + "日" : ""}`)(item.time.split("-"))])
    ])
  ]);
}));
