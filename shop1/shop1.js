// ✅ สินค้า
const products = [
  { id: "A", name: "ยำสาหร่าย", price: 20, img: "M1.jpg", bg: "#FF6B6B" },
  { id: "B", name: "ไข่กุ้ง", price: 20, img: "M2.jpg", bg: "#4ECDC4" },
  { id: "C", name: "ทูน่า", price: 20, img: "M3.jpg", bg: "#FFE66D" },
  { id: "D", name: "ปูอัด", price: 20, img: "M4.jpg", bg: "#1A535C" },
  { id: "E", name: "หมึกกรุบ", price: 20, img: "M5.jpg", bg: "#FF9F1C" }
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
      <label for="qty${p.id}">จำนวน:</label>
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
  if (e.target.classList.contains("quantity")) calculateTotal();
});

// ✅ Preview รูปสลิป
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
    alert("⚠️ กรุณาเลือกสินค้าก่อนยืนยันการสั่งซื้อ");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("room", room);
  formData.append("contact", contact);
  formData.append("shop", "shop1");
  formData.append("total", total);
  formData.append("items", JSON.stringify(items));
  formData.append("slip", slip);

  try {
    const res = await fetch("http://localhost:3000/shop1/send", {
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