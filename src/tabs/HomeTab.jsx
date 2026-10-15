import { useData } from "../store/DataContext.jsx";

export default function HomeTab() {
  const { data } = useData();
  return (
    <div className="section-shell">
      <div className="section-header"><div className="section-title"><span className="title-dot"></span><span>THỐNG KÊ TRANG CHỦ</span></div></div>
      <div className="panel">
        <div className="stats">
          <div className="stat-card"><small>Tổng khách hàng</small><strong>{data.KHACH_HANG.length}</strong></div>
          <div className="stat-card"><small>Đơn hàng ghi nhận</small><strong className="ok">{data.DH.length}</strong></div>
        </div>
      </div>
    </div>
  );
}
