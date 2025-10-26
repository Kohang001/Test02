// 🛍️ รายชื่อร้านค้า
const work = [
  {
    name: "ข้าวปั้นญี่ปุ่น Handmade",
    desc: "By Pitchayut 5/7",
    image: "https://chillchilljapan.com/wp-content/uploads/2020/10/shutterstock_1110742883-650x513.jpg.webp",
    link: "shop1/shop1.html"
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


