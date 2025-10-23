// ✅ กำหนดสินค้า
const products = [
  { id: "A", name: "ผัดมาม่า", price: 30, img: "M1.jpg", bg: "#FF6B6B" },
  { id: "B", name: "ข้าวไข่ข้น", price: 30, img: "M2.jpg", bg: "#4ECDC4" },
  { id: "C", name: "ข้าวผัดกุ้ง", price: 30, img: "M3.jpg", bg: "#FFE66D" },
  { id: "D", name: "ข้าวผัดหมู", price: 30, img: "M4.jpg", bg: "#1A535C" },
  { id: "E", name: "ข้าวผัดไก่", price: 30, img: "M5.jpg", bg: "#FF9F1C" }
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
      <p class="price">ราคา: ${p.price} บาท (พิเศษ +10)</p>
      <label for="qty${p.id}">จำนวน:</label>
      <input type="number" id="qty${p.id}" class="quantity" min="0" value="0">

      <div class="menu-type">
        <label><input type="radio" name="type${p.id}" value="normal" checked> ธรรมดา</label>
        <label><input type="radio" name="type${p.id}" value="special"> พิเศษ</label>
      </div>

      <label for="note${p.id}" class="note-label" style="display:none;">รายละเอียดเพิ่มเติม:</label>
      <textarea id="note${p.id}" class="note" rows="2" placeholder="เช่น ไม่ใส่เผ็ด, เพิ่มไข่ดาว" style="display:none;" disabled></textarea>
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
    const type = card.querySelector('input[type="radio"]:checked').value;
    let itemPrice = price;
    if (type === "special") itemPrice += 10;
    total += itemPrice * qty;
  });
  totalPriceEl.textContent = total.toFixed(2);
}

document.addEventListener("input", e => {
  if (e.target.classList.contains("quantity")) {
    const card = e.target.closest(".product-card");
    const qty = parseInt(e.target.value) || 0;
    const note = card.querySelector(".note");
    const noteLabel = card.querySelector(".note-label");

    if (qty > 0) {
      note.style.display = "block";
      noteLabel.style.display = "block";
      note.disabled = false;
    } else {
      note.style.display = "none";
      noteLabel.style.display = "none";
      note.disabled = true;
      note.value = "";
    }
  }
  if (e.target.classList.contains("quantity") || e.target.type === "radio") {
    calculateTotal();
  }
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
    alert("⚠️ กรุณากรอกข้อมูลให้ครบ");
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
      const itemName = card.querySelector("h3").textContent;
      const type = card.querySelector('input[type="radio"]:checked').value;
      const note = card.querySelector(".note").value.trim();
      const price = parseFloat(card.dataset.price);
      items.push({ itemName, type, qty, note, price });
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
  formData.append("shop", "shop2");
  formData.append("total", total);
  formData.append("items", JSON.stringify(items));
  formData.append("slip", slip);

  try {
    const res = await fetch("http://localhost:3000/shop2/send", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    alert(`✅ ${data.message}\nร้าน: ${data.shop}\nเวลาอัปโหลด: ${data.uploadedAt}`);
    console.log("📦 ออเดอร์:", data);
  } catch (err) {
    console.error("❌ Error:", err);
    alert("❌ ไม่สามารถส่งข้อมูลไปยังเซิร์ฟเวอร์ได้");
  }
});
