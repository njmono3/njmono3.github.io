const icon = {
  nicoexp: "../../assets/images/nicoExp128.png",
}
const oshirase_list = [
  {
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfjzYp4X5xqq5PVAQ_P3zcbdZycKvFXuqJZO0k31bBvfVaZNg/viewform?usp=sf_link",
    icon: icon.nicoexp,
    title: "あなたの回答、お待ちしています",
    d: {
      title: "第一回ユーザーアンケート (~03/31)",
    },
    time: "2023.03.13"
  },
  {
    link: "https://twitter.com/00nom2/status/1635128879181606915",
    icon: "",
    title: "検索機能をアップデート",
    d: {
      title: "Google検索引用だけだと使いづらいので...",
    },
    time: "2023.01.22"
  },
  {
    link: "https://twitter.com/00nom2/status/1617095813892820992",
    icon: "",
    title: "v3.9.9 新機能",
    d: {
      title: "niconico Darkmodeの崩れを補填 (@00nom2)",
    },
    time: "2023.01.22"
  },
  {
    link: "",
    icon: icon.nicoexp,
    title: "v3.9.0 新機能",
    d: {
      title: "ニコるを99+まで表示できます",
    },
    time: "2022.12.30"
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
      El(".oshirase-time", [item.time])
    ])
  ]);
}));
