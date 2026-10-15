import { memo } from "react";

// Khung tĩnh cho các tab nghiệp vụ trong src/legacy/erp.js. Các tab này tự vẽ nội dung
// bằng innerHTML, nên component này không bao giờ render lại để React không ghi đè chúng.
const SECTION_IDS = ["dashboard", "sales_dashboard", "customers", "products", "order_details", "debts", "thuong", "ti_trong", "sync"];

function LegacyHost() {
  return (
    <>
      <main className="content">
        {SECTION_IDS.map((id) => <section key={id} id={id} className="section" />)}
      </main>

      <div id="modalBackdrop" className="modal-backdrop">
        <div className="modal">
          <div className="modal-head">
            <div>
              <h3 id="modalTitle">Biểu mẫu</h3>
              <p id="modalSubtitle">Cập nhật dữ liệu.</p>
            </div>
            <button className="btn btn-secondary" type="button" id="closeModalBtn">Đóng</button>
          </div>
          <div id="modalBody"></div>
        </div>
      </div>

      <div id="drawerBackdrop" className="drawer-backdrop">
        <div className="drawer">
          <div className="drawer-head">
            <div>
              <h3 id="drawerTitle">Chi tiết</h3>
              <p id="drawerSubtitle">Thông tin</p>
            </div>
            <button className="btn btn-secondary" type="button" id="closeDrawerBtn">Đóng</button>
          </div>
          <div id="drawerBody"></div>
        </div>
      </div>

      <div id="toast" className="toast"></div>
    </>
  );
}

export default memo(LegacyHost, () => true);
