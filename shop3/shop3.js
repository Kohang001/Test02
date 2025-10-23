// ✅ กำหนดสินค้า
const products = [
  { id: "A", name: "ลิปสติก", price: 20, img: "M1.jpg", bg: "#FF6B6B", desc: "ลิปสติกสีสวย ติดทนนาน" },
  { id: "B", name: "มาสคาร่า", price: 20, img: "M2.jpg", bg: "#4ECDC4", desc: "ขนตางอนเด้ง ไม่จับตัวเป็นก้อน" },
  { id: "C", name: "อายชาโดว์", price: 20, img: "M3.jpg", bg: "#FFE66D", desc: "สีสวยชัด เกลี่ยง่าย" },
  { id: "D", name: "คุชชั่น", price: 20, img: "M4.jpg", bg: "#1A535C", desc: "ปกปิดดี ให้ผิวโกลว์" },
  { id: "E", name: "ไพรเมอร์", price: 25, img: "M5.jpg", bg: "#FF9F1C", desc: "ช่วยให้เครื่องสำอางติดทน" },
  { id: "F", name: "แป้งพัฟ", price: 30, img: "M6.jpg", bg: "#9D94FF", desc: "ควบคุมความมัน หน้าเนียน" },
  { id: "G", name: "รองพื้น", price: 35, img: "M7.jpg", bg: "#FF6F91", desc: "ปกปิดเรียบเนียน" },
  { id: "H", name: "คอนซิลเลอร์", price: 40, img: "M8.jpg", bg: "#00BFA6", desc: "ปกปิดรอยสิว รอยคล้ำ" },
  { id: "I", name: "บลัชออน", price: 45, img: "M9.png", bg: "#FF9671", desc: "สีแก้มสวยธรรมชาติ" },
  { id: "J", name: "ไฮไลท์เตอร์", price: 50, img: "M10.png", bg: "#FFC75F", desc: "เพิ่มความโกลว์ให้ผิว" },
  { id: "K", name: "อายไลน์เนอร์", price: 150, img: "M11.png", bg: "#D4A5A5", desc: "เส้นคมชัด ติดทน" }
];

const productList = document.getElementById("product-list");
const totalPriceEl = document.getElementById("totalPrice");

// ✅ แสดงสินค้า
products.forEach(p => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.price = p.price;
  card.dataset.id = p.id;

  card.innerHTML = `
    <div class="product-image" style="background-color:${p.bg};">
      <img src="${p.img}" alt="${p.name}">
    </div>
    <div class="product-details">
      <h3>${p.name}</h3>
      <p class="price">ราคา: ${p.price} บาท</p>
      <p class="desc">${p.desc}</p>
      <label for="qty${p.id}">จำนวนที่ต้องการ:</label>
      <input type="number" id="qty${p.id}" class="quantity" min="0" value="0">
    </div>
  `;
  productList.appendChild(card);
});

// ✅ คำนวณราคารวม
function calculateTotal() {
  let total = 0;
  document.querySelectorAll(".product-card").forEach(card => {
    const price = parseFloat(card.dataset.price);
    const qty = parseInt(card.querySelector(".quantity").value) || 0;
    total += price * qty;
  });
  totalPriceEl.textContent = total.toFixed(2);
}

document.addEventListener("input", e => {
  if (e.target.classList.contains("quantity")) {
    calculateTotal();
  }
});

// ✅ Preview รูป
const paymentSlipInput = document.getElementById("paymentSlip");
const preview = document.getElementById("preview");
paymentSlipInput.addEventListener("change", () => {
  preview.innerHTML = "";
  const file = paymentSlipInput.files[0];
  if (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = "200px";
    img.style.borderRadius = "10px";
    preview.appendChild(img);
  }
});

// ✅ ยืนยันการสั่งซื้อ
document.getElementById("confirmOrder").addEventListener("click", async () => {
  const name = document.getElementById("customerName").value.trim();
  const room = document.getElementById("customerRoom").value.trim();
  const contact = document.getElementById("customerContact").value.trim();
  const slip = document.getElementById("paymentSlip").files[0];

  if (!name || !room || !contact) {
    alert("⚠️ กรุณากรอกข้อมูลลูกค้าให้ครบ");
    return;
  }
  if (!slip) {
    alert("⚠️ กรุณาอัปโหลดสลิปก่อนยืนยันการสั่งซื้อ");
    return;
  }

  const items = [];
  document.querySelectorAll(".product-card").forEach(card => {
    const qty = parseInt(card.querySelector(".quantity").value) || 0;
    if (qty > 0) {
      items.push({
        name: card.querySelector("h3").textContent,
        qty,
        price: parseFloat(card.dataset.price)
      });
    }
  });

  const total = parseFloat(totalPriceEl.textContent);

  if (items.length === 0) {
    alert("⚠️ กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("room", room);
  formData.append("contact", contact);
  formData.append("shop", "shop3"); // ✅ แก้ให้ตรงร้าน
  formData.append("total", total);
  formData.append("items", JSON.stringify(items));
  formData.append("slip", slip);

  try {
    const res = await fetch("http://localhost:3000/shop3/send", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    alert(`✅ ${data.message}\nร้าน: ${data.shop}\nเวลาอัปโหลด: ${data.uploadedAt}`);
    console.log("📦 ออเดอร์:", data);
  } catch (err) {
    console.error("❌ Error:", err);
    alert("❌ เกิดข้อผิดพลาดในการส่งออเดอร์");
  }
});
