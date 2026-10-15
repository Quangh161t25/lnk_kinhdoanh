import { lazy } from "react";
import HomeTab from "./HomeTab.jsx";
import OrderDetailsTab from "./OrderDetailsTab.jsx";
import ProductsTab from "./ProductsTab.jsx";
import CustomersTab from "./CustomersTab.jsx";
import DebtsTab from "./DebtsTab.jsx";
import BonusTab from "./BonusTab.jsx";
import RatioTab from "./RatioTab.jsx";

// Dashboard dùng chart.js (nặng) nên chỉ tải khi mở tab.
const SalesDashboardTab = lazy(() => import("./SalesDashboardTab.jsx"));

// id tab (trùng với NAV_ITEMS) → component.
export const TABS = {
  dashboard: HomeTab,
  sales_dashboard: SalesDashboardTab,
  order_details: OrderDetailsTab,
  products: ProductsTab,
  customers: CustomersTab,
  debts: DebtsTab,
  thuong: BonusTab,
  ti_trong: RatioTab
};
