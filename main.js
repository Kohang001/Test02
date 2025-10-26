// 🛍️ รายชื่อร้านค้า
const work = [
  {
    name: "ข้าวปั้นญี่ปุ่น Handmade",
    desc: "By Pitchayut 5/7",
    image: "https://chillchilljapan.com/wp-content/uploads/2020/10/shutterstock_1110742883-650x513.jpg.webp",
    link: "shop1/shop1.html"
  },
  {
    name: "อาหารตามสั่ง",
    desc: "By Ploy 5/7",
    image: "https://t1.blockdit.com/photos/2021/12/61c5254f10b200dbf6e64d34_800x0xcover_IslHB9Kr.jpg",
    link: "shop2/shop2.html"
  },
  {
    name: "เครื่องสำอาง",
    desc: "By Fah 5/11",
    image: "https://tarad-image.obs.ap-southeast-3.myhuaweicloud.com/shop/j/jjijirjirajiranjiranajiranat/Product/7459702/spd_7a1f25505f_b.jpg",
    link: "shop3/shop3.html"
  }
  
];

// 🎨 แสดงร้านค้า
const workGrid = document.getElementById("workGrid");

works.forEach(work => {
  const card = document.createElement("div");
  card.classList.add("work-card");

  card.innerHTML = `
    <img src="${work.image}" alt="${work.name}">
    <h3>${work.name}</h3>
    <p>${work.desc}</p>
  `;

  card.addEventListener("click", () => {
    window.location.href = work.link;
  });

  workGrid.appendChild(card);
});

