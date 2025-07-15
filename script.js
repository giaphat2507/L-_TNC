const uploadedImages = {}; // Stores {rowIndex: DataURL}

window.onload = function () {
  const escapeHTML = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const data = [
    {
      order: "1000008354",
      plant: "240706801",
      code: "AT224-023",
      name: "TCHT NỘI THẤT (PRES.SUITE & VILLA)",
      boq: "24023VF0300027A",
      material: "300000189232",
      materialDesc: "DA PLATTINUM_ST-13.1-600X600_PV_CT24-023",
      targetQty: "77.8",
      uom: "M2",
      slTrongKien: "1",
      soLuongKien: "1",
      ghiChu: "This is a short note.",
      phuKien: true,
    },
    {
      order: "1000010012",
      plant: "240706801",
      code: "AT224-023",
      name: "TCHT NỘI THẤT (PRES.SUITE & VILLA)",
      boq: "24023VF0300027A",
      material: "300000189232",
      materialDesc: "DA PLATTINUM_ST-13.1-600X600_PV_CT24-023",
      targetQty: "34.68",
      uom: "M2",
      slTrongKien: "1",
      soLuongKien: "3",
      ghiChu: "This is a note with some additional information.",
      phuKien: true,
    },
    {
      order: "1000010013",
      plant: "240706802",
      code: "AT224-023",
      name: "Dự án thử nghiệm ngắn gọn",
      boq: "24023VF0300027A",
      material: "300000189232",
      materialDesc: "Mô tả vật liệu ngắn",
      targetQty: "10",
      uom: "PC",
      slTrongKien: "5",
      soLuongKien: "2",
      ghiChu: "",
      phuKien: false,
    },
  ];

  const tbody = document.getElementById("tableBody");

  // ✅ Thêm nút "In tem đã chọn" ngay sau phần load
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "print-button-container";
  const printButton = document.createElement("button");
  printButton.textContent = "In tem đã chọn";
  printButton.className = "print-button";
  buttonContainer.appendChild(printButton);
  tbody.parentElement.parentElement.insertBefore(buttonContainer, tbody.parentElement);

  // ✅ Hover đẹp cho dòng
  const style = document.createElement("style");
  style.textContent = `
    tr:hover {
      background-color: #eaf6ff !important;
      transition: background-color 0.2s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  data.forEach((d, rowIndex) => {
    const tr = document.createElement("tr");
    tr.dataset.rowIndex = rowIndex;

    const tdCheckbox = document.createElement("td");
    const rowCheckbox = document.createElement("input");
    rowCheckbox.type = "checkbox";
    rowCheckbox.classList.add("row-checkbox");
    tdCheckbox.appendChild(rowCheckbox);
    tr.appendChild(tdCheckbox);

    const fieldNames = [
      "order",
      "plant",
      "code",
      "name",
      "boq",
      "material",
      "materialDesc",
      "targetQty",
      "uom",
      "slTrongKien",
      "soLuongKien",
      "ghiChu",
    ];

    fieldNames.forEach((fieldName, i) => {
      const val = escapeHTML(d[fieldName]);
      const td = document.createElement("td");
      let inputElement;

      const isReadOnlyColumn = i >= 0 && i <= 8;

      if (i === 3 || i === 6 || i === 11) {
        inputElement = document.createElement("textarea");
        inputElement.value = val;
        inputElement.addEventListener("input", function () {
          this.style.height = "auto";
          this.style.height = this.scrollHeight + "px";
        });
      } else {
        inputElement = document.createElement("input");
        inputElement.type = fieldName === "targetQty" ? "number" : "text";
        inputElement.value = val;
      }

      if (isReadOnlyColumn) {
        inputElement.readOnly = true;
      }

      td.appendChild(inputElement);
      tr.appendChild(td);
    });

    const tdPhuKien = document.createElement("td");
    const checkboxPhuKien = document.createElement("input");
    checkboxPhuKien.type = "checkbox";
    checkboxPhuKien.checked = !!d.phuKien;
    tdPhuKien.appendChild(checkboxPhuKien);
    tr.appendChild(tdPhuKien);

    const tdFile = document.createElement("td");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    const imgPreview = document.createElement("img");
    imgPreview.classList.add("image-preview");
    imgPreview.style.display = "none";

    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imgPreview.src = e.target.result;
          imgPreview.style.display = "block";
          uploadedImages[rowIndex] = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        imgPreview.src = "";
        imgPreview.style.display = "none";
        delete uploadedImages[rowIndex];
      }
    });

    tdFile.appendChild(imgPreview);
    tdFile.appendChild(fileInput);
    tr.appendChild(tdFile);

    tbody.appendChild(tr);
  });

  // ✅ Gắn sự kiện in
printButton.addEventListener("click", function () {
  const selectedRows = Array.from(document.querySelectorAll(".row-checkbox"))
    .map((checkbox, index) => ({ checkbox, index }))
    .filter(({ checkbox }) => checkbox.checked);

  if (selectedRows.length === 0) {
    alert("Vui lòng chọn ít nhất một dòng để in.");
    return;
  }

  const printWindow = window.open("", "_blank");
  const styles = `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .label {
        width: 210mm;
        height: 290mm;
        padding: 20mm 25mm;
        box-sizing: border-box;
        page-break-after: always;
        border: 1px solid #ccc;
        position: relative;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .logo {
        width: 120px;
      }
      .qr {
        width: 100px;
        height: 100px;
      }
      .info {
        margin-top: 20px;
        font-size: 15px;
        line-height: 1.8;
      }
      .info .field {
        margin-bottom: 6px;
      }
      .info .field b {
        display: inline-block;
        width: 160px;
      }
      .image-preview {
        max-width: 100%;
        max-height: 180px;
        margin-top: 15px;
        border: 1px solid #ccc;
        object-fit: contain;
      }
    </style>
  `;

  const labels = selectedRows.map(({ index }) => {
    const row = document.querySelectorAll("tbody tr")[index];
    const cells = row.querySelectorAll("td");
    const getVal = (i) => cells[i].querySelector("textarea, input")?.value || "";

    const order = getVal(1);
    const plant = getVal(2);
    const code = getVal(3);
    const name = getVal(4);
    const boq = getVal(5);
    const material = getVal(6);
    const desc = getVal(7);
    const qty = getVal(8);
    const uom = getVal(9);
    const soSp = getVal(10);
    const soKien = getVal(11);
    const ghiChu = getVal(12);
    const hasPhuKien = cells[13].querySelector("input[type='checkbox']").checked;
    const imgSrc = uploadedImages[index] || "";

    const qrData = `${order}_${plant}_${material}`;

    return `
      <div class="label">
        <div class="header">
          <img src="./images/logo.png" class="logo" />
          <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
            qrData
          )}&size=100x100" class="qr" />
        </div>
        <div class="info">
          <div class="field"><b>Mã dự án:</b> ${code}</div>
          <div class="field"><b>Tên dự án:</b> ${name}</div>
          <div class="field"><b>Mã nhà máy:</b> ${plant}</div>
          <div class="field"><b>Lệnh sản xuất:</b> ${order}</div>
          <div class="field"><b>BOQ:</b> ${boq}</div>
          <div class="field"><b>Material:</b> ${material}</div>
          <div class="field"><b>Mô tả vật liệu:</b> ${desc}</div>
          <div class="field"><b>Số lượng:</b> ${qty} ${uom}</div>
          <div class="field"><b>Số SP/kiện:</b> ${soSp}</div>
          <div class="field"><b>Số kiện:</b> ${soKien}</div>
          <div class="field"><b>Phụ kiện:</b> ${hasPhuKien ? "✔ Có" : "Không"}</div>
          <div class="field"><b>Ghi chú:</b> ${ghiChu || "(Không có)"}</div>
        </div>
        ${imgSrc ? `<img src="${imgSrc}" class="image-preview" />` : ""}
      </div>
    `;
  });

  printWindow.document.write(`
    <html>
      <head>
        <title>Tem kiện</title>
        ${styles}
      </head>
      <body>
        ${labels.join("")}
        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
});

    // ✅ Tự động resize textarea
  
    const inputElement = document.createElement("textarea");
    inputElement.value = val;
    inputElement.style.height = "auto";
    inputElement.style.height = inputElement.scrollHeight + "px";
    inputElement.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
    
    // Append the textarea to the body or any other container
    document.body.appendChild(inputElement);
};
inputElement = document.createElement("textarea");
inputElement.value = val;
inputElement.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});
document.addEventListener('DOMContentLoaded', function() {
  // --- DOM elements ---
  const deliveryIdInput = document.getElementById('deliveryId');
  const deliveryDateInput = document.getElementById('deliveryDate');
  const areaInput = document.getElementById('area');
  const creatorInput = document.getElementById('creator');
  const creationDateInput = document.getElementById('creationDate');
  const vehicleInput = document.getElementById('vehicle');
  const qrCodeInput = document.getElementById('qrCode');
  const projectCodeSelect = document.getElementById('projectCode');
  const projectNameInput = document.getElementById('projectName');
  const kienTableBody = document.getElementById('kienTable');
  const selectAllKienCheckbox = document.getElementById('selectAllKien');
  const printButton = document.getElementById('btnPrint');

  // --- Sample Project Data for dropdown ---
  const projectData = {
      "AT224-023": "TCHT NỘI THẤT (PRES.SUITE & VILLA)",
      "PRJ-001": "Dự án thử nghiệm ngắn gọn"
  };

  // --- Functions ---
  function updateProjectName() {
      projectNameInput.value = projectData[projectCodeSelect.value] || '';
  }

  function printPhieu() {
      // Get values from header form
      const phieu = {
          id: deliveryIdInput.value,
          deliveryDate: deliveryDateInput.value,
          area: areaInput.value,
          creator: creatorInput.value,
          creationDate: creationDateInput.value,
          vehicle: vehicleInput.value,
          qr: qrCodeInput.value,
          projectCode: projectCodeSelect.value,
          projectName: projectNameInput.value
      };

      const selectedKiens = [];
      const rows = kienTableBody.querySelectorAll('tr');

      rows.forEach(row => {
          const checkbox = row.querySelector('.kien-checkbox');
          if (checkbox && checkbox.checked) {
              const cells = row.querySelectorAll('td');
              // Data mapping based on current table structure
              const kienData = {
                  maKien: cells[1].innerText,
                  soKienHienTai: cells[2].innerText, // e.g., "1/3"
                  lenhSX: cells[3].innerText,
                  maMaterial: cells[4].innerText,
                  materialDesc: cells[5].innerText,
                  sl: cells[6].innerText,
                  donVi: cells[7].innerText, // Index 7 is "Đơn vị"
                  slTrongKien: cells[8].innerText, // Index 8 is "SL/trong kiện"
                  soKienTong: cells[9].innerText, // Index 9 is "Số kiện (Tổng)"
                  khuVuc: cells[10].querySelector('.kien-area-input')?.value || '', // Index 10 is "Khu vực"
                  ghiChu: cells[11].querySelector('.kien-notes-input')?.value || '' // Index 11 is "Ghi chú"
              };
              selectedKiens.push(kienData);
          }
      });

      if (selectedKiens.length === 0) {
          alert('Vui lòng chọn ít nhất một kiện để tạo phiếu.');
          return;
      }

      // Start building the table content for the print window
      let tableRowsHtml = '';
      selectedKiens.forEach(kien => {
          tableRowsHtml += `
            <tr>
              <td>${kien.maKien}</td>
              <td>${kien.soKienHienTai}</td>
              <td>${kien.lenhSX}</td>
              <td>${kien.maMaterial}</td>
              <td>${kien.materialDesc}</td>
              <td>${kien.sl}</td>
              <td>${kien.donVi}</td>
              <td>${kien.slTrongKien}</td>
              <td>${kien.soKienTong}</td>
              <td>${kien.khuVuc}</td>
              <td>${kien.ghiChu}</td>
            </tr>
          `;
      });

      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(phieu.qr)}`;

      // --- Print Window HTML Content ---
      const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
              <title>Phiếu Giao Hàng - ${phieu.id}</title>
              <style>
                  body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; font-size: 13px; color: #333; }
                  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                  th, td { border: 1px solid #000; padding: 6px 4px; text-align: left; vertical-align: top;}
                  th { background: #f0f0f0; font-weight: bold; }
                  .print-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
                  .print-header .logo-info { display: flex; align-items: center; gap: 10px; }
                  .print-header .logo-info img { width: 60px; height: auto; } /* Logo size */
                  .print-header .company-details { font-size: 12px; line-height: 1.3; }
                  .print-header .company-details .name { font-weight: bold; font-size: 14px; color: #b90000; }
                  .print-header .delivery-title { font-size: 24px; font-weight: bold; text-align: right; color: #b90000; }
                  .print-header .delivery-meta { font-size: 13px; line-height: 1.5; text-align: right; margin-top: 5px; }
                  .print-header .delivery-meta strong { display: inline-block; min-width: 80px; text-align: left; }
                  .print-header .qr-code-display { text-align: center; margin-left: 20px; } /* Adjust QR margin */
                  .print-header .qr-code-display img { width: 100px; height: 100px; border: 1px solid #ddd; padding: 5px; } /* QR code size */

                  .general-info { margin-bottom: 15px; font-size: 13px; line-height: 1.6;}
                  .general-info p { margin: 0 0 4px 0; display: flex; align-items: baseline; }
                  .general-info strong { display: inline-block; min-width: 150px; font-weight: bold; flex-shrink: 0; margin-right: 5px; }

                  @media print {
                      body { margin: 0; padding: 0; }
                      table { page-break-inside: auto; }
                      tr { page-break-inside: avoid; page-break-after: auto; }
                      thead { display: table-header-group; }
                  }
              </style>
          </head>
          <body>
              <div class="print-header">
                  <div class="logo-info">
                      <img src="./images/logo.png" alt="AA Logo">
                      <div class="company-details">
                          <div class="name">CÔNG TY CỔ PHẦN XÂY DỰNG KIẾN TRÚC AA</div>
                          <p style="margin:0;">Interior Solutions Since 1989</p>
                      </div>
                  </div>
                  <div>
                      <div class="delivery-title">PHIẾU GIAO HÀNG</div>
                      <div class="delivery-meta">
                          <p><strong>Mã phiếu:</strong> ${phieu.id}</p>
                          <p><strong>Ngày giao:</strong> ${phieu.deliveryDate}</p>
                          <p class="qr-code-display"><img src="${qrCodeUrl}" alt="QR Code" /></p>
                      </div>
                  </div>
              </div>

              <div class="general-info">
                  <p><strong>Khu vực:</strong> ${phieu.area}</p>
                  <p><strong>Người tạo:</strong> ${phieu.creator}</p>
                  <p><strong>Ngày tạo:</strong> ${phieu.creationDate}</p>
                  <p><strong>Phương tiện:</strong> ${phieu.vehicle}</p>
                  <p><strong>Mã dự án:</strong> ${phieu.projectCode}</p>
                  <p><strong>Tên dự án:</strong> ${phieu.projectName}</p>
              </div>

              <div class="print-table">
                  <table>
                      <thead>
                          <tr>
                              <th>Mã kiện</th>
                              <th>Số kiện</th>
                              <th>Lệnh SX</th>
                              <th>Mã Material</th>
                              <th>Material Desc</th>
                              <th>SL</th>
                              <th>Đơn vị</th>
                              <th>SL/trong kiện</th>
                              <th>Số kiện(Tổng)</th>
                              <th>Khu vực</th>
                              <th>Ghi chú</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${tableRowsHtml}
                      </tbody>
                  </table>
              </div>
          </body>
          </html>
      `;

      // ✅ Tạo iframe tạm để in
      const printFrame = document.createElement("iframe");
      // Cách ẩn iframe đáng tin cậy hơn
      printFrame.style.position = "absolute";
      printFrame.style.left = "-99999px"; // Di chuyển ra ngoài màn hình
      printFrame.style.width = "1px"; // Giữ kích thước nhỏ nhất có thể
      printFrame.style.height = "1px";
      printFrame.style.border = "0"; // Đảm bảo không có viền
      printFrame.style.opacity = "0"; // Làm cho nó hoàn toàn trong suốt

      document.body.appendChild(printFrame);
      const frameDoc = printFrame.contentWindow || printFrame.contentDocument;

      // Ghi nội dung vào iframe
      frameDoc.document.open();
      frameDoc.document.write(printContent);
      frameDoc.document.close(); // Quan trọng: đóng tài liệu sau khi ghi nội dung

      // ✅ In sau khi iframe đã load hoàn tất
      printFrame.onload = () => {
        // Thêm một độ trễ nhỏ (ví dụ 50ms) để đảm bảo nội dung đã được render hoàn chỉnh
        setTimeout(() => {
          frameDoc.focus(); // Đảm bảo iframe được focus
          frameDoc.print(); // Kích hoạt lệnh in

          // Xóa iframe sau khi lệnh in đã được kích hoạt
          // Có thể cần một độ trễ dài hơn nếu in ra máy in chậm
          setTimeout(() => document.body.removeChild(printFrame), 1000); 
        }, 50); // Độ trễ 50ms
      };
  }

  // --- Event Listeners (Đặt ngoài hàm printPhieu) ---
  projectCodeSelect.addEventListener('change', updateProjectName);
  selectAllKienCheckbox.addEventListener('change', function() {
      kienTableBody.querySelectorAll('.kien-checkbox').forEach(checkbox => {
          checkbox.checked = this.checked;
      });
  });
  printButton.addEventListener("click", printPhieu);

  // --- Initial Setup ---
  updateProjectName(); // Set project name on load
}); // Đóng listener DOMContentLoaded

