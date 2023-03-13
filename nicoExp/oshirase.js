const icon = {
  nicoexp: "../../assets/images/nicoExp128.png"
}
const oshirase_list = [
  {
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfjzYp4X5xqq5PVAQ_P3zcbdZycKvFXuqJZO0k31bBvfVaZNg/viewform?usp=sf_link",
    icon: icon.nicoexp,
    title: "あなたの回答、お待ちしています",
    d: {
      title: "第一回ユーザーアンケート (~03/31)",
    },
    time: "2023.03"
  }
];

El.appendChildren(document.querySelector(".oshirase-list"), oshirase_list.map(item => {
  return El(".oshirase-item", [
    El("a.oshirase-item-link", { target: "_blank" }, [
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
