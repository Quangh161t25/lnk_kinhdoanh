    const STORAGE_KEY = "lockking-sales-sheet-session-v2";
    const SESSION_KEY = "erp_user_session";
    const CONFIG = {
      spreadsheetId: "15oumc1yYh6W4UV7ibW6sqhZAlrbfpuTjlxih6N0xoL0",
      authSheetName: "DSNV",
      serviceAccountEmail: "test-gia-ason@api-test-sheet-161.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3NN84hLTkQPZd\nLj7niXZTICq7nHsuTn3J6r2Paq12m70/lYSmrwh1i0EStr9bO19QM8cevGlslwGr\nWSVOLJlc6+w1HGPKvRXtA41kYV9MYIvpzIPQtkFE7Hxq71QyBARcv39Lfzze6Ioj\n3G8VBvAKFLAnCUr97GHRv+KbCTFxPZupd3PEB+xS5ZUlzdBCEZvDid3iXaaEJJ+l\nTd1apAGQHjtnDTLOkiTa8zf7X5ebALwnI9MziOdN8VyprHXGhkachPbKyrG0QwEs\n2jtiI6Y5ULsBPjNefoavH8MKU5DEAT9h0fZ7KfsKYVMDuXqmEKBs0D3B4Z6aDZQW\nwT2dDRZDAgMBAAECggEAEIuVoSzZVuFhaz1GI9ji0IacjvO50cIq7M8Zrj4/F756\nEw6PIhKENafAb7U4INm2AnzUMO8CqL9Jpxs85qUM3W4JysSByqLUiRW2184amIyb\nj7jCXfLBTQn8AbHgrUepl5d/vBmFYMgon/mqjbNiGDb4FZgEQSkie5o6fi/dWp5d\nNahbZl+WTOB/znhAfKh/zferHNxldR/ERmwOubZUerkqysWiBigc3ovpLSUof9ur\nz3hNPPp0CKQjF40xuQc6FYTHUHMLuMvp78PXuc/mYqQmZ8VOGhU+faGtZ4m+QJly\ndF5dS8U5cwKEF+ptuAUiWSahn6INb9yKn3+FcsW0UQKBgQDb8N4eWFvbgpRo/vxo\nwBN2u2TWubj6clcrq/1a+VR0njC28Can0ogJHhrFhPxVs5D/rugs3HlbyAXJFptY\nV0DZPCwBxGU5P5RbGjXWWEUXjp4ISKQD8WKfVlXNr79TqLdOg2NZBYQAi06Cpo/T\nPV9l7LSG2Tj/9WdvD7W2wvrpaQKBgQDVPjpJN6xh7+sHtSU0mjKvrqigpHbuSQ/o\nXpUaWSIpJffm5QpFPAOcTT5mHZCyllicJQIrfPSY+sH8n+sF03CUqVkV4Q2UqfOf\npFaLDB4P6SQ8iesZyF4VKFrj/cAvRJmp0e5W/DRnFkoEp+8c+nrru2+Dzm9kb7Uq\n0CiltqYAywKBgBtcfrV1to+7Ue0x84KwintV2rifyDRX7yI+tjkQFYKgf1zyyUxN\nc6D2vsvdvGqI+TvlrXqPPwW8/4NBrbeyux2LT8o0fYc+sp0WyKXOu2Gv21caelUH\nPYam/eultn6Y2Z0J2V0kw4Qx0GWOhQv5cZnDdb3k3iNxixmU8b03ynEpAoGBAKEA\n7O0fNe50QRZ+tOq0ihSPYQ55XrqnO3WNBDLynZJH8pbI1CpWF7vJrpVXOUs9rQWo\nA61mGR/wJMtiywaJEHWOL48PbzuR3jno0NcHfSMyOoPi9jlvSWncIFQH4TVPLF5F\n/Rh8L+ytrZE6YpWUoX6e9KGmGgDRPw5mQGpuL4RlAoGADe9n080SXlsUk4nHVjUz\nEfv7EBoBkgOpqb9T1foRfJl46NxmmTOYV3iGIhjwcDskEg284k4iq/gH6EEFyEBc\nVz13jzB1nBgjfezFesVQz7bA/+Wik6HZtxAxVg38BKMt+Q1tYw9wOjbGPqOn++VC\nsR2Sh8e3h3Knd6j1tceRIFU=\n-----END PRIVATE KEY-----\n",
      tokenUrl: "https://oauth2.googleapis.com/token",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      sheets: {
        KHACH_HANG: ["id", "ten_kh", "dien_thoai", "email", "dia_chi", "ngay_cap_nhat", "nv_quan_ly", "kenh", "tt"],
        DS_SP: ["id", "ten_sp", "model", "ncc", "gia_ban"],
        DH_CT: ["id", "id_dh", "ngay", "npp", "id_nv", "id_sp", "don_gia", "slg", "thanh_tien", "ncc", "sp_chinh_thuong"],
        KPI: ["id", "thang", "id_nv", "ds_chinh", "ds_thuong", "tien_thuong_ds_chinh", "tien_thuong_ds_thuong", "tien_thuong_ds", "ti_le_thu_con_no", "tong_tien_thuong", "tong_tien_thuong_thuc"],
        CONG_NO: ["id", "ngay", "id_khach_hang", "id_dh", "thu_chi", "so_tien", "cong_no", "id_nv"],
        DK_THUONG: ["id", "thang", "id_nv", "loai", "muc_tu", "muc_den", "gia_tri", "kieu", "ghi_chu"]
      }
    };
    const NAV_ITEMS = [
      { id: "dashboard", label: "Trang chủ", subtitle: "MENU CHÍNH", icon: "home", color: "#2d5bff" },
      { id: "sales_dashboard", label: "Dashboard Kinh doanh", subtitle: "KINH DOANH", icon: "chart", color: "#ff7a1a" },
      { id: "order_details", label: "Đơn hàng Chi tiết", subtitle: "KINH DOANH", icon: "file", color: "#0ea5e9" },
      { id: "products", label: "Danh sách Sản phẩm", subtitle: "KINH DOANH", icon: "box", color: "#8f53ff" },
      { id: "customers", label: "Khách hàng", subtitle: "KINH DOANH", icon: "users", color: "#00b894" },
      { id: "debts", label: "Công nợ", subtitle: "KINH DOANH", icon: "coin", color: "#ff4d6d" },
      { id: "kpi", label: "KPI", subtitle: "KINH DOANH", icon: "chart", color: "#f59e0b" },
      { id: "thuong", label: "Thưởng Nhân Viên", subtitle: "KINH DOANH", icon: "gift", color: "#e11d48" },
      { id: "ti_trong", label: "TỈ TRỌNG", subtitle: "KINH DOANH", icon: "chart", color: "#6366f1" }
    ];
    const DEFAULT_STATE = { KHACH_HANG: [], DS_SP: [], DH: [], DH_CT: [], KPI: [], CONG_NO: [], DK_THUONG: [] };
    const STAFF_SCOPED_SHEETS = ["DH_CT", "CONG_NO", "KPI"];
    let accessToken = "", tokenExpiry = 0, usersData = [], currentUser = null, activeTab = "dashboard";
    let appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    let fullAppState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    let syncMeta = { lastLoadedAt: "", sourceSheets: [] };
    const el = {
      loginScreen: document.getElementById("loginScreen"),
      loginLoading: document.getElementById("loginLoading"),
      loginForm: document.getElementById("loginForm"),
      usernameInput: document.getElementById("usernameInput"),
      passwordInput: document.getElementById("passwordInput"),
      mainApp: document.getElementById("mainApp"),
      navList: document.getElementById("navList"),
      pageTitle: document.getElementById("pageTitle"),
      pageSubtitle: document.getElementById("pageSubtitle"),
      userChip: document.getElementById("userChip"),
      reloadSheetsBtn: document.getElementById("reloadSheetsBtn"),
      logoutBtn: document.getElementById("logoutBtn"),
      sheetSummary: document.getElementById("sheetSummary"),
      modalBackdrop: document.getElementById("modalBackdrop"),
      modalTitle: document.getElementById("modalTitle"),
      modalSubtitle: document.getElementById("modalSubtitle"),
      modalBody: document.getElementById("modalBody"),
      closeModalBtn: document.getElementById("closeModalBtn"),
      toast: document.getElementById("toast")
    };

    const clone = (value) => JSON.parse(JSON.stringify(value));
    const safeText = (value) => String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const money = (value) => Number(value || 0).toLocaleString("vi-VN") + " đ";
    const todayInput = () => new Date().toISOString().slice(0, 10);
    const randomId = (prefix = "") => prefix + Math.random().toString(36).slice(2, 8).toUpperCase();
    const parseDateSort = (str) => { if (!str) return "0"; if (str.includes("-")) return str.replace(/-/g, ""); const p = str.split("/"); return p.length === 3 ? p[2] + p[1].padStart(2, "0") + p[0].padStart(2, "0") : str; };
    const formatDateVi = (str) => { if (!str) return ""; if (str.includes("-")) { const p = str.split("-"); return `${p[2]}/${p[1]}/${p[0]}`; } return str; };
    const formatDateInput = (str) => { if (!str) return todayInput(); if (str.includes("/")) { const p = str.split("/"); return p.length === 3 ? `${p[2]}-${p[1].padStart(2, "0")}-${p[0].padStart(2, "0")}` : str; } return str; };
    const normalizeRole = (value) => String(value || "").trim().toLowerCase();
    const isAdminUser = (user = currentUser) => normalizeRole(user?.quyen || user?.role) === "admin";
    const canManageData = () => isAdminUser();
    const isStaffOwnedRow = (row, userId) => String(row?.id_nv || "").trim() === userId;

    function filterStateByUser(state, user = currentUser) {
      const normalized = normalizeState(state || DEFAULT_STATE);
      if (!user || isAdminUser(user)) return clone(normalized);

      const userId = String(user.id || "").trim();
      const filtered = clone(normalized);

      STAFF_SCOPED_SHEETS.forEach((sheetName) => {
        filtered[sheetName] = normalized[sheetName].filter((row) => isStaffOwnedRow(row, userId));
      });

      const visibleCustomerIds = new Set([
        ...filtered.DH_CT.map((row) => String(row.npp || "").trim()).filter(Boolean),
        ...filtered.CONG_NO.map((row) => String(row.id_khach_hang || "").trim()).filter(Boolean)
      ]);
      const visibleProductIds = new Set(filtered.DH_CT.map((row) => String(row.id_sp || "").trim()).filter(Boolean));

      filtered.KHACH_HANG = normalized.KHACH_HANG.filter((row) => visibleCustomerIds.has(String(row.id || "").trim()));
      filtered.DS_SP = normalized.DS_SP.filter((row) => visibleProductIds.has(String(row.id || "").trim()));

      recalcState(filtered);
      return filtered;
    }

    function applyAccessControlledState(state) {
      fullAppState = normalizeState(state || DEFAULT_STATE);
      appState = filterStateByUser(fullAppState, currentUser);
    }

    function refreshVisibleState() {
      appState = filterStateByUser(fullAppState, currentUser);
    }

    function requireAdminAccess(message = "Bạn không có quyền thực hiện thao tác này.") {
      if (canManageData()) return true;
      showToast(message, true);
      return false;
    }

    function showToast(message, isError = false) {
      el.toast.textContent = message;
      el.toast.style.background = isError ? "#7f1d1d" : "#173d36";
      el.toast.classList.add("show");
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => el.toast.classList.remove("show"), 2600);
    }

    function saveSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
    function loadSession() { try { const raw = localStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
    function clearSession() { localStorage.removeItem(SESSION_KEY); }
    function cacheState() { localStorage.setItem(STORAGE_KEY, JSON.stringify({ appState, syncMeta })); }
    function loadCachedState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        appState = normalizeState(parsed.appState || DEFAULT_STATE);
        fullAppState = clone(appState);
        syncMeta = parsed.syncMeta || syncMeta;
      } catch { }
    }

    async function getAccessToken() {
      if (accessToken && Date.now() < tokenExpiry - 300000) return accessToken;
      const now = Math.floor(Date.now() / 1000);
      const jwt = KJUR.jws.JWS.sign("RS256", JSON.stringify({ alg: "RS256", typ: "JWT" }), JSON.stringify({
        iss: CONFIG.serviceAccountEmail, scope: CONFIG.scopes.join(" "), aud: CONFIG.tokenUrl, exp: now + 3600, iat: now
      }), CONFIG.privateKey);
      const response = await fetch(CONFIG.tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
      });
      const data = await response.json();
      if (!data.access_token) throw new Error(data.error_description || data.error || "Không lấy được access token.");
      accessToken = data.access_token;
      tokenExpiry = Date.now() + Number(data.expires_in || 3600) * 1000;
      return accessToken;
    }

    async function fetchSheetValues(sheetName) {
      const token = await getAccessToken();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${encodeURIComponent(`${sheetName}!A:Z`)}`;
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json();
      if (result.error) throw new Error(result.error.message || `Không đọc được sheet ${sheetName}`);
      return result.values || [];
    }

    async function clearSheet(sheetName) {
      const token = await getAccessToken();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${encodeURIComponent(`${sheetName}!A2:Z`)}:clear`;
      const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: "{}" });
      const result = await response.json();
      if (result.error) throw new Error(result.error.message || `Không xóa được sheet ${sheetName}`);
    }

    async function updateSheet(sheetName, values) {
      const token = await getAccessToken();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${encodeURIComponent(`${sheetName}!A2`)}?valueInputOption=USER_ENTERED`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: values.length > 1 ? values.slice(1) : [] })
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error.message || `Không cập nhật được sheet ${sheetName}`);
    }

    async function appendSheetRow(sheetName, values) {
      const token = await getAccessToken();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values/${encodeURIComponent(`${sheetName}!A:A`)}:append?valueInputOption=USER_ENTERED`;
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values })
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error.message || `Không thêm vào sheet ${sheetName}`);
    }

    function rowsToObjects(values, headers) {
      return (values || []).slice(1).filter((row) => row.some((cell) => String(cell || "").trim() !== "")).map((row) => {
        const item = {};
        headers.forEach((header, index) => item[header] = row[index] == null ? "" : row[index]);
        return item;
      });
    }

    function objectsToRows(items, headers) {
      return [headers].concat((items || []).map((item) => headers.map((header) => {
        if (item[header] === null) return null;
        return item[header] === undefined ? "" : item[header];
      })));
    }

    function normalizeState(input) {
      const state = {
        KHACH_HANG: Array.isArray(input.KHACH_HANG) ? input.KHACH_HANG : [],
        DS_SP: Array.isArray(input.DS_SP) ? input.DS_SP : [],
        DH: [],
        DH_CT: Array.isArray(input.DH_CT) ? input.DH_CT : [],
        KPI: Array.isArray(input.KPI) ? input.KPI : [],
        CONG_NO: Array.isArray(input.CONG_NO) ? input.CONG_NO : [],
        DK_THUONG: Array.isArray(input.DK_THUONG) ? input.DK_THUONG : []
      };
      recalcState(state);
      return state;
    }

    function recalcState(state) {
      const orderMap = {};
      state.DH_CT.forEach((row) => {
        const orderId = String(row.id_dh || "").trim();
        if (!orderId) return;
        if (!orderMap[orderId]) {
          orderMap[orderId] = {
            id: orderId,
            ngay: row.ngay || todayInput(),
            npp: row.npp || "",
            id_nv: row.id_nv || "",
            thanh_tien: 0
          };
        }
        if (!orderMap[orderId].ngay && row.ngay) orderMap[orderId].ngay = row.ngay;
        if (!orderMap[orderId].npp && row.npp) orderMap[orderId].npp = row.npp;
        if (!orderMap[orderId].id_nv && row.id_nv) orderMap[orderId].id_nv = row.id_nv;
        orderMap[orderId].thanh_tien += Number(row.thanh_tien || (Number(row.don_gia || 0) * Number(row.slg || 1)));
      });
      state.DH = Object.values(orderMap);
      state.CONG_NO = state.CONG_NO.map((row) => {
        return { id: row.id || randomId("CN"), ngay: row.ngay || todayInput(), id_khach_hang: row.id_khach_hang || "", id_dh: row.id_dh || "", thu_chi: row.thu_chi === "thu" ? "thu" : "chi", so_tien: Number(row.so_tien || 0), cong_no: row.cong_no === "" || row.cong_no == null ? "" : Number(row.cong_no || 0), id_nv: row.id_nv || "" };
      });
    }

    const removeDiacritics = (value) => String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
    const normalizeBonusKey = (value) => removeDiacritics(value).toLowerCase().replace(/[\s_\-]/g, "");
    const parseLooseNumber = (value) => {
      if (typeof value === "number") return Number.isFinite(value) ? value : 0;
      let text = String(value ?? "").trim();
      if (!text) return 0;
      text = text.replace(/\s+/g, "").replace(/[^0-9,.\-]/g, "");
      if (!text || text === "-" || text === "," || text === ".") return 0;

      const hasDot = text.includes(".");
      const hasComma = text.includes(",");

      if (hasDot && hasComma) {
        if (text.lastIndexOf(",") > text.lastIndexOf(".")) {
          text = text.replace(/\./g, "").replace(",", ".");
        } else {
          text = text.replace(/,/g, "");
        }
      } else if (hasComma) {
        const commaCount = (text.match(/,/g) || []).length;
        if (commaCount > 1) text = text.replace(/,/g, "");
        else text = text.replace(",", ".");
      } else if (hasDot) {
        const dotCount = (text.match(/\./g) || []).length;
        if (dotCount > 1) {
          text = text.replace(/\./g, "");
        } else {
          const parts = text.split(".");
          if (parts.length === 2 && parts[1].length === 3 && parts[0].length > 0) text = parts.join("");
        }
      }

      const parsed = Number(text);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const normalizeProductType = (value) => {
      const normalized = normalizeBonusKey(value);
      if (normalized === "chinh") return "chinh";
      if (normalized === "thuong") return "thuong";
      return "";
    };
    const normalizeMonthKey = (value) => {
      const text = String(value || "").trim();
      if (!text) return "";
      if (/^\d{4}-\d{1,2}$/.test(text)) {
        const [year, month] = text.split("-");
        return `${year}-${month.padStart(2, "0")}`;
      }
      if (/^\d{1,2}\/\d{4}$/.test(text)) {
        const [month, year] = text.split("/");
        return `${year}-${month.padStart(2, "0")}`;
      }
      if (/^\d{4}\/\d{1,2}$/.test(text)) {
        const [year, month] = text.split("/");
        return `${year}-${month.padStart(2, "0")}`;
      }
      return text;
    };
    const computeCustomerDebt = (customerId) => appState.CONG_NO.filter((row) => row.id_khach_hang === customerId).reduce((sum, row) => sum + (row.thu_chi === "thu" ? -Number(row.so_tien || 0) : Number(row.so_tien || 0)), 0);
    const getCustomerName = (customerId) => (appState.KHACH_HANG.find((item) => item.id === customerId) || {}).ten_kh || customerId;
    const getProductName = (productId) => (appState.DS_SP.find((item) => item.id === productId) || {}).ten_sp || productId;
    const getNvN = (id) => { const u = (window.usersData || []).find(x => x.id === id); return u ? u.ho_ten : id; };
    const getVisibleStaffOptions = () => {
      const visibleIds = new Set([
        ...appState.DH.map((row) => row.id_nv),
        ...appState.DH_CT.map((row) => row.id_nv),
        ...appState.CONG_NO.map((row) => row.id_nv),
        ...appState.KPI.map((row) => row.id_nv)
      ].filter(Boolean));
      return usersData.filter((user) => visibleIds.has(user.id));
    };

    async function fetchAuthUsers() {
      el.loginLoading.classList.remove("hidden");
      el.loginForm.classList.add("hidden");
      const values = await fetchSheetValues(CONFIG.authSheetName);
      usersData = values.slice(1).map((row) => ({
        id: String(row[0] || "").trim(),
        ho_ten: String(row[1] || "").trim(),
        hinh_anh: String(row[2] || "").trim(),
        gioi_tinh: String(row[3] || "").trim(),
        ngay_sinh: String(row[4] || "").trim(),
        quyen: normalizeRole(row[5]),
        mk: String(row[6] || "").trim(),
        email: String(row[7] || "").trim(),
        dien_thoai: String(row[8] || "").trim(),
        chuc_vu: String(row[9] || "").trim(),
        phong_ban: String(row[10] || "").trim(),
        trang_thai: String(row[11] || "").trim(),
        ngay_vao_lam: String(row[12] || "").trim(),
        chi_nhanh_lam_viec: String(row[13] || "").trim(),
        file_ho_so: String(row[14] || "").trim()
      })).filter((item) => item.id);
      el.loginLoading.classList.add("hidden");
      el.loginForm.classList.remove("hidden");
    }

    function getNavIcon(name) {
      const icons = {
        home: `<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.5V21h14V9.5"></path></svg>`,
        chart: `<svg viewBox="0 0 24 24"><path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 15V9"></path><path d="M12 15V6"></path><path d="M16 15v-3"></path></svg>`,
        bag: `<svg viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8Z"></path><path d="M9 9V7a3 3 0 1 1 6 0v2"></path></svg>`,
        file: `<svg viewBox="0 0 24 24"><path d="M8 3h6l4 4v14H8z"></path><path d="M14 3v5h5"></path></svg>`,
        box: `<svg viewBox="0 0 24 24"><path d="m12 3 8 4.5-8 4.5L4 7.5 12 3Z"></path><path d="M4 7.5V16.5L12 21l8-4.5V7.5"></path><path d="M12 12v9"></path></svg>`,
        users: `<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><path d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M21 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        coin: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="M9.5 9.5c.3-1 1.2-1.5 2.5-1.5 1.7 0 2.5.8 2.5 1.9 0 2.7-5 1.3-5 4 0 1.2 1 2.1 2.8 2.1 1.4 0 2.4-.6 2.7-1.7"></path><path d="M12 7v10"></path></svg>`,
        gift: `<svg viewBox="0 0 24 24"><path d="M20 12v10H4V12"></path><path d="M22 7H2v5h20V7z"></path><path d="M12 22V7"></path><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`
      };
      return icons[name] || icons.home;
    }

    function applyUserToHeader() {
      if (!currentUser) return;
      const displayName = currentUser.ho_ten || currentUser.name || currentUser.id;
      const role = isAdminUser(currentUser) ? "admin" : (currentUser.quyen || currentUser.role || "user");
      const initials = (displayName || "U").trim().slice(0, 2).toUpperCase();
      document.getElementById("userAvatar").innerHTML = `${safeText(initials)}<span style="position:absolute;bottom:1px;right:1px;width:9px;height:9px;background:#22c55e;border-radius:50%;border:2px solid #fff;"></span>`;
      document.getElementById("userDisplayName").textContent = displayName;
      document.getElementById("userRole").textContent = role;
      document.getElementById("userDropName").textContent = displayName;
      document.getElementById("userDropRole").textContent = role;

      // Toggle dropdown
      const toggle = document.getElementById("userMenuToggle");
      const dropdown = document.getElementById("userDropdown");
      toggle.onclick = (e) => { e.stopPropagation(); dropdown.style.display = dropdown.style.display === "block" ? "none" : "block"; };
      document.addEventListener("click", () => { dropdown.style.display = "none"; }, { once: false });
      dropdown.addEventListener("click", (e) => e.stopPropagation());
    }

    function toggleSidebar() {
      const app = el.mainApp;
      app.classList.toggle("collapsed");
      localStorage.setItem("sidebar_collapsed", app.classList.contains("collapsed") ? "1" : "0");
    }

    function initSidebarToggle() {
      const btn = document.getElementById("menuToggleBtn");
      if (btn) btn.addEventListener("click", toggleSidebar);
      // Restore saved state
      if (localStorage.getItem("sidebar_collapsed") === "1") {
        el.mainApp.classList.add("collapsed");
      }
    }


    function renderNav() {
      const groups = {};
      NAV_ITEMS.forEach((item) => { if (!groups[item.subtitle]) groups[item.subtitle] = []; groups[item.subtitle].push(item); });
      el.navList.innerHTML = Object.entries(groups).map(([group, items]) => `<div class="menu-group"><div class="menu-title">${safeText(group)}</div>${items.map((item) => { const isActive = item.id === activeTab && !(activeTab === "dashboard" && item.label !== "Trang chủ"); return `<button class="nav-btn ${isActive ? "active" : ""}" data-tab="${item.id}"><span class="nav-icon" style="color:${item.color};">${getNavIcon(item.icon)}</span><span class="nav-text">${safeText(item.label)}</span></button>`; }).join("")}</div>`).join("");
      el.navList.querySelectorAll(".nav-btn").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.tab)));
    }

    function renderActiveSection(tabId = activeTab) {
      const renderers = {
        dashboard: renderDashboard,
        sales_dashboard: renderSalesDashboard,
        customers: renderCustomers,
        products: renderProducts,
        order_details: renderOrderDetails,
        debts: renderDebts,
        kpi: renderKpi,
        thuong: renderThuong,
        ti_trong: renderTiTrong,
        sync: renderSync
      };
      (renderers[tabId] || renderDashboard)();
    }

    function switchTab(tabId) {
      activeTab = tabId;
      renderActiveSection(tabId);
      renderNav();
      document.querySelectorAll(".section").forEach((section) => section.classList.toggle("active", section.id === tabId));
      const meta = NAV_ITEMS.find((item) => item.id === tabId) || NAV_ITEMS[0];
      el.pageTitle.textContent = meta.label;
      el.pageSubtitle.textContent = meta.subtitle;
      if (typeof window.updateSalesDashSticky === "function") requestAnimationFrame(() => window.updateSalesDashSticky());
    }
    function openModal(title, subtitle, html) {
      el.modalTitle.textContent = title;
      el.modalSubtitle.textContent = subtitle;
      el.modalBody.innerHTML = html;
      el.modalBackdrop.classList.add("open");
    }

    function closeModal() {
      el.modalBackdrop.classList.remove("open");
      el.modalBody.innerHTML = "";
    }

    function openDrawer(title, subtitle, html) {
      document.getElementById("drawerTitle").textContent = title;
      document.getElementById("drawerSubtitle").textContent = subtitle;
      document.getElementById("drawerBody").innerHTML = html;
      document.getElementById("drawerBackdrop").classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      document.getElementById("drawerBackdrop").classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => { document.getElementById("drawerBody").innerHTML = ""; }, 300);
    }

    let salesChartMonth = null;
    let salesDashStickyHandler = null;
    let salesDashStickyResizeHandler = null;
    let salesChartDay = null;

    function renderDashboard() {
      const total = appState.KHACH_HANG.length;
      const working = appState.DH.length;
      document.getElementById("dashboard").innerHTML = `
        <div class="section-shell">
          <div class="section-header"><div class="section-title"><span class="title-dot"></span><span>THỐNG KÊ TRANG CHỦ</span></div></div>
          <div class="panel">
            <div class="stats">
              <div class="stat-card"><small>Tổng khách hàng</small><strong>${total}</strong></div>
              <div class="stat-card"><small>Đơn hàng ghi nhận</small><strong class="ok">${working}</strong></div>
            </div>
          </div>
        </div>`;
    }

    function renderSalesDashboard() {
      // Data helpers
      const nvArr = getVisibleStaffOptions().map(user => ({ value: user.id, label: user.ho_ten }));
      const khArr = [...new Set(appState.KHACH_HANG.map(c => ({ value: c.id, label: c.ten_kh })).filter(k => k.value))];

      const styleTag = document.getElementById("multiSelectStyle");
      if (!styleTag) {
        const s = document.createElement("style");
        s.id = "multiSelectStyle";
        s.textContent = `
          .ms-container { position: relative; min-width: 160px; font-size: 13px; font-family: inherit; }
          .ms-btn { width: 100%; border: 1px solid var(--line); border-radius: 8px; background: #fff; padding: 0 12px; height: 36px; text-align: left; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
          .ms-btn span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; font-weight: 500; }
          .ms-btn:after { content: ""; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #66789b; }
          .ms-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); z-index: 1100; margin-top: 4px; display: none; width: max-content; min-width: 100%; }
          .ms-dropdown.show { display: block; }
          .ms-search-box { padding: 8px; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: #fff; z-index: 1; }
          .ms-search-box input { width: 100%; border: 1px solid var(--line); padding: 6px 10px; border-radius: 6px; font-size: 13px; outline: none; }
          .ms-options-wrap { max-height: 240px; overflow-y: auto; padding: 4px 0; }
          .ms-option { padding: 8px 12px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background .12s; }
          .ms-option:hover { background: var(--soft); }
          .ms-option input { cursor: pointer; width: 14px; height: 14px; accent-color: var(--brand); }
          .ms-option label { cursor: pointer; flex: 1; white-space: nowrap; font-weight: 500; }
          .ms-footer { padding: 8px; border-top: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; background: #fff; position: sticky; bottom: 0; }
          .ms-footer label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 600; color: var(--brand); }
          .ms-footer label input { accent-color: var(--brand); width: 14px; height: 14px; }
          .ms-btn-clear { border: none; background: transparent; color: #ef4444; font-size: 12px; font-weight: 700; cursor: pointer; padding: 4px 8px; border-radius: 4px; }
          .ms-btn-clear:hover { background: #fef2f2; }
        `;
        document.head.appendChild(s);
      }

      document.getElementById("sales_dashboard").innerHTML = `
        <div id="salesDashFilterWrap" class="sales-dash-filter-wrap">
        <div id="salesDashFilter" class="sales-dash-filter">
          <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          
          <div style="display:flex; align-items:center; background:#fff; border:1px solid var(--line); border-radius:8px; padding:0 8px; height:36px;">
             <input type="month" id="dashTime" style="border:none; outline:none; font-size:13px; color:var(--text); background:transparent;" title="Lọc theo tháng">
             <button id="dashTimeClr" style="border:none; background:none; cursor:pointer; font-size:16px; color:#ef4444; display:none">&times;</button>
          </div>
          
          <div class="ms-container" id="dashNvPicker">
             <button type="button" class="ms-btn" id="dashNvBtn"><span>ID Nhân viên</span></button>
             <div class="ms-dropdown" id="dashNvMenu">
                <div class="ms-search-box"><input type="text" id="dashNvSearch" placeholder="Tìm ID nhân viên..." autocomplete="off"></div>
                <div class="ms-options-wrap" id="dashNvList"></div>
                <div class="ms-footer">
                   <label><input type="checkbox" id="dashNvAll"> Chọn tất cả</label>
                   <button type="button" class="ms-btn-clear" id="dashNvClear">Xóa chọn</button>
                </div>
             </div>
          </div>

          <div class="ms-container" id="dashKhPicker">
             <button type="button" class="ms-btn" id="dashKhBtn"><span>ID Khách hàng</span></button>
             <div class="ms-dropdown" id="dashKhMenu">
                <div class="ms-search-box"><input type="text" id="dashKhSearch" placeholder="Tìm ID khách hàng..." autocomplete="off"></div>
                <div class="ms-options-wrap" id="dashKhList"></div>
                <div class="ms-footer">
                   <label><input type="checkbox" id="dashKhAll"> Chọn tất cả</label>
                   <button type="button" class="ms-btn-clear" id="dashKhClear">Xóa chọn</button>
                </div>
             </div>
          </div>
        </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px; margin-bottom:16px;" id="dashSummaryRow">
          <div class="card" style="padding:12px 14px; border:none; box-shadow:0 2px 8px rgba(0,0,0,.04);">
             <small style="color:var(--muted);font-weight:700;font-size:10px">TỔNG DOANH SỐ</small>
             <strong id="dTotalS" style="display:block;font-size:16px;color:#2d5bff;margin-top:4px">-</strong>
          </div>
          <div class="card" style="padding:12px 14px; border:none; box-shadow:0 2px 8px rgba(0,0,0,.04);">
             <small style="color:#2563eb;font-weight:700;font-size:10px">SẢN PHẨM CHÍNH</small>
             <strong id="dTotalSpChinh" style="display:block;font-size:16px;color:#2563eb;margin-top:4px">-</strong>
          </div>
          <div class="card" style="padding:12px 14px; border:none; box-shadow:0 2px 8px rgba(0,0,0,.04);">
             <small style="color:#7c3aed;font-weight:700;font-size:10px">SẢN PHẨM THƯỜNG</small>
             <strong id="dTotalSpThuong" style="display:block;font-size:16px;color:#7c3aed;margin-top:4px">-</strong>
          </div>
          <div class="card" style="padding:12px 14px; border:none; box-shadow:0 2px 8px rgba(0,0,0,.04);">
             <small style="color:var(--muted);font-weight:700;font-size:10px">TỔNG NỢ PHÁT SINH</small>
             <strong id="dTotalChi" style="display:block;font-size:16px;color:#ef4444;margin-top:4px">-</strong>
          </div>
          <div class="card" style="padding:12px 14px; border:none; box-shadow:0 2px 8px rgba(0,0,0,.04);">
             <small style="color:var(--muted);font-weight:700;font-size:10px">TỔNG NỢ ĐÃ THU</small>
             <strong id="dTotalThu" style="display:block;font-size:16px;color:#16a34a;margin-top:4px">-</strong>
          </div>
          <div class="card" style="padding:12px 14px; border:none; box-shadow:0 2px 8px rgba(0,0,0,.04);">
             <small style="color:var(--muted);font-weight:700;font-size:10px">NỢ CÒN LẠI</small>
             <strong id="dTotalRem" style="display:block;font-size:16px;color:#8b5cf6;margin-top:4px">-</strong>
          </div>
          <div class="card" style="padding:12px 14px; border:none; box-shadow:0 2px 8px rgba(0,0,0,.04);">
             <small style="color:var(--muted);font-weight:700;font-size:10px">SỐ ĐƠN HÀNG</small>
             <strong id="dTotalO" style="display:block;font-size:16px;color:#0ea5e9;margin-top:4px">-</strong>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 2fr 3fr; gap:20px; margin-bottom:20px;">
          <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;"><h3 style="margin:0;padding:14px 16px;background:#f8fafc;border-bottom:1px solid var(--line);font-size:14px">Bảng Doanh số theo NCC</h3><div class="table-wrap" style="flex:1;max-height:260px;overflow-y:auto;"><table style="min-width:100%"><thead><tr><th>Tên NCC</th><th style="text-align:right">Tổng D/số</th></tr></thead><tbody id="dTNcc"></tbody></table></div></div>
          <div class="card" style="padding:16px;"><h3 style="margin:0 0 16px;font-size:14px">Doanh số theo tháng</h3><div style="height:260px"><canvas id="cMonth"></canvas></div></div>
        </div>

        <div style="display:grid; gap:20px; margin-bottom:40px;">
          <div class="card" style="padding:0;overflow:hidden"><h3 style="margin:0;padding:14px 16px;background:#f8fafc;border-bottom:1px solid var(--line);font-size:14px">Bảng Doanh số theo tháng</h3><div class="table-wrap"><table style="min-width:100%"><thead><tr><th>Tháng</th><th style="text-align:right">Doanh số</th><th style="text-align:right">Số đơn</th><th style="text-align:right">Nợ phát sinh</th><th style="text-align:right">Đã thu</th><th style="text-align:right">Nợ ròng tháng</th><th style="text-align:right">Dư nợ cuối tháng</th></tr></thead><tbody id="dTMonth"></tbody></table></div></div>
          <div class="card" style="padding:0;overflow:hidden"><h3 style="margin:0;padding:14px 16px;background:#f8fafc;border-bottom:1px solid var(--line);font-size:14px">Bảng Nhân viên (Mã NV)</h3><div class="table-wrap"><table style="min-width:100%"><thead><tr><th>Mã NV</th><th style="text-align:right">Doanh số</th><th style="text-align:right">Nợ phát sinh</th><th style="text-align:right">Nợ đã thu</th><th style="text-align:right">Nợ ròng</th><th style="text-align:right">Dư nợ cuối</th><th style="text-align:right">Tỉ lệ thu (tháng này)</th><th style="text-align:right">Tỉ lệ thu (tháng trc)</th></tr></thead><tbody id="dTNv"></tbody></table></div></div>
          <div class="card" style="padding:0;overflow:hidden"><h3 style="margin:0;padding:14px 16px;background:#f8fafc;border-bottom:1px solid var(--line);font-size:14px">Bảng Doanh số theo Khách hàng</h3><div class="table-wrap"><table style="min-width:100%"><thead><tr><th>Mã KH</th><th>Tên KH</th><th style="text-align:right">Doanh số</th><th style="text-align:right">Số đơn</th><th style="text-align:right">Nợ phát sinh</th><th style="text-align:right">Đã thu</th><th style="text-align:right">Nợ ròng tháng</th><th style="text-align:right">Dư nợ cuối tháng</th></tr></thead><tbody id="dTKh"></tbody></table></div><div class="pagination" id="dTKhPagination"></div></div>
        </div>
      `;

      const setupMultiSelect = (btnId, menuId, listId, searchId, allId, clearId, items, onUpdate, label) => {
        const btn = document.getElementById(btnId);
        const menu = document.getElementById(menuId);
        const list = document.getElementById(listId);
        const search = document.getElementById(searchId);
        const all = document.getElementById(allId);
        const clear = document.getElementById(clearId);
        let selected = new Set();
        const renderList = () => {
          const q = search.value.toLowerCase();
          const filtered = items.filter(it => it.label.toLowerCase().includes(q) || it.value.toLowerCase().includes(q));
          list.innerHTML = filtered.map(it => `<div class="ms-option"><input type="checkbox" value="${safeText(it.value)}" ${selected.has(it.value) ? 'checked' : ''}><label>${safeText(it.label)} <small>(${safeText(it.value)})</small></label></div>`).join("");
          list.querySelectorAll(".ms-option").forEach(opt => {
            opt.onclick = (e) => {
              const cb = opt.querySelector("input");
              if (e.target !== cb) cb.checked = !cb.checked;
              if (cb.checked) selected.add(cb.value); else selected.delete(cb.value);
              updateUI();
            };
          });
        };
        const updateUI = () => {
          if (selected.size === 0) { btn.querySelector("span").textContent = label; all.checked = false; }
          else if (selected.size === items.length) { btn.querySelector("span").textContent = "Tất cả " + label; all.checked = true; }
          else { btn.querySelector("span").textContent = `Đã chọn (${selected.size})`; all.checked = false; }
          onUpdate();
        };
        btn.onclick = (e) => { e.stopPropagation(); menu.classList.toggle("show"); };
        document.addEventListener("click", (e) => { if (!menu.contains(e.target) && e.target !== btn) menu.classList.remove("show"); });
        search.oninput = renderList;
        all.onchange = () => { if (all.checked) items.forEach(it => selected.add(it.value)); else selected.clear(); renderList(); updateUI(); };
        clear.onclick = () => { selected.clear(); search.value = ""; all.checked = false; renderList(); updateUI(); };
        renderList();
        return { getSelected: () => Array.from(selected) };
      };

      let msNv, msKh;
      let khCurrentPage = 1;
      const khPageSize = 20;
      const getPrevMonth = (ym) => {
        if (!ym) return null;
        const [y, m] = ym.split("-").map(Number);
        const d = new Date(y, m - 2, 1);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      };

      const draw = () => {
        const fT = document.getElementById("dashTime").value;
        const fNs = msNv ? msNv.getSelected() : [];
        const fKs = msKh ? msKh.getSelected() : [];
        document.getElementById("dashTimeClr").style.display = fT ? "block" : "none";

        const data = appState.DH.filter(d => {
          if (d.nhap_xuat && d.nhap_xuat.toLowerCase() !== "xuat") return false;
          if (fT) {
            const ym = d.ngay.includes("-") ? d.ngay.slice(0, 7) : (d.ngay.split("/").length >= 3 ? d.ngay.split("/")[2] + "-" + d.ngay.split("/")[1].padStart(2, "0") : "");
            if (ym !== fT) return false;
          }
          if (fNs.length > 0 && !fNs.includes(d.id_nv)) return false;
          if (fKs.length > 0 && !fKs.includes(d.npp)) return false;
          return true;
        });

        const tS = data.reduce((s, d) => s + Number(d.thanh_tien || 0), 0);
        const tC = data.length;
        document.getElementById("dTotalS").textContent = money(tS);
        document.getElementById("dTotalO").textContent = tC;

        // Tính doanh số SP Chính/Thưởng từ DH_CT
        const filteredDetails = appState.DH_CT.filter(item => {
          if (fT) {
            const ym = item.ngay.includes("-") ? item.ngay.slice(0, 7) : (item.ngay.split("/").length >= 3 ? item.ngay.split("/")[2] + "-" + item.ngay.split("/")[1].padStart(2, "0") : "");
            if (ym !== fT) return false;
          }
          if (fNs.length > 0 && !fNs.includes(item.id_nv)) return false;
          if (fKs.length > 0 && !fKs.includes(item.npp)) return false;
          return true;
        });
        const spChinhTotal = filteredDetails.reduce((sum, item) => (normalizeProductType(item.sp_chinh_thuong) === "chinh" ? sum + Number(item.thanh_tien || 0) : sum), 0);
        const spThuongTotal = filteredDetails.reduce((sum, item) => (normalizeProductType(item.sp_chinh_thuong) === "thuong" ? sum + Number(item.thanh_tien || 0) : sum), 0);
        document.getElementById("dTotalSpChinh").textContent = money(spChinhTotal);
        document.getElementById("dTotalSpThuong").textContent = money(spThuongTotal);

        const getM = (ngay) => {
          if (!ngay) return "N/A";
          if (ngay.includes("-")) return ngay.split("-").slice(0, 2).reverse().join("/");
          if (ngay.includes("/") && ngay.split("/").length >= 3) return ngay.split("/")[1].padStart(2, "0") + "/" + ngay.split("/")[2];
          return "N/A";
        };
        const sortM = (m) => {
          if (m === "N/A") return "000000";
          const p = m.split("/");
          return p.length === 2 ? p[1] + p[0] : "000000";
        };

        const nvStats = {}; const khStats = {};
        nvArr.forEach(item => {
          nvStats[item.value] = { c: 0, s: 0, chi: 0, thu: 0, chiCM: 0, thuCM: 0, chiLM: 0, luyKe: 0 };
        });
        // Tháng hiệu lực: nếu có lọc thì dùng fT, không thì dùng tháng hiện tại
        const now = new Date();
        const currentYM = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
        const effectiveMonth = fT || currentYM;
        const fTPrev = getPrevMonth(effectiveMonth);
        const bMon = {};
        data.forEach(d => {
          let m = getM(d.ngay);
          if (!bMon[m]) bMon[m] = { c: 0, s: 0 }; bMon[m].c++; bMon[m].s += Number(d.thanh_tien || 0);

          const n = d.id_nv || "N/A";
          if (!nvStats[n]) nvStats[n] = { c: 0, s: 0, chi: 0, thu: 0, chiCM: 0, thuCM: 0, chiLM: 0, luyKe: 0 };
          nvStats[n].c++; nvStats[n].s += Number(d.thanh_tien || 0);

          const k = d.npp || "N/A";
          if (!khStats[k]) khStats[k] = { c: 0, s: 0, chi: 0, thu: 0, luyKe: 0 };
          khStats[k].c++; khStats[k].s += Number(d.thanh_tien || 0);
        });

        const fTm = fT ? fT.split("-").reverse().join("/") : null;

        const debtByMon = {};
        appState.CONG_NO.forEach(c => {
          if (fKs.length > 0) {
            let nppMatched = false;
            if (fKs.includes(c.id_khach_hang)) nppMatched = true;
            if (!nppMatched && c.id_dh) {
              const matchedDH = appState.DH.find(dh => dh.id === c.id_dh);
              if (matchedDH && fKs.includes(matchedDH.npp)) nppMatched = true;
            }
            if (!nppMatched) return;
          }
          if (fNs.length > 0 && !fNs.includes(c.id_nv)) return;

          let m = getM(c.ngay);
          if (!debtByMon[m]) debtByMon[m] = { chi: 0, thu: 0 };

          const soTien = Number(c.so_tien || 0);
          const isChi = c.thu_chi === "chi";
          const isThu = c.thu_chi === "thu";

          if (isChi) debtByMon[m].chi += soTien;
          if (isThu) debtByMon[m].thu += soTien;

          // Ghi nhận cho Nhân viên và Khách Hàng
          const kId = c.id_khach_hang || "N/A";
          const nId = c.id_nv || "N/A";
          if (!khStats[kId]) khStats[kId] = { c: 0, s: 0, chi: 0, thu: 0, luyKe: 0 };
          if (!nvStats[nId]) nvStats[nId] = { c: 0, s: 0, chi: 0, thu: 0, chiCM: 0, thuCM: 0, chiLM: 0, luyKe: 0 };

          const cym = c.ngay.includes("-") ? c.ngay.slice(0, 7) : (c.ngay.split("/").length >= 3 ? c.ngay.split("/")[2] + "-" + c.ngay.split("/")[1].padStart(2, "0") : "");
          if (fTPrev && cym === fTPrev && isChi) nvStats[nId].chiLM += soTien;
          if (cym === effectiveMonth && isChi) nvStats[nId].chiCM += soTien;
          if (cym === effectiveMonth && isThu) nvStats[nId].thuCM += soTien;

          let isBeforeOrInFt = true;
          let isInFt = true;
          if (fTm) {
            if (sortM(m) > sortM(fTm)) { isBeforeOrInFt = false; isInFt = false; }
            else if (sortM(m) < sortM(fTm)) { isInFt = false; }
          }

          if (isBeforeOrInFt) {
            let delta = 0;
            if (isChi) delta += soTien;
            if (isThu) delta -= soTien;

            khStats[kId].luyKe += delta;
            nvStats[nId].luyKe += delta;

            if (isInFt) {
              if (isChi) { khStats[kId].chi += soTien; nvStats[nId].chi += soTien; }
              if (isThu) { khStats[kId].thu += soTien; nvStats[nId].thu += soTien; }
            }
          }
        });

        const allMKsForCalc = [...new Set([...Object.keys(bMon), ...Object.keys(debtByMon)])]
          .filter(m => m !== "N/A")
          .sort((a, b) => sortM(a).localeCompare(sortM(b)));

        let runningDebt = 0;
        const monStats = {};
        allMKsForCalc.forEach(m => {
          const s = bMon[m] ? bMon[m].s : 0;
          const c = bMon[m] ? bMon[m].c : 0;
          const chi = debtByMon[m] ? debtByMon[m].chi : 0;
          const thu = debtByMon[m] ? debtByMon[m].thu : 0;
          const rong = chi - thu;
          runningDebt += rong;
          monStats[m] = { s, c, chi, thu, rong, luyKe: runningDebt };
        });

        let displayMonKs = allMKsForCalc;
        if (fT) {
          const fTm = fT.split("-").reverse().join("/");
          displayMonKs = displayMonKs.filter(m => m === fTm);
        }

        let totalIncurred = 0;
        let totalCollected = 0;
        displayMonKs.forEach(m => {
          totalIncurred += monStats[m].chi;
          totalCollected += monStats[m].thu;
        });
        document.getElementById("dTotalChi").textContent = money(totalIncurred);
        document.getElementById("dTotalThu").textContent = money(totalCollected);
        document.getElementById("dTotalRem").textContent = money(totalIncurred - totalCollected);

        displayMonKs.sort((a, b) => sortM(b).localeCompare(sortM(a)));

        document.getElementById("dTMonth").innerHTML = displayMonKs.length ? displayMonKs.map(k => {
          const st = monStats[k];
          return `<tr>
            <td class="mono">${k}</td>
            <td style="text-align:right;color:var(--text-main);font-weight:600">${money(st.s)}</td>
            <td style="text-align:right">${st.c}</td>
            <td style="text-align:right;color:#ef4444">${money(st.chi)}</td>
            <td style="text-align:right;color:#16a34a">${money(st.thu)}</td>
            <td style="text-align:right;color:${st.rong > 0 ? '#ef4444' : (st.rong < 0 ? '#16a34a' : 'inherit')}">${money(st.rong)}</td>
            <td style="text-align:right;font-weight:bold;color:${st.luyKe > 0 ? '#ef4444' : (st.luyKe < 0 ? '#16a34a' : 'inherit')}">${money(st.luyKe)}</td>
          </tr>`;
        }).join("") : '<tr><td colspan="7" class="empty">Trống</td></tr>';

        if (salesChartMonth) salesChartMonth.destroy();
        salesChartMonth = new Chart(document.getElementById('cMonth'), {
          type: 'bar', data: { labels: displayMonKs.slice().reverse(), datasets: [{ data: displayMonKs.slice().reverse().map(k => monStats[k].s), backgroundColor: '#2d5bff', borderRadius: 4 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        const sortStats = (obj, a, b) => {
          const sa = obj[a].s || 0; const sb = obj[b].s || 0;
          if (sb !== sa) return sb - sa;
          return (obj[b].luyKe || 0) - (obj[a].luyKe || 0);
        };
        const buildRowHTML = (k, name, st) => `<tr>
           <td class="mono">${k}</td>
           <td>${safeText(name)}</td>
           <td style="text-align:right;color:var(--text-main);font-weight:600">${money(st.s)}</td>
           <td style="text-align:right">${st.c}</td>
           <td style="text-align:right;color:#ef4444">${money(st.chi)}</td>
           <td style="text-align:right;color:#16a34a">${money(st.thu)}</td>
           <td style="text-align:right;color:${(st.chi - st.thu) > 0 ? '#ef4444' : ((st.chi - st.thu) < 0 ? '#16a34a' : 'inherit')}">${money(st.chi - st.thu)}</td>
           <td style="text-align:right;font-weight:bold;color:${st.luyKe > 0 ? '#ef4444' : (st.luyKe < 0 ? '#16a34a' : 'inherit')}">${money(st.luyKe)}</td>
        </tr>`;

        const sortStatsNV = (a, b) => {
          const sa = nvStats[a].s || 0; const sb = nvStats[b].s || 0;
          if (sb !== sa) return sb - sa;
          return (nvStats[b].luyKe || 0) - (nvStats[a].luyKe || 0);
        };

        const buildNvRowHTML = (k, st) => {
          const name = getNvN(k);
          let ratioCM = st.chiCM > 0 ? (st.thuCM / st.chiCM) * 100 : 0;
          let ratioLM = st.chiLM > 0 ? (st.thuCM / st.chiLM) * 100 : 0;
          let hideCM = false, hideLM = false;

          const listLastMonth = ["Ngô Tuấn Anh", "Vũ Công Tâm"];
          const listThisMonth = ["Trần Doãn Sáng", "Đoàn Văn Quang"];

          if (listLastMonth.includes(name) || listLastMonth.includes(k)) {
            ratioCM = 0; hideCM = true;
          } else if (listThisMonth.includes(name) || listThisMonth.includes(k)) {
            ratioLM = 0; hideLM = true;
          }

          return `<tr>
             <td class="mono">${safeText(k)}</td>
             <td style="text-align:right;color:var(--text-main);font-weight:600">${money(st.s)}</td>
             <td style="text-align:right;color:#ef4444">${money(st.chi)}</td>
             <td style="text-align:right;color:#16a34a">${money(st.thu)}</td>
             <td style="text-align:right;color:${(st.chi - st.thu) > 0 ? '#ef4444' : ((st.chi - st.thu) < 0 ? '#16a34a' : 'inherit')}">${money(st.chi - st.thu)}</td>
             <td style="text-align:right;font-weight:bold;color:${st.luyKe > 0 ? '#ef4444' : (st.luyKe < 0 ? '#16a34a' : 'inherit')}">${money(st.luyKe)}</td>
             <td style="text-align:right;font-weight:600;color:${ratioCM >= 100 ? '#16a34a' : '#f59e0b'}">${hideCM ? '' : ratioCM.toFixed(1) + '%'}</td>
             <td style="text-align:right;font-weight:600;color:${ratioLM >= 100 ? '#16a34a' : '#f59e0b'}">${hideLM ? '' : ratioLM.toFixed(1) + '%'}</td>
          </tr>`;
        };

        const nKs = Object.keys(nvStats).sort(sortStatsNV).filter(k => k !== "N/A" || nvStats[k].s > 0 || nvStats[k].chi > 0 || nvStats[k].thu > 0);
        document.getElementById("dTNv").innerHTML = nKs.map(k => buildNvRowHTML(k, nvStats[k])).join("") || '<tr class="empty"><td colspan="8">Trống</td></tr>';

        const kKs = Object.keys(khStats).sort((a, b) => sortStats(khStats, a, b)).filter(k => k !== "N/A" || khStats[k].s > 0 || khStats[k].luyKe !== 0);
        const khTotalRows = kKs.length;
        const khTotalPages = Math.ceil(khTotalRows / khPageSize) || 1;
        if (khCurrentPage > khTotalPages) khCurrentPage = khTotalPages;
        const khStartIdx = (khCurrentPage - 1) * khPageSize;
        const khPageRows = kKs.slice(khStartIdx, khStartIdx + khPageSize);
        document.getElementById("dTKh").innerHTML = khPageRows.map(k => buildRowHTML(k, getCustomerName(k), khStats[k])).join("") || '<tr class="empty"><td colspan="8">Trống</td></tr>';

        const khPager = document.getElementById("dTKhPagination");
        if (khTotalRows <= khPageSize) {
          khPager.innerHTML = `<span style="font-size:13px; color:var(--muted)">Hiển thị ${khTotalRows} khách hàng.</span>`;
        } else {
          let pagerHtml = `<span style="font-size:13px; color:var(--muted)">Trang ${khCurrentPage} / ${khTotalPages} (Tổng ${khTotalRows} khách hàng)</span><div class="pager">`;
          pagerHtml += `<div class="page-box ${khCurrentPage === 1 ? 'disabled' : ''}" onclick="${khCurrentPage > 1 ? `window.setSalesCustomerPage(${khCurrentPage - 1})` : ''}">‹</div>`;
          for (let p = 1; p <= khTotalPages; p++) {
            if (p === 1 || p === khTotalPages || (p >= khCurrentPage - 2 && p <= khCurrentPage + 2)) {
              pagerHtml += `<div class="page-box ${p === khCurrentPage ? 'active' : ''}" onclick="window.setSalesCustomerPage(${p})">${p}</div>`;
            } else if (p === khCurrentPage - 3 || p === khCurrentPage + 3) {
              pagerHtml += `<div class="page-box-dots">...</div>`;
            }
          }
          pagerHtml += `<div class="page-box ${khCurrentPage === khTotalPages ? 'disabled' : ''}" onclick="${khCurrentPage < khTotalPages ? `window.setSalesCustomerPage(${khCurrentPage + 1})` : ''}">›</div>`;
          pagerHtml += `</div>`;
          khPager.innerHTML = pagerHtml;
        }


        const bNcc = {};
        const validOrderIds = new Set(data.map(d => d.id));
        appState.DH_CT.forEach(detail => {
          if (!validOrderIds.has(detail.id_dh)) return;
          const nccName = detail.ncc || "N/A";
          if (!bNcc[nccName]) bNcc[nccName] = { s: 0 };
          bNcc[nccName].s += Number(detail.thanh_tien || 0);
        });
        const nccKs = Object.keys(bNcc).sort((a, b) => bNcc[b].s - bNcc[a].s);
        document.getElementById("dTNcc").innerHTML = nccKs.map(k => `<tr><td>${safeText(k)}</td><td style="text-align:right;color:#0f172a"><strong>${money(bNcc[k].s)}</strong></td></tr>`).join("") || '<tr class="empty"><td colspan="2">Trống</td></tr>';
      };

      const resetCustomerPageAndDraw = () => { khCurrentPage = 1; draw(); };
      window.setSalesCustomerPage = (page) => { khCurrentPage = page; draw(); };
      msNv = setupMultiSelect("dashNvBtn", "dashNvMenu", "dashNvList", "dashNvSearch", "dashNvAll", "dashNvClear", nvArr, resetCustomerPageAndDraw, "ID Nhân viên");
      msKh = setupMultiSelect("dashKhBtn", "dashKhMenu", "dashKhList", "dashKhSearch", "dashKhAll", "dashKhClear", khArr, resetCustomerPageAndDraw, "ID Khách hàng");

      document.getElementById("dashTime").addEventListener("change", resetCustomerPageAndDraw);
      document.getElementById("dashTimeClr").addEventListener("click", () => { document.getElementById("dashTime").value = ""; resetCustomerPageAndDraw(); });

      if (typeof Chart === 'undefined') {
        const s = document.createElement('script'); s.src = "https://cdn.jsdelivr.net/npm/chart.js";
        s.onload = () => { draw(); setupSalesDashboardStickyFilter(); };
        document.head.appendChild(s);
      } else {
        draw();
        setupSalesDashboardStickyFilter();
      }
    }

    function setupSalesDashboardStickyFilter() {
      if (salesDashStickyHandler) window.removeEventListener("scroll", salesDashStickyHandler);
      if (salesDashStickyResizeHandler) window.removeEventListener("resize", salesDashStickyResizeHandler);

      const wrap = document.getElementById("salesDashFilterWrap");
      const filter = document.getElementById("salesDashFilter");
      const section = document.getElementById("sales_dashboard");
      if (!wrap || !filter || !section) return;

      const sync = () => {
        if (activeTab !== "sales_dashboard") {
          filter.classList.remove("is-fixed");
          filter.style.top = "";
          filter.style.left = "";
          filter.style.width = "";
          wrap.style.minHeight = "";
          return;
        }

        const topbar = document.querySelector(".topbar");
        const topOffset = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 0;
        const wrapRect = wrap.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const filterHeight = filter.offsetHeight;
        wrap.style.minHeight = filterHeight + "px";

        const shouldFix = wrapRect.top <= topOffset && sectionRect.bottom > (topOffset + filterHeight + 16);
        if (shouldFix) {
          filter.classList.add("is-fixed");
          filter.style.top = topOffset + "px";
          filter.style.left = wrapRect.left + "px";
          filter.style.width = wrapRect.width + "px";
        } else {
          filter.classList.remove("is-fixed");
          filter.style.top = "";
          filter.style.left = "";
          filter.style.width = "";
        }
      };

      salesDashStickyHandler = sync;
      salesDashStickyResizeHandler = sync;
      window.addEventListener("scroll", salesDashStickyHandler, { passive: true });
      window.addEventListener("resize", salesDashStickyResizeHandler);
      window.updateSalesDashSticky = sync;
      requestAnimationFrame(sync);
    }
    function getCustomerStats(customerId) {
      const banHang = appState.CONG_NO.filter(c => c.id_khach_hang === customerId && c.thu_chi === "chi").reduce((s, c) => s + Number(c.so_tien || 0), 0);
      const thuNo = appState.CONG_NO.filter(c => c.id_khach_hang === customerId && c.thu_chi === "thu").reduce((s, c) => s + Number(c.so_tien || 0), 0);
      const congNo = banHang - thuNo;
      return { banHang, thuNo, congNo };
    }

    function renderCustomers() {
      const nvList = [...new Set(appState.KHACH_HANG.map(c => c.nv_quan_ly).filter(Boolean))];
      document.getElementById("customers").innerHTML = `
        <div class="card panel">
          <div class="toolbar" style="align-items:flex-end">
            <div><h2>Khách hàng</h2><p class="subtle">Sheet KHACH_HANG — Sắp xếp theo công nợ giảm dần.</p></div>
          </div>
          <div class="toolbar sticky-filter" style="border-bottom: none;">
            <div class="toolbar-search" style="flex-wrap:wrap; align-items:center;">
              <input type="text" id="custSearch" placeholder="Tìm tên, điện thoại, email..." style="min-width:200px" />
              
              <div class="dropdown-search" id="custNvBox" style="min-width:180px; position:relative;">
                <input type="text" id="custNvFilter" placeholder="NV quản lý: Gõ để tìm..." autocomplete="off" style="padding-right:24px;" />
                <span id="custNvClear" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:16px; cursor:pointer; color:#999; display:none;">&times;</span>
                <div class="dropdown-menu" id="custNvMenu" style="max-height:220px;"></div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              ${canManageData() ? '<button class="btn btn-primary" type="button" id="addCustomerBtn" style="padding: 0 12px; font-size: 20px; border-radius: 8px; height: 32px; display: flex; align-items: center; justify-content: center;" title="Thêm khách hàng">+</button>' : ""}
              <button class="btn btn-secondary" type="button" id="resetCustFilterBtn">Bỏ lọc</button>
            </div>
          </div>
          <div class="table-wrap">
          <style>
             tbody tr[data-action="view-customer"]:hover{background:var(--brand-soft)} .row-debt-high{background:#fff1f1} .badge-status{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700} .bs-paid{background:#dcfce7;color:#16a34a} .bs-owe{background:#fee2e2;color:#ef4444} .bs-credit{background:#e0f2fe;color:#0284c7}
             .dropdown-search { position:relative; }
             .dropdown-search input { width:100%; border:1px solid var(--line); padding:8px 10px; border-radius:8px; font-size:13px; }
             .dropdown-menu { position:absolute; top:calc(100% + 4px); left:0; min-width:100%; background:#fff; border:1px solid var(--line); border-radius:8px; overflow-y:auto; z-index:10; display:none; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
             .dropdown-menu.show { display:block; }
             .dropdown-item { padding:8px 12px; cursor:pointer; font-size:13px; white-space:nowrap; }
             .dropdown-item:hover { background:var(--brand-soft); }
          </style>
          <table><thead><tr><th>ID</th><th>Tên KH</th><th>Điện thoại</th><th>Email</th><th>NV quản lý</th><th title="KÊNH">KÊNH</th><th title="Tỷ trọng mục tiêu">TT</th><th>Tiền bán hàng</th><th>Tiền thu nợ</th><th>Công nợ</th><th>Trạng thái</th></tr></thead>
          <tbody id="custTableBody"></tbody></table></div></div>`;

      const tbody = document.getElementById("custTableBody");
      const renderFiltered = () => {
        const q = (document.getElementById("custSearch").value || "").toLowerCase();
        const nv = (document.getElementById("custNvFilter").value || "").toLowerCase();
        const rows = appState.KHACH_HANG
          .filter(item => {
            if (nv && !(item.nv_quan_ly || "").toLowerCase().includes(nv)) return false;
            if (q && ![item.ten_kh, item.dien_thoai, item.email].join(" ").toLowerCase().includes(q)) return false;
            return true;
          })
          .map(item => ({ ...item, _stats: getCustomerStats(item.id) }))
          .sort((a, b) => b._stats.congNo - a._stats.congNo);

        if (!rows.length) { tbody.innerHTML = '<tr><td colspan="9" class="empty">Không tìm thấy khách hàng phù hợp.</td></tr>'; return; }
        tbody.innerHTML = rows.map(item => {
          const { banHang, thuNo, congNo } = item._stats;
          const highDebt = congNo > 10000000;
          const badge = congNo === 0 ? '<span class="badge-status bs-paid">Đã TT</span>' : congNo > 0 ? '<span class="badge-status bs-owe">Còn nợ</span>' : '<span class="badge-status bs-credit">Dư tiền</span>';
          return `<tr data-action="view-customer" data-id="${safeText(item.id)}" class="${highDebt ? 'row-debt-high' : ''}" style="cursor:pointer" ondblclick="openCustomerDrawer('${safeText(item.id)}')"><td class="mono">${safeText(item.id)}</td><td style="${highDebt ? 'color:#dc2626;font-weight:700' : ''}">${safeText(item.ten_kh)}</td><td>${safeText(item.dien_thoai || "")}</td><td>${safeText(item.email || "")}</td><td>${safeText(item.nv_quan_ly || "")}</td><td style="font-weight:600">${safeText(item.kenh || "")}</td><td style="font-weight:600; text-align:center">${safeText(item.tt || "")}</td><td>${money(banHang)}</td><td>${money(thuNo)}</td><td><strong style="color:${congNo > 0 ? '#ef4444' : congNo < 0 ? '#0284c7' : '#16a34a'}">${money(congNo)}</strong></td><td>${badge}</td></tr>`;
        }).join("");
      };

      const nvInput = document.getElementById("custNvFilter");
      const nvMenu = document.getElementById("custNvMenu");
      const nvClear = document.getElementById("custNvClear");

      const renderNvList = (query) => {
        const q = query.toLowerCase();
        const matches = nvList.filter(nv => nv.toLowerCase().includes(q));
        nvMenu.innerHTML = matches.map(nv => `<div class="dropdown-item" data-nv="${safeText(nv)}">${safeText(nv)}</div>`).join("");
        if (!matches.length) nvMenu.innerHTML = '<div style="padding:10px; color:#aaa; font-size:12px">Không tìm thấy nhân viên.</div>';
        nvMenu.querySelectorAll('.dropdown-item').forEach(el => {
          el.onclick = () => {
            nvInput.value = el.dataset.nv;
            nvMenu.classList.remove("show");
            nvClear.style.display = "block";
            renderFiltered();
          };
        });
      };

      nvInput.addEventListener("focus", () => { renderNvList(nvInput.value); nvMenu.classList.add("show"); });
      nvInput.addEventListener("input", (e) => {
        renderNvList(e.target.value);
        nvMenu.classList.add("show");
        nvClear.style.display = e.target.value ? "block" : "none";
        renderFiltered();
      });

      nvClear.addEventListener("click", () => {
        nvInput.value = "";
        nvClear.style.display = "none";
        nvMenu.classList.remove("show");
        renderFiltered();
      });

      document.addEventListener("click", (e) => { if (!document.getElementById("custNvBox").contains(e.target)) nvMenu.classList.remove("show"); });

      document.getElementById("custSearch").addEventListener("input", renderFiltered);
      document.getElementById("resetCustFilterBtn").addEventListener("click", () => {
        document.getElementById("custSearch").value = "";
        nvInput.value = "";
        nvClear.style.display = "none";
        nvMenu.classList.remove("show");
        renderFiltered();
      });
      document.getElementById("addCustomerBtn")?.addEventListener("click", () => openCustomerFormDrawer(""));
      renderFiltered();
    }

    function openCustomerDrawer(customerId) {
      const item = appState.KHACH_HANG.find((row) => row.id === customerId);
      if (!item) return;
      const { banHang, thuNo, congNo } = getCustomerStats(item.id);
      const orders = appState.DH.filter(o => o.npp === customerId && (!o.nhap_xuat || String(o.nhap_xuat).toLowerCase() === "xuat"));
      const payments = appState.CONG_NO.filter(c => c.id_khach_hang === customerId).sort((a, b) => parseDateSort(b.ngay).localeCompare(parseDateSort(a.ngay)));
      const statusBadge = congNo === 0 ? '<span class="badge-status bs-paid">Đã thanh toán</span>' : congNo > 0 ? '<span class="badge-status bs-owe">Còn nợ</span>' : '<span class="badge-status bs-credit">Dư tiền</span>';
      openDrawer("Chi tiết Khách hàng", `${safeText(item.ten_kh)} — ${safeText(item.dien_thoai || "")}`, `
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <div class="field"><label>ID</label><input value="${safeText(item.id)}" readonly style="background:var(--soft)"/></div>
            <div class="field"><label>Tên khách hàng</label><input value="${safeText(item.ten_kh || "")}" readonly style="background:var(--soft)"/></div>
            <div class="field"><label>Điện thoại</label><input value="${safeText(item.dien_thoai || "")}" readonly style="background:var(--soft)"/></div>
            <div class="field"><label>Email</label><input value="${safeText(item.email || "")}" readonly style="background:var(--soft)"/></div>
            <div class="field"><label>NV quản lý</label><input value="${safeText(item.nv_quan_ly || "")}" readonly style="background:var(--soft)"/></div>
            <div class="field"><label>Kênh</label><input value="${safeText(item.kenh || "")}" readonly style="background:var(--soft)"/></div>
            <div class="field"><label>TT (Tỉ trọng mục tiêu)</label><input value="${safeText(item.tt || "")}" readonly style="background:var(--soft)"/></div>
            <div class="field full"><label>Địa chỉ</label><textarea readonly style="background:var(--soft); min-height:60px;">${safeText(item.dia_chi || "")}</textarea></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            <div style="background:#f0fdf4;border-radius:10px;padding:12px;text-align:center"><small style="color:#16a34a;font-weight:600">TIỀN BÁN HÀNG</small><br/><strong style="font-size:15px">${money(banHang)}</strong></div>
            <div style="background:#e0f2fe;border-radius:10px;padding:12px;text-align:center"><small style="color:#0284c7;font-weight:600">TIỀN THU NỢ</small><br/><strong style="font-size:15px">${money(thuNo)}</strong></div>
            <div style="background:${congNo > 0 ? '#fff1f1' : congNo < 0 ? '#e0f2fe' : '#f0fdf4'};border-radius:10px;padding:12px;text-align:center"><small style="color:${congNo > 0 ? '#ef4444' : congNo < 0 ? '#0284c7' : '#16a34a'};font-weight:600">CÔNG NỢ</small><br/><strong style="font-size:15px;color:${congNo > 0 ? '#ef4444' : congNo < 0 ? '#0284c7' : '#16a34a'}">${money(congNo)}</strong></div>
          </div>
          <div style="text-align:right">${statusBadge}</div>
          ${canManageData() ? `<div class="button-row full"><button class="btn btn-secondary" onclick="openCustomerFormDrawer('${safeText(item.id)}')">Sửa khách hàng</button></div>` : ""}
          <div>
            <h4 style="margin:0 0 6px; font-size:13px; color:var(--muted)">DANH SÁCH ĐƠN HÀNG (${orders.length})</h4>
            <div style="overflow-x:auto"><table style="width:100%;font-size:12px"><thead><tr><th>ID ĐƠN</th><th>Ngày</th><th>Thành tiền</th></tr></thead><tbody>
              ${orders.length ? orders.map(o => `<tr><td class="mono">${safeText(o.id)}</td><td>${safeText(formatDateVi(o.ngay))}</td><td><strong>${money(o.thanh_tien)}</strong></td></tr>`).join("") : '<tr><td colspan="3" class="empty">Chưa có đơn hàng.</td></tr>'}
            </tbody></table></div>
          </div>
          <div>
            <h4 style="margin:0 0 6px; font-size:13px; color:var(--muted)">LỊCH SỬ THU NỢ (${payments.length})</h4>
            <div style="overflow-x:auto"><table style="width:100%;font-size:12px"><thead><tr><th>Ngày</th><th>Loại</th><th>Số tiền</th></tr></thead><tbody>
              ${payments.length ? payments.map(p => `<tr><td>${safeText(formatDateVi(p.ngay))}</td><td><span class="badge ${p.thu_chi === 'thu' ? 'badge-thu' : 'badge-chi'}">${p.thu_chi === 'thu' ? 'Thu' : 'Chi'}</span></td><td><span style="color:${p.thu_chi === 'thu' ? '#16a34a' : '#ef4444'}">${p.thu_chi === 'thu' ? '-' : '+'}${money(p.so_tien)}</span></td></tr>`).join("") : '<tr><td colspan="3" class="empty">Chưa có giao dịch.</td></tr>'}
            </tbody></table></div>
          </div>
        </div>`);
    }

    function openCustomerFormDrawer(customerId = "") {
      if (!requireAdminAccess("Chỉ admin mới được thêm hoặc sửa khách hàng.")) return;
      const item = appState.KHACH_HANG.find((row) => row.id === customerId) || {};

      openDrawer(customerId ? "Sửa Khách hàng" : "Thêm Khách hàng", "Cập nhật dữ liệu vào Sheet KHACH_HANG.", `
        <form id="customerForm" style="display:flex; flex-direction:column; gap:8px;">
          <div class="field"><label>ID</label><input name="id" value="${safeText(item.id || randomId("KH"))}" ${customerId ? "readonly" : ""} required /></div>
          <div class="field full"><label>Tên khách hàng</label><input name="ten_kh" value="${safeText(item.ten_kh || "")}" required /></div>
          <div class="field"><label>Điện thoại</label><input name="dien_thoai" value="${safeText(item.dien_thoai || "")}" /></div>
          <div class="field"><label>Email</label><input name="email" type="email" value="${safeText(item.email || "")}" /></div>
          <div class="field full"><label>Địa chỉ</label><textarea name="dia_chi" style="min-height:70px;">${safeText(item.dia_chi || "")}</textarea></div>
          <div class="field"><label>NV quản lý</label><input name="nv_quan_ly" value="${safeText(item.nv_quan_ly || currentUser?.id || "")}" /></div>
          <div class="field"><label>Kênh</label><input name="kenh" value="${safeText(item.kenh || "")}" /></div>
          <div class="field"><label>TT</label><input name="tt" value="${safeText(item.tt || "")}" /></div>
          <div class="button-row full" style="margin-top:12px"><button class="btn btn-primary" type="submit" style="width:100%">Lưu Khách hàng</button></div>
        </form>`);

      document.getElementById("customerForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        const record = {
          id: String(data.id || "").trim(),
          ten_kh: String(data.ten_kh || "").trim(),
          dien_thoai: String(data.dien_thoai || "").trim(),
          email: String(data.email || "").trim(),
          dia_chi: String(data.dia_chi || "").trim(),
          ngay_cap_nhat: todayInput(),
          nv_quan_ly: String(data.nv_quan_ly || "").trim(),
          kenh: String(data.kenh || "").trim(),
          tt: String(data.tt || "").trim()
        };
        if (!record.id || !record.ten_kh) return alert("Vui lòng nhập ID và Tên khách hàng.");

        const index = appState.KHACH_HANG.findIndex((row) => row.id === record.id);
        const isNew = index < 0;
        if (isNew) appState.KHACH_HANG.push(record);
        else appState.KHACH_HANG[index] = Object.assign({}, appState.KHACH_HANG[index], record);

        try {
          if (isNew) {
            const rowValues = objectsToRows([record], CONFIG.sheets.KHACH_HANG)[1];
            await appendSheetRow("KHACH_HANG", [rowValues]);
            syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
            renderAll();
            showToast("Đã thêm khách hàng mới.");
          } else {
            await clearSheet("KHACH_HANG");
            await updateSheet("KHACH_HANG", objectsToRows(appState.KHACH_HANG, CONFIG.sheets.KHACH_HANG));
            syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
            renderAll();
            showToast("Đã cập nhật khách hàng.");
          }
        } catch (error) {
          console.error(error);
          await persistAllSheets("Đã lưu dữ liệu.");
        }
        closeDrawer();
      });
    }

    function renderProducts() {
      const nccList = [...new Set(appState.DS_SP.map(p => p.ncc).filter(Boolean))];

      document.getElementById("products").innerHTML = `
        <div class="card panel">
          <div class="toolbar" style="align-items:flex-end">
             <div><h2>Sản phẩm</h2><p class="subtle">Sheet DS_SP: id, ten_sp, model, ncc, gia_ban.</p></div>
          </div>
          <div class="toolbar sticky-filter" style="border-bottom: none;">
            <div class="toolbar-search" style="flex-wrap:wrap; align-items:center; flex:1">
              <input type="text" id="prodSearch" placeholder="Tìm tên, model, id, ncc, thông số..." style="min-width:300px;" />
              
              <div class="dropdown-search" id="prodNccBox" style="min-width:200px; position:relative;">
                <input type="text" id="prodNccFilter" placeholder="NCC: Gõ để tìm..." autocomplete="off" style="padding-right:24px;" />
                <span id="prodNccClear" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:16px; cursor:pointer; color:#999; display:none; z-index:2;">&times;</span>
                <div class="dropdown-menu" id="prodNccMenu" style="max-height:220px;"></div>
              </div>
              <button class="btn btn-primary" type="button" id="addProdBtn" style="padding: 0 12px; font-size: 20px; border-radius: 8px; height: 32px; display: flex; align-items: center; justify-content: center;" title="Thêm tay sản phẩm" onclick="openProductFormDrawer('')">+</button>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span id="prodCount" style="font-size:13px; font-weight:600; color:var(--brand)"></span>
              <button class="btn btn-secondary" type="button" id="resetProdFilterBtn">Bỏ lọc</button>
            </div>
          </div>
          <div class="table-wrap">
          <style>
             tbody tr[data-action="view-product"]:hover{background:var(--brand-soft)}
             .dropdown-search { position:relative; }
             .dropdown-search input { width:100%; border:1px solid var(--line); padding:6px 10px; border-radius:6px; font-size:13px; height: 32px;}
             .dropdown-menu { position:absolute; top:calc(100% + 4px); left:0; min-width:100%; background:#fff; border:1px solid var(--line); border-radius:8px; overflow-y:auto; z-index:10; display:none; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
             .dropdown-menu.show { display:block; }
             .dropdown-item { padding:8px 12px; cursor:pointer; font-size:13px; white-space:nowrap; }
             .dropdown-item:hover { background:var(--brand-soft); }
             mark { background: #fef08a; color: #854d0e; padding: 0 2px; border-radius: 2px; }
          </style>
          <table><thead><tr>
             <th style="cursor:pointer; user-select:none;" onclick="sortProducts('id')">ID <span id="sort-sp-id"></span></th>
             <th style="cursor:pointer; user-select:none;" onclick="sortProducts('ten_sp')">Tên SP <span id="sort-sp-ten_sp"></span></th>
             <th style="cursor:pointer; user-select:none;" onclick="sortProducts('model')">Model <span id="sort-sp-model"></span></th>
             <th style="cursor:pointer; user-select:none;" onclick="sortProducts('ncc')">NCC <span id="sort-sp-ncc"></span></th>
             <th style="cursor:pointer; user-select:none; text-align:right" onclick="sortProducts('gia_ban')">Giá bán <span id="sort-sp-gia_ban"></span></th>
          </tr></thead>
          <tbody id="prodTableBody"></tbody></table></div></div>`;

      const tbody = document.getElementById("prodTableBody");
      const countLabel = document.getElementById("prodCount");

      window.prodSortCol = window.prodSortCol || "";
      window.prodSortAsc = window.prodSortAsc !== undefined ? window.prodSortAsc : true;
      window.sortProducts = (col) => {
        if (window.prodSortCol === col) window.prodSortAsc = !window.prodSortAsc;
        else { window.prodSortCol = col; window.prodSortAsc = true; }
        renderFiltered();
      };
      const highlight = (text, q) => {
        const str = String(text || "");
        if (!q || !str) return safeText(str);
        const regex = new RegExp(`(${q.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&')})`, "gi");
        return safeText(str).replace(regex, '<mark>$1</mark>');
      };

      const renderFiltered = () => {
        const qRaw = document.getElementById("prodSearch").value || "";
        const q = qRaw.toLowerCase();
        const ncc = (document.getElementById("prodNccFilter").value || "").toLowerCase();

        const rows = appState.DS_SP.filter(item => {
          if (ncc && !(item.ncc || "").toLowerCase().includes(ncc)) return false;
          if (q && ![item.ten_sp, item.model, item.id, item.ncc, item.thong_so].join(" ").toLowerCase().includes(q)) return false;
          return true;
        });

        if (window.prodSortCol) {
          rows.sort((a, b) => {
            let start = a[window.prodSortCol]; let end = b[window.prodSortCol];
            if (window.prodSortCol === 'gia_ban') { start = Number(start || 0); end = Number(end || 0); }
            else { start = String(start || "").toLowerCase(); end = String(end || "").toLowerCase(); }
            if (start < end) return window.prodSortAsc ? -1 : 1;
            if (start > end) return window.prodSortAsc ? 1 : -1;
            return 0;
          });
        }
        ['id', 'ten_sp', 'model', 'ncc', 'gia_ban'].forEach(col => {
          const el = document.getElementById('sort-sp-' + col);
          if (el) el.innerHTML = window.prodSortCol === col ? (window.prodSortAsc ? '▲' : '▼') : '';
        });

        countLabel.textContent = `Hiển thị: ${rows.length} sản phẩm`;
        if (!rows.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty">Không tìm thấy sản phẩm.</td></tr>'; return; }

        const renderRows = rows.slice(0, 150); // Mượt mà cho 10.000 data
        tbody.innerHTML = renderRows.map(item => {
          return `<tr data-action="view-product" data-id="${safeText(item.id)}" style="cursor: pointer;" ondblclick="openProductDrawer('${safeText(item.id)}')">
             <td class="mono">${highlight(item.id, qRaw)}</td>
             <td style="font-weight:600; color:var(--text-main)">${highlight(item.ten_sp, qRaw)}</td>
             <td>${highlight(item.model, qRaw)}</td>
             <td>${highlight(item.ncc, qRaw)}</td>
             <td><strong style="color:var(--brand)">${money(item.gia_ban)}</strong></td>
           </tr>`;
        }).join("");

        if (rows.length > 150) tbody.innerHTML += `<tr><td colspan="5" style="text-align:center; padding:12px; color:var(--muted); font-size:13px; background:#f9fafb;">... và <strong>${rows.length - 150}</strong> sản phẩm khác (Hãy lọc chi tiết hơn)</td></tr>`;
      };

      const nccInput = document.getElementById("prodNccFilter");
      const nccMenu = document.getElementById("prodNccMenu");
      const nccClear = document.getElementById("prodNccClear");

      const renderNccList = (query) => {
        const q = query.toLowerCase();
        const matches = nccList.filter(n => n.toLowerCase().includes(q));
        nccMenu.innerHTML = matches.map(n => `<div class="dropdown-item" data-val="${safeText(n)}">${safeText(n)}</div>`).join("");
        if (!matches.length) nccMenu.innerHTML = '<div style="padding:10px; color:#aaa; font-size:12px">Không tìm thấy NCC.</div>';

        nccMenu.querySelectorAll('.dropdown-item').forEach(el => {
          el.onclick = () => {
            nccInput.value = el.dataset.val;
            nccMenu.classList.remove("show");
            nccClear.style.display = "block";
            renderFiltered();
          };
        });
      };

      nccInput.addEventListener("focus", () => { renderNccList(nccInput.value); nccMenu.classList.add("show"); });
      nccInput.addEventListener("input", (e) => {
        renderNccList(e.target.value);
        nccMenu.classList.add("show");
        nccClear.style.display = e.target.value ? "block" : "none";
        renderFiltered();
      });

      nccClear.addEventListener("click", () => {
        nccInput.value = "";
        nccClear.style.display = "none";
        nccMenu.classList.remove("show");
        renderFiltered();
      });

      document.addEventListener("click", (e) => { if (!document.getElementById("prodNccBox").contains(e.target)) nccMenu.classList.remove("show"); });
      document.getElementById("prodSearch").addEventListener("input", renderFiltered);
      document.getElementById("resetProdFilterBtn").addEventListener("click", () => {
        document.getElementById("prodSearch").value = "";
        nccInput.value = "";
        nccClear.style.display = "none";
        nccMenu.classList.remove("show");
        renderFiltered();
      });
      renderFiltered();
    }

    function openProductDrawer(productId) {
      const item = appState.DS_SP.find((row) => row.id === productId);
      if (!item) return;
      openDrawer("Chi tiết Sản phẩm", "Chỉ xem thông tin sản phẩm.", `
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div class="field"><label>ID</label><input value="${safeText(item.id)}" readonly style="background:var(--soft)"/></div>
          <div class="field"><label>Tên sản phẩm</label><input value="${safeText(item.ten_sp || "")}" readonly style="background:var(--soft)"/></div>
          <div class="field"><label>Model</label><input value="${safeText(item.model || "")}" readonly style="background:var(--soft)"/></div>
          <div class="field"><label>NCC (Nhà cung cấp)</label><input value="${safeText(item.ncc || "")}" readonly style="background:var(--soft)"/></div>
          <div class="field full"><label>Giá bán</label><input value="${money(item.gia_ban || 0)}" readonly style="background:var(--brand-soft); font-weight:800; color:var(--brand); font-size:16px"/></div>
          ${canManageData() ? `<div class="button-row full" style="margin-top:12px"><button class="btn btn-secondary" onclick="openProductFormDrawer('${safeText(item.id)}')">Sửa sản phẩm</button></div>` : ""}
        </div>`);
    }

    function openProductFormDrawer(productId = "") {
      if (!requireAdminAccess("Chỉ admin mới được thêm hoặc sửa sản phẩm.")) return;
      const item = appState.DS_SP.find((row) => row.id === productId) || {};

      openDrawer(productId ? "Sửa Sản phẩm" : "Thêm Sản phẩm", "Cập nhật dữ liệu vào Sheet DS_SP.", `
        <form id="productForm" style="display:flex; flex-direction:column; gap:8px;">
          <div class="field"><label>ID</label><input name="id" value="${safeText(item.id || randomId("SP"))}" ${productId ? "readonly" : ""} required /></div>
          <div class="field full"><label>Tên sản phẩm</label><input name="ten_sp" value="${safeText(item.ten_sp || "")}" required /></div>
          <div class="field"><label>Model</label><input name="model" value="${safeText(item.model || "")}" /></div>
          <div class="field"><label>NCC</label><input name="ncc" value="${safeText(item.ncc || "")}" /></div>
          <div class="field"><label>Giá bán</label><input type="number" name="gia_ban" value="${item.gia_ban || ''}" min="0" required style="font-size: 15px; font-weight: 600; color: var(--brand);" /></div>
          <div class="button-row full" style="margin-top:12px"><button class="btn btn-primary" type="submit" style="width:100%">Lưu Sản phẩm</button></div>
        </form>`);

      document.getElementById("productForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        const record = { id: String(data.id).trim(), ten_sp: String(data.ten_sp).trim(), model: String(data.model || "").trim(), ncc: String(data.ncc || "").trim(), gia_ban: Number(data.gia_ban || 0) };
        const index = appState.DS_SP.findIndex((row) => row.id === record.id);
        const isNew = index < 0;

        if (isNew) appState.DS_SP.push(record);
        else appState.DS_SP[index] = Object.assign({}, appState.DS_SP[index], record);

        try {
          if (isNew) {
            const finalRecord = appState.DS_SP[appState.DS_SP.length - 1];
            const rowValues = objectsToRows([finalRecord], CONFIG.sheets.DS_SP)[1];
            await appendSheetRow("DS_SP", [rowValues]);
            syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
            renderAll();
            showToast("Đã thêm sản phẩm mới.");
          } else {
            await clearSheet("DS_SP");
            await updateSheet("DS_SP", objectsToRows(appState.DS_SP, CONFIG.sheets.DS_SP));
            syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
            renderAll();
            showToast("Đã cập nhật sản phẩm.");
          }
        } catch (error) {
          console.error(error);
          await persistAllSheets("Đã lưu dữ liệu.");
        }
        closeDrawer();
      });
    }

    function exportDashboard(type) {
      const getTblData = (id) => {
        const res = [];
        const rows = document.getElementById(id).querySelectorAll("tr");
        rows.forEach(r => {
          if (r.querySelector(".empty")) return;
          const cells = Array.from(r.querySelectorAll("td")).map(c => `"${c.innerText.trim().replace(/"/g, '""')}"`);
          if (cells.length) res.push(cells.join(","));
        });
        return res;
      };

      let csv = "\ufeff"; // BOM
      csv += "Tháng,Số đơn,Tổng doanh số,Đơn trung bình\n";
      csv += getTblData("dTMonth").join("\n") + "\n\n";
      csv += "Mã NV,Tên nhân viên,Số đơn,Tổng doanh số,Đơn trung bình\n";
      csv += getTblData("dTNv").join("\n") + "\n\n";
      csv += "Mã KH,Tên khách hàng,Số đơn,Tổng doanh số,Đơn trung bình\n";
      csv += getTblData("dTKh").join("\n");

      const blob = new Blob([csv], { type: type === 'excel' ? 'application/vnd.ms-excel;charset=utf-8;' : 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `dashboard_kinh_doanh.${type === 'excel' ? 'xls' : 'csv'}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function getVirtualDebtMap() {
      const ascendingDebts = appState.CONG_NO.slice().sort((a, b) => parseDateSort(a.ngay).localeCompare(parseDateSort(b.ngay)) || String(a.id || "").localeCompare(String(b.id || "")));
      const vRunning = {};
      const virtualDebtMap = {};
      for (const row of ascendingDebts) {
        const customerId = row.id_khach_hang || "";
        const delta = row.thu_chi === "thu" ? -Number(row.so_tien || 0) : Number(row.so_tien || 0);
        vRunning[customerId] = (vRunning[customerId] || 0) + delta;
        virtualDebtMap[row.id] = vRunning[customerId];
      }
      return virtualDebtMap;
    }

    function renderDebts() {
      document.getElementById("debts").innerHTML = `
        <div class="card panel">
          <div class="toolbar" style="align-items:flex-end">
            <div><h2>Công nợ</h2><p class="subtle">Sheet CONG_NO: Quản lý chi tiết Thu/Chi.</p></div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-accent" type="button" id="uploadDebtExcelBtn">+ Tải Excel</button>
              <input type="file" id="debtUploadExcelInput" accept=".xlsx, .xls" style="display:none;" />
              <button class="btn btn-primary" type="button" id="addDebtBtn">Thêm phiếu</button>
            </div>
          </div>
          <div class="toolbar sticky-filter" style="border-bottom: none;">
            <div class="toolbar-search">
              <input type="date" id="debtFilterStart" title="Từ ngày" />
              <input type="date" id="debtFilterEnd" title="Đến ngày" />
              <select id="debtFilterType"><option value="">-- Tất cả phiếu --</option><option value="thu">Phiếu Thu</option><option value="chi">Phiếu Chi</option></select>
              
              <div class="dropdown-search" id="debtCustomerFilterBox" style="min-width:200px; position:relative;">
                <input type="text" id="debtFilterCustomerDisp" placeholder="Lọc Khách hàng: Gõ để tìm..." autocomplete="off" style="padding-right:24px; min-width: 180px;" title="Lọc theo khách hàng" />
                <input type="hidden" id="debtFilterCustomer" value="" />
                <span id="debtFilterCustomerClear" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:16px; cursor:pointer; color:#999; display:none; z-index:2;">&times;</span>
                <div class="dropdown-menu" id="debtFilterCustomerMenu" style="max-height:220px;"></div>
              </div>
            </div>
            <div class="toolbar-right">
              <button class="btn btn-secondary" type="button" id="resetDebtFilterBtn">Bỏ lọc</button>
            </div>
          </div>
          <div class="table-wrap">
          <style>
             tbody tr[data-action="view-debt"]:hover{background:var(--brand-soft)} .badge-thu{background:#dcfce7;color:#16a34a} .badge-chi{background:#fee2e2;color:#ef4444}
             .dropdown-search { position:relative; display:inline-block; }
             .dropdown-search input { width:100%; border:1px solid var(--line); padding:6px 10px; border-radius:6px; font-size:13px; }
             .dropdown-menu { position:absolute; top:calc(100% + 4px); left:0; min-width:100%; background:#fff; border:1px solid var(--line); border-radius:8px; overflow-y:auto; z-index:10; display:none; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
             .dropdown-menu.show { display:block; }
             .dropdown-item { padding:8px 12px; cursor:pointer; font-size:13px; white-space:nowrap; }
             .dropdown-item:hover { background:var(--brand-soft); }
          </style>
          <table><thead><tr><th>ID</th><th>Ngày</th><th>Khách hàng</th><th>ID đơn</th><th>Thu/Chi</th><th>Số tiền</th><th>Công nợ Ảo</th></tr></thead>
          <tbody id="debtsTableBody"></tbody></table></div></div>`;

      if (!canManageData()) {
        document.getElementById("addDebtBtn")?.remove();
        document.getElementById("uploadDebtExcelBtn")?.remove();
        document.getElementById("debtUploadExcelInput")?.remove();
      }

      const tbody = document.getElementById("debtsTableBody");
      const renderFilteredDebts = () => {
        const vMap = getVirtualDebtMap();
        const displayDebts = appState.CONG_NO.slice().sort((a, b) => parseDateSort(b.ngay).localeCompare(parseDateSort(a.ngay)) || String(b.id || "").localeCompare(String(a.id || "")));

        const fStart = document.getElementById("debtFilterStart").value;
        const fEnd = document.getElementById("debtFilterEnd").value;
        const fType = document.getElementById("debtFilterType").value;
        const fCustExact = document.getElementById("debtFilterCustomer").value;
        const fCustText = (document.getElementById("debtFilterCustomerDisp").value || "").toLowerCase();

        const rows = displayDebts.filter(item => {
          if (fType && item.thu_chi !== fType) return false;
          if (fStart && parseDateSort(item.ngay) < parseDateSort(fStart)) return false;
          if (fEnd && parseDateSort(item.ngay) > parseDateSort(fEnd)) return false;

          if (fCustExact) {
            if (item.id_khach_hang !== fCustExact) return false;
          } else if (fCustText) {
            const custName = getCustomerName(item.id_khach_hang).toLowerCase();
            if (!custName.includes(fCustText)) return false;
          }
          return true;
        });

        tbody.innerHTML = rows.length ? rows.map((item) => `<tr data-action="view-debt" data-id="${safeText(item.id)}" style="cursor: pointer;" ondblclick="viewDebtDrawer('${safeText(item.id)}')"><td class="mono">${safeText(item.id)}</td><td>${safeText(formatDateVi(item.ngay))}</td><td>${safeText(getCustomerName(item.id_khach_hang))}</td><td>${safeText(item.id_dh || "")}</td><td><span class="badge ${item.thu_chi === 'thu' ? 'badge-thu' : 'badge-chi'}">${item.thu_chi === 'thu' ? 'Thu' : 'Chi'}</span></td><td><span style="color:${item.thu_chi === 'thu' ? '#16a34a' : '#ef4444'}">${item.thu_chi === 'thu' ? '-' : '+'}${money(item.so_tien)}</span></td><td><strong style="color:var(--brand)">${money(vMap[item.id])}</strong></td></tr>`).join("") : '<tr><td colspan="7" class="empty">Không tìm thấy dữ liệu phù hợp.</td></tr>';
      };

      const custInput = document.getElementById("debtFilterCustomerDisp");
      const custHidden = document.getElementById("debtFilterCustomer");
      const custMenu = document.getElementById("debtFilterCustomerMenu");
      const custClear = document.getElementById("debtFilterCustomerClear");

      const renderCustFilterList = (query) => {
        const q = query.toLowerCase();
        // Live filter
        const matches = appState.KHACH_HANG.filter(c => c.ten_kh.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
        custMenu.innerHTML = matches.map(c => `<div class="dropdown-item" data-id="${safeText(c.id)}">${safeText(c.ten_kh)} <small>(${safeText(c.id)})</small></div>`).join("");
        if (!matches.length) custMenu.innerHTML = '<div style="padding:10px; color:#aaa; font-size:12px">Không tìm thấy khách.</div>';

        custMenu.querySelectorAll('.dropdown-item').forEach(el => {
          el.onclick = () => {
            custHidden.value = el.dataset.id;
            custInput.value = el.childNodes[0].textContent.trim();
            custMenu.classList.remove("show");
            custClear.style.display = "block";
            renderFilteredDebts();
          };
        });
      };

      custInput.addEventListener("focus", () => { renderCustFilterList(custInput.value); custMenu.classList.add("show"); });
      custInput.addEventListener("input", (e) => {
        custHidden.value = "";
        renderCustFilterList(e.target.value);
        custMenu.classList.add("show");
        custClear.style.display = e.target.value ? "block" : "none";
        renderFilteredDebts();
      });

      custClear.addEventListener("click", () => {
        custInput.value = "";
        custHidden.value = "";
        custClear.style.display = "none";
        custMenu.classList.remove("show");
        renderFilteredDebts();
      });

      document.addEventListener("click", (e) => { if (!document.getElementById("debtCustomerFilterBox").contains(e.target)) custMenu.classList.remove("show"); });

      document.getElementById("debtFilterStart").addEventListener("change", renderFilteredDebts);
      document.getElementById("debtFilterEnd").addEventListener("change", renderFilteredDebts);
      document.getElementById("debtFilterType").addEventListener("change", renderFilteredDebts);

      document.getElementById("resetDebtFilterBtn").addEventListener("click", () => {
        document.getElementById("debtFilterStart").value = "";
        document.getElementById("debtFilterEnd").value = "";
        document.getElementById("debtFilterType").value = "";
        custInput.value = "";
        custHidden.value = "";
        custClear.style.display = "none";
        renderFilteredDebts();
      });
      if (document.getElementById("addDebtBtn")) document.getElementById("addDebtBtn").addEventListener("click", () => openDebtFormDrawer());

      // Excel Import cho Công Nợ
      if (document.getElementById("uploadDebtExcelBtn")) document.getElementById("uploadDebtExcelBtn").addEventListener("click", () => {
        document.getElementById("debtUploadExcelInput").click();
      });

      if (document.getElementById("debtUploadExcelInput")) document.getElementById("debtUploadExcelInput").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        el.toast.textContent = "Đang xử lý file Excel Công nợ...";
        el.toast.style.background = "#ca8a04";
        el.toast.classList.add("show");

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            if (typeof XLSX === "undefined") throw new Error("Thư viện XLSX chưa tải xong, thử lại.");
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames.includes("Báo cáo") ? "Báo cáo" : workbook.SheetNames[0];
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
            const normalizeHeader = (value) => removeDiacritics(String(value || "")).toLowerCase().replace(/[^a-z0-9_]/g, "");
            const normalizeDebtType = (value) => {
              const text = normalizeBonusKey(value);
              if (["thu", "phieuthu", "tien thu", "tienthu", "giamno"].includes(text)) return "thu";
              if (["chi", "phieuchi", "tien chi", "tienchi", "phatsinh", "tangno"].includes(text)) return "chi";
              return "";
            };
            const parseExcelDateValue = (value) => {
              if (value instanceof Date) return `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, "0")}-${value.getDate().toString().padStart(2, "0")}`;
              if (typeof value === "number" && value > 30000) {
                const date = new Date(Math.round((value - 25569) * 86400 * 1000));
                return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
              }
              return String(value || "").trim();
            };
            const getCell = (row, field) => {
              const target = normalizeHeader(field);
              const key = Object.keys(row).find((name) => normalizeHeader(name) === target);
              return key ? row[key] : "";
            };

            const requiredHeaders = ["id", "ngay", "id_khach_hang", "id_dh", "thu_chi", "so_tien"];
            const firstRow = rows[0] || {};
            const availableHeaders = Object.keys(firstRow).map(normalizeHeader);
            const missingHeaders = requiredHeaders.filter((header) => !availableHeaders.includes(normalizeHeader(header)));
            if (missingHeaders.length) {
              alert(`File Excel thiếu cột: ${missingHeaders.join(", ")}\nCần đúng các cột: id, ngay, id_khach_hang, id_dh, thu_chi, so_tien.`);
              el.toast.classList.remove("show");
              e.target.value = "";
              return;
            }

            let newDebtCount = 0;
            let skippedCount = 0;
            const existingDebtIds = new Set(appState.CONG_NO.map(c => String(c.id || "").trim().toLowerCase()).filter(Boolean));
            const newDebtRows = [];

            rows.forEach((row) => {
              const id = String(getCell(row, "id") || "").trim() || randomId("CN");
              const idKh = String(getCell(row, "id_khach_hang") || "").trim();
              const thuChi = normalizeDebtType(getCell(row, "thu_chi"));
              const soTien = parseLooseNumber(getCell(row, "so_tien"));

              if (!idKh || !thuChi || soTien <= 0) {
                skippedCount++;
                return;
              }
              if (existingDebtIds.has(id.toLowerCase())) {
                skippedCount++;
                return;
              }

              const record = {
                id,
                ngay: parseExcelDateValue(getCell(row, "ngay")) || todayInput(),
                id_khach_hang: idKh,
                id_dh: String(getCell(row, "id_dh") || "").trim(),
                thu_chi: thuChi,
                so_tien: soTien,
                cong_no: "",
                id_nv: ""
              };
              appState.CONG_NO.push(record);
              newDebtRows.push(record);
              existingDebtIds.add(id.toLowerCase());
              newDebtCount++;
            });

            if (newDebtCount > 0) {
              recalcState(appState);
              await clearSheet("CONG_NO");
              await updateSheet("CONG_NO", objectsToRows(appState.CONG_NO, CONFIG.sheets.CONG_NO));
              syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
              renderAll();
              alert(`Import thành công: ${newDebtCount} dòng công nợ.${skippedCount ? ` Bỏ qua ${skippedCount} dòng không hợp lệ hoặc trùng ID.` : ""}`);
            } else {
              alert("Import thất bại: Không có dòng hợp lệ. Cần có id_khach_hang, thu_chi là thu/chi và so_tien > 0.");
            }
          } catch (error) {
            console.error(error);
            alert("Lỗi xử lý Excel: " + error.message);
          } finally {
            el.toast.classList.remove("show");
            e.target.value = "";
          }
        };
        reader.readAsArrayBuffer(file);
      });

      renderFilteredDebts();
    }

    function viewDebtDrawer(debtId) {
      const vMap = getVirtualDebtMap();
      const item = appState.CONG_NO.find((row) => row.id === debtId);
      if (!item) return;
      openDrawer("Chi tiết phiếu", "Xem thông tin phiếu công nợ.", `
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div class="field"><label>ID Phiếu</label><input value="${safeText(item.id)}" readonly style="background:var(--soft)"/></div>
          <div class="field"><label>Ngày phát sinh</label><input value="${safeText(formatDateVi(item.ngay))}" readonly style="background:var(--soft)"/></div>
          <div class="field"><label>Khách hàng</label><input value="${safeText(getCustomerName(item.id_khach_hang))}" readonly style="background:var(--soft)"/></div>
          <div class="field"><label>Nhân viên phụ trách</label><input value="${safeText(getNvN(item.id_nv || ''))}" readonly style="background:var(--soft)"/></div>
          <div class="field"><label>Liên kết Đơn hàng</label><input value="${safeText(item.id_dh || "Không có")}" readonly style="background:var(--soft)"/></div>
          <div class="field"><label>Loại Phiếu</label><input value="${item.thu_chi === 'thu' ? 'Phiếu Thu (Giảm nợ)' : 'Phiếu Chi (Tăng nợ)'}" readonly style="background:var(--soft); color:${item.thu_chi === 'thu' ? '#16a34a' : '#ef4444'}; font-weight:bold"/></div>
          <div class="field"><label>Số tiền</label><input value="${money(item.so_tien)}" readonly style="background:var(--soft)"/></div>
          <div class="field full"><label>Công nợ Ảo (Tính lại theo ngày)</label><input value="${money(vMap[item.id])}" readonly style="background:var(--brand-soft); font-weight:800; color:var(--brand); font-size:16px"/></div>
          <div class="button-row full" style="margin-top:12px">
            <button class="btn btn-secondary" type="button" onclick="openDebtFormDrawer('${safeText(item.id)}')" style="flex:1">Sửa phiếu</button>
            <button class="btn btn-danger" type="button" onclick="deleteDebt('${safeText(item.id)}')" style="flex:1">Xóa phiếu</button>
          </div>
        </div>`);
    }

    function openDebtFormDrawer(debtId = "") {
      if (!requireAdminAccess("Chỉ admin mới được thêm hoặc sửa công nợ.")) return;
      const item = appState.CONG_NO.find((row) => row.id === debtId) || {};
      const isThu = debtId ? (item.thu_chi === "thu") : true;
      openDrawer(debtId ? "Sửa phiếu công nợ" : "Thêm phiếu công nợ", "Bảng công nợ sẽ bỏ qua cột công nợ tĩnh.", `
        <style>
          .dropdown-search { position:relative; }
          .dropdown-search input { width:100%; border:1px solid var(--line); padding:10px; border-radius:10px; }
          .dropdown-menu { position:absolute; top:100%; left:0; right:0; background:#fff; border:1px solid var(--line); border-radius:8px; max-height:200px; overflow-y:auto; z-index:10; display:none; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
          .dropdown-menu.show { display:block; }
          .dropdown-item { padding:10px 14px; cursor:pointer; font-size:13px; }
          .dropdown-item:hover { background:var(--brand-soft); }
        </style>
        <form id="debtForm" style="display:flex; flex-direction:column; gap:8px;">
          <div class="field"><label>ID</label><input name="id" value="${safeText(item.id || randomId("CN"))}" ${debtId ? "readonly" : ""} required /></div>
          <div class="field"><label>Ngày phát sinh</label><input name="ngay" type="date" value="${safeText(formatDateInput(item.ngay))}" required /></div>
          
          <div class="field"><label>Khách hàng</label>
             <div class="dropdown-search" id="debtCustomerSelectBox">
                <input type="text" id="debtCustomerSearch" placeholder="Gõ tên để tìm..." value="${safeText(getCustomerName(item.id_khach_hang))}" autocomplete="off" required />
                <input type="hidden" name="id_khach_hang" id="debtCustomerId" value="${safeText(item.id_khach_hang || "")}" required />
                <div class="dropdown-menu" id="debtCustomerMenu"></div>
             </div>
          </div>
          
          <div class="field"><label>Liên kết Đơn hàng (Tuỳ chọn)</label><select name="id_dh"><option value="">Không gắn đơn hàng</option>${appState.DH.map((order) => `<option value="${safeText(order.id)}" ${order.id === item.id_dh ? "selected" : ""}>${safeText(order.id)} - ${safeText(order.npp)}</option>`).join("")}</select></div>
          <div class="field"><label>Nhân viên phụ trách</label><select name="id_nv"><option value="">Không phân bổ NV</option>${(window.usersData || []).map(u => `<option value="${safeText(u.id)}" ${u.id === item.id_nv ? "selected" : ""}>${safeText(u.ho_ten)} - ${safeText(u.id)}</option>`).join("")}</select></div>
          <div class="field"><label>Thu / Chi</label><select name="thu_chi" required><option value="thu" ${isThu ? "selected" : ""}>Thu (Khách trả giảm nợ)</option><option value="chi" ${!isThu ? "selected" : ""}>Chi (Phát sinh tăng nợ)</option></select></div>
          <div class="field"><label>Số tiền (VNĐ)</label><input type="number" name="so_tien" id="debtAmountInput" value="${item.so_tien || ''}" min="0" required placeholder="Ví dụ: 1000000" style="font-size: 15px; font-weight: 600; color: var(--brand);" /></div>
          <div class="button-row full" style="margin-top:12px"><button class="btn btn-primary" type="submit" style="width:100%">Lưu phiếu</button></div>
        </form>`);

      const searchInput = document.getElementById("debtCustomerSearch");
      const hiddenId = document.getElementById("debtCustomerId");
      const menu = document.getElementById("debtCustomerMenu");
      const allCustomers = appState.KHACH_HANG;

      const renderCustList = (query) => {
        const q = query.toLowerCase();
        const matches = allCustomers.filter(c => Object.values(c).join(" ").toLowerCase().includes(q));
        menu.innerHTML = matches.map(c => `<div class="dropdown-item" data-id="${safeText(c.id)}">${safeText(c.ten_kh)} <small>(${safeText(c.dien_thoai || c.id)})</small></div>`).join("");
        if (!matches.length) menu.innerHTML = '<div style="padding:10px; color:#aaa; font-size:12px">Không tìm thấy khách hàng.</div>';
        menu.querySelectorAll('.dropdown-item').forEach(el => {
          el.onclick = () => {
            hiddenId.value = el.dataset.id;
            searchInput.value = el.childNodes[0].textContent.trim();
            menu.classList.remove("show");
          };
        });
      };

      searchInput.onfocus = () => { renderCustList(searchInput.value); menu.classList.add("show"); };
      searchInput.oninput = (e) => { renderCustList(e.target.value); hiddenId.value = ""; menu.classList.add("show"); };
      document.addEventListener("click", (e) => { if (!document.getElementById("debtCustomerSelectBox").contains(e.target)) menu.classList.remove("show"); });

      document.getElementById("debtForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        if (!data.id_khach_hang) return alert("Vui lòng chọn chính xác khách hàng từ danh sách tìm kiếm gợi ý.");

        const record = { id: String(data.id).trim(), ngay: formatDateVi(String(data.ngay)), id_khach_hang: String(data.id_khach_hang).trim(), id_dh: String(data.id_dh || "").trim(), thu_chi: String(data.thu_chi || "chi"), so_tien: Number(data.so_tien || 0), cong_no: Number(item.cong_no || 0), id_nv: String(data.id_nv || "").trim() };
        const index = appState.CONG_NO.findIndex((row) => row.id === record.id);
        const isNew = index < 0;

        if (isNew) appState.CONG_NO.push(record);
        else appState.CONG_NO[index] = record;

        recalcState(appState);

        try {
          if (isNew) {
            const finalRecord = appState.CONG_NO[appState.CONG_NO.length - 1];
            const rowValues = objectsToRows([finalRecord], CONFIG.sheets.CONG_NO)[1];
            await appendSheetRow("CONG_NO", [rowValues]);
            syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
            renderAll();
            showToast("Đã thêm phiếu công nợ (Tối ưu tốc độ).");
          } else {
            await clearSheet("CONG_NO");
            await updateSheet("CONG_NO", objectsToRows(appState.CONG_NO, CONFIG.sheets.CONG_NO));
            syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
            renderAll();
            showToast("Đã cập nhật công nợ.");
          }
        } catch (error) {
          console.error(error);
          await persistAllSheets("Đã lưu phiếu công nợ (Đồng bộ).");
        }
        closeDrawer();
      });
    }

    async function deleteDebt(debtId) {
      if (!requireAdminAccess("Chỉ admin mới được xóa công nợ.")) return;
      if (!confirm("Xóa phiếu công nợ này?")) return;
      appState.CONG_NO = appState.CONG_NO.filter((row) => row.id !== debtId);
      recalcState(appState);
      await clearSheet("CONG_NO");
      await updateSheet("CONG_NO", objectsToRows(appState.CONG_NO, CONFIG.sheets.CONG_NO));
      syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
      renderAll();
      showToast("Đã xóa công nợ.");
      closeDrawer();
    }

    function renderOrderDetails() {
      const spList = [...new Set(appState.DH_CT.map(d => d.id_sp).filter(Boolean))];
      const dhList = [...new Set(appState.DH_CT.map(d => d.id_dh).filter(Boolean))];
      const nppList = [...new Set(appState.DH_CT.map(d => d.npp).filter(Boolean))];

      document.getElementById("order_details").innerHTML = `
        <div class="card panel">
          <div class="toolbar" style="align-items:flex-end">
             <div><h2>Chi tiết Đơn hàng</h2><p class="subtle">Sheet DH_CT: Liệt kê chi tiết từng sản phẩm được bán ra trong kho.</p></div>
          </div>
          <div class="toolbar sticky-filter" style="border-bottom: none;">
            <div class="toolbar-search" style="flex-wrap:wrap; align-items:center; flex:1">
              <input type="text" id="odSearch" placeholder="Tìm ID đơn, sản phẩm, NPP, NV..." style="min-width:250px;" />
              
              <div class="dropdown-search" id="odNvBox" style="min-width:180px; position:relative;">
                <input type="text" id="odNvFilter" placeholder="Lọc Nhân viên..." autocomplete="off" style="padding-right:24px;" />
                <span id="odNvClear" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:16px; cursor:pointer; color:#999; display:none; z-index:2;">&times;</span>
                <div class="dropdown-menu" id="odNvMenu" style="max-height:220px;"></div>
              </div>

              <div class="dropdown-search" id="odSpBox" style="min-width:180px; position:relative;">
                <input type="text" id="odSpFilter" placeholder="Lọc ID Sản phẩm..." autocomplete="off" style="padding-right:24px;" />
                <span id="odSpClear" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:16px; cursor:pointer; color:#999; display:none; z-index:2;">&times;</span>
                <div class="dropdown-menu" id="odSpMenu" style="max-height:220px;"></div>
              </div>

              <div class="dropdown-search" id="odNppBox" style="min-width:180px; position:relative;">
                <input type="text" id="odNppFilter" placeholder="Lọc Nhà phân phối..." autocomplete="off" style="padding-right:24px;" />
                <span id="odNppClear" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:16px; cursor:pointer; color:#999; display:none; z-index:2;">&times;</span>
                <div class="dropdown-menu" id="odNppMenu" style="max-height:220px;"></div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <button class="btn btn-primary" type="button" id="odUploadExcelBtn">+ Tải Excel</button>
              <input type="file" id="odUploadExcelInput" accept=".xlsx, .xls" style="display:none;" />
              <button class="btn btn-secondary" type="button" id="resetOdFilterBtn">Bỏ lọc</button>
            </div>
          </div>
          <div class="table-wrap">
            <style>
               tbody tr[data-action="view-order-detail"]:hover{background:var(--brand-soft)}
            </style>
            <table>
              <thead><tr><th>ID đơn hàng</th><th>Ngày</th><th>Nhà phân phối</th><th>ID nhân viên</th><th>ID sản phẩm</th><th>Loại SP</th><th style="text-align:right">Đơn giá</th><th style="text-align:center">Số lượng</th><th style="text-align:right">Thành tiền</th></tr></thead>
              <tbody id="odTableBody"></tbody>
              <tfoot id="odTableFoot" style="font-weight:bold; background:#f8fafc"></tfoot>
            </table>
          </div>
        </div>`;

      if (!canManageData()) {
        document.getElementById("odUploadExcelBtn")?.remove();
        document.getElementById("odUploadExcelInput")?.remove();
      }

      const tbody = document.getElementById("odTableBody");
      const tfoot = document.getElementById("odTableFoot");

      const renderFiltered = () => {
        const spMap = {}; appState.DS_SP.forEach(sp => spMap[sp.id] = sp.ten_sp);
        const khMap = {}; appState.KHACH_HANG.forEach(kh => khMap[kh.id] = kh.ten_kh);
        const nvMap = {}; (window.usersData || []).forEach(u => nvMap[u.id] = u.ho_ten);
        const formatProductLabel = (id) => {
          const productName = spMap[id] || "";
          return productName && productName !== id ? `${id} - ${productName}` : id;
        };
        const formatCustomerLabel = (id) => {
          const customerName = khMap[id] || "";
          return customerName && customerName !== id ? `${id} - ${customerName}` : id;
        };

        const q = (document.getElementById("odSearch").value || "").toLowerCase();
        const fNv = (document.getElementById("odNvFilter").dataset.realVal || "").toLowerCase();
        const fSp = (document.getElementById("odSpFilter").dataset.realVal || "").toLowerCase();
        const fNpp = (document.getElementById("odNppFilter").dataset.realVal || "").toLowerCase();

        let rows = appState.DH_CT.filter(item => {
          if (fNv && !(item.id_nv || "").toLowerCase().includes(fNv)) return false;
          if (fSp && !(item.id_sp || "").toLowerCase().includes(fSp)) return false;
          if (fNpp && !(item.npp || "").toLowerCase().includes(fNpp)) return false;
          if (q && ![item.id, item.id_dh, item.id_sp, spMap[item.id_sp], item.npp, item.id_nv].join(" ").toLowerCase().includes(q)) return false;
          return true;
        });

        rows.sort((a, b) => parseDateSort(b.ngay).localeCompare(parseDateSort(a.ngay)));

        let sumQty = 0;
        let sumTotal = 0;
        rows.forEach(r => {
          sumQty += Number(r.slg || 0);
          sumTotal += Number(r.thanh_tien || 0);
        });

        if (!rows.length) {
          tbody.innerHTML = '<tr><td colspan="9" class="empty">Không tìm thấy chi tiết đơn hàng.</td></tr>';
          tfoot.innerHTML = '';
          return;
        }

        const renderRows = rows.slice(0, 150);
        tbody.innerHTML = renderRows.map(item => `
          <tr data-action="view-order-detail" data-id="${safeText(item.id)}" style="cursor: pointer;" ondblclick="openOrderDetailViewDrawer('${safeText(item.id_dh)}')">
             <td class="mono"><span class="badge" style="background:#e0f2fe; color:#0284c7">${safeText(item.id_dh)}</span></td>
             <td>${safeText(formatDateVi(item.ngay))}</td>
             <td>${safeText(formatCustomerLabel(item.npp))}</td>
             <td>${safeText(nvMap[item.id_nv] || item.id_nv)}</td>
             <td style="font-weight:600; color:var(--text)">${safeText(formatProductLabel(item.id_sp))}</td>
             <td><span class="badge" style="background:#f1f5f9; color:#475569">${safeText(item.sp_chinh_thuong || "-")}</span></td>
             <td style="text-align:right">${money(item.don_gia)}</td>
             <td style="text-align:center">${item.slg}</td>
             <td style="text-align:right"><strong style="color:var(--brand)">${money(item.thanh_tien)}</strong></td>
          </tr>`).join("");

        if (rows.length > 150) tbody.innerHTML += `<tr><td colspan="9" style="text-align:center; padding:12px; color:var(--muted); font-size:13px; background:#f9fafb;">... và <strong>${rows.length - 150}</strong> dòng khác (Hãy lọc chi tiết hơn)</td></tr>`;

        tfoot.innerHTML = `<tr><td colspan="7" style="text-align:right"><strong>TỔNG CỘNG:</strong></td><td style="text-align:center; color:var(--brand)">${sumQty}</td><td style="text-align:right; color:var(--brand)">${money(sumTotal)}</td></tr>`;
      };

      const setupDropdownObj = (inputEl, menuEl, clearEl, sourceList, boxId) => {
        const renderList = (query) => {
          const q = query.toLowerCase();
          const matches = sourceList.filter(n => (n.text || "").toLowerCase().includes(q) || (n.id || "").toLowerCase().includes(q)).slice(0, 50);
          menuEl.innerHTML = matches.map(n => `<div class="dropdown-item" data-val="${safeText(n.id)}">${safeText(n.text)}</div>`).join("");
          if (!matches.length) menuEl.innerHTML = '<div style="padding:10px; color:#aaa; font-size:12px">Không tìm thấy.</div>';

          menuEl.querySelectorAll('.dropdown-item').forEach(el => {
            el.onclick = () => {
              inputEl.value = el.innerText;
              inputEl.dataset.realVal = el.dataset.val;
              menuEl.classList.remove("show");
              clearEl.style.display = "block";
              renderFiltered();
            };
          });
        };

        inputEl.addEventListener("focus", () => { renderList(inputEl.value); menuEl.classList.add("show"); });
        inputEl.addEventListener("input", (e) => {
          renderList(e.target.value);
          menuEl.classList.add("show");
          clearEl.style.display = e.target.value ? "block" : "none";
          if (!e.target.value) inputEl.dataset.realVal = "";
          renderFiltered();
        });

        clearEl.addEventListener("click", () => {
          inputEl.value = "";
          inputEl.dataset.realVal = "";
          clearEl.style.display = "none";
          menuEl.classList.remove("show");
          renderFiltered();
        });

        document.addEventListener("click", (e) => { if (!document.getElementById(boxId).contains(e.target)) menuEl.classList.remove("show"); });
      };

      const spObjList = [...new Set(appState.DH_CT.map(d => d.id_sp).filter(Boolean))].map(id => ({ id, text: appState.DS_SP.find(x => x.id === id)?.ten_sp || id }));
      const nvObjList = [...new Set(appState.DH_CT.map(d => d.id_nv).filter(Boolean))].map(id => ({ id, text: (window.usersData || []).find(x => x.id === id)?.ho_ten || id }));
      const nppObjList = [...new Set(appState.DH_CT.map(d => d.npp).filter(Boolean))].map(id => ({ id, text: appState.KHACH_HANG.find(x => x.id === id)?.ten_kh || id }));

      setupDropdownObj(document.getElementById("odNvFilter"), document.getElementById("odNvMenu"), document.getElementById("odNvClear"), nvObjList, "odNvBox");
      setupDropdownObj(document.getElementById("odSpFilter"), document.getElementById("odSpMenu"), document.getElementById("odSpClear"), spObjList, "odSpBox");
      setupDropdownObj(document.getElementById("odNppFilter"), document.getElementById("odNppMenu"), document.getElementById("odNppClear"), nppObjList, "odNppBox");

      document.getElementById("odSearch").addEventListener("input", renderFiltered);
      document.getElementById("resetOdFilterBtn").addEventListener("click", () => {
        document.getElementById("odSearch").value = "";

        const resetDrop = (idStr) => {
          const el = document.getElementById(idStr + "Filter");
          if (el) { el.value = ""; el.dataset.realVal = ""; }
          const clearEl = document.getElementById(idStr + "Clear");
          if (clearEl) clearEl.style.display = "none";
        };
        resetDrop("odNv"); resetDrop("odSp"); resetDrop("odNpp");

        renderFiltered();
      });

      if (document.getElementById("odUploadExcelBtn")) document.getElementById("odUploadExcelBtn").addEventListener("click", () => document.getElementById("odUploadExcelInput").click());
      if (document.getElementById("odUploadExcelInput")) document.getElementById("odUploadExcelInput").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        el.toast.textContent = "Đang xử lý file Excel...";
        el.toast.style.background = "#ca8a04";
        el.toast.classList.add("show");

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            if (typeof XLSX === "undefined") throw new Error("Thư viện XLSX chưa tải xong, thử lại.");
            const workbook = XLSX.read(data, { type: 'array' });

            if (!workbook.SheetNames.includes("Báo cáo")) {
              alert("Không tìm thấy Sheet 'Báo cáo' trong file Excel.");
              el.toast.classList.remove("show");
              e.target.value = "";
              return;
            }

            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets["Báo cáo"], { header: 1 });
            let importedCount = 0;
            const newDhCtRows = []; // Dòng mới để append
            const existingProductIds = new Set(appState.DS_SP.map(product => String(product.id || "").trim()).filter(Boolean));
            const newProductRows = [];

            for (let i = 3; i < sheetData.length; i++) {
              const row = sheetData[i];
              if (!row || row.length === 0) continue;

              const id_dh = String(row[2] || "").trim();
              if (!id_dh) continue;

              const ngay_raw = row[1];
              let ngay_str = String(ngay_raw || "").trim();
              if (typeof ngay_raw === "number") {
                const excelEpoc = new Date(Math.round((ngay_raw - 25569) * 86400 * 1000));
                ngay_str = `${excelEpoc.getUTCDate().toString().padStart(2, '0')}/${(excelEpoc.getUTCMonth() + 1).toString().padStart(2, '0')}/${excelEpoc.getUTCFullYear()}`;
              }

              const npp = String(row[7] || "").trim();
              const id_sp = String(row[9] || "").trim();
              const ten_sp = String(row[10] || "").trim();
              if (!id_sp) continue;

              const don_gia = Number(String(row[13] || "0").replace(/[^0-9.-]+/g, ""));
              const slg = Number(String(row[12] || "0").replace(/[^0-9.-]+/g, ""));
              const thanh_tien = Number(String(row[14] || "0").replace(/[^0-9.-]+/g, ""));

              if (!existingProductIds.has(id_sp)) {
                const productRow = {
                  id: id_sp,
                  ten_sp: ten_sp || id_sp,
                  model: "",
                  ncc: "",
                  gia_ban: don_gia || 0
                };
                appState.DS_SP.push(productRow);
                newProductRows.push(productRow);
                existingProductIds.add(id_sp);
              }

              const newRow = {
                id: randomId().toLowerCase() + randomId().toLowerCase().substring(0, 2),
                id_dh: id_dh,
                ngay: ngay_str,
                npp: npp,
                id_nv: null, // Không ghi đè để bảo toàn công thức mảng trên sheet
                id_sp: id_sp,
                don_gia: don_gia,
                slg: slg,
                thanh_tien: thanh_tien,
                ncc: null,
                sp_chinh_thuong: null
              };

              appState.DH_CT.push(newRow);
              newDhCtRows.push(newRow);
              importedCount++;

            }

            if (importedCount > 0) {
              recalcState(appState);
              if (newProductRows.length > 0) {
                await appendSheetRow("DS_SP", objectsToRows(newProductRows, CONFIG.sheets.DS_SP).slice(1));
              }
              if (newDhCtRows.length > 0) {
                await appendSheetRow("DH_CT", objectsToRows(newDhCtRows, CONFIG.sheets.DH_CT).slice(1));
              }
              syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
              renderAll();
              alert(`Import thành công: ${importedCount} dòng chi tiết vào DH_CT.${newProductRows.length ? ` Đã thêm ${newProductRows.length} sản phẩm mới vào DS_SP.` : ""}`);
            } else {
              alert("Import thất bại: Không có dữ liệu hợp lệ.");
            }
          } catch (error) {
            console.error(error);
            alert("Lỗi xử lý Excel: " + error.message);
          } finally {
            el.toast.classList.remove("show");
            e.target.value = "";
          }
        };
        reader.readAsArrayBuffer(file);
      });

      renderFiltered();
    }

    function openOrderDetailViewDrawer(orderId) {
      const details = appState.DH_CT.filter(r => String(r.id_dh || "").trim() === String(orderId || "").trim());
      if (!details.length) return;

      const first = details[0];
      const khMap = {}; appState.KHACH_HANG.forEach(kh => khMap[kh.id] = kh.ten_kh);
      const spMap = {}; appState.DS_SP.forEach(sp => spMap[sp.id] = sp.ten_sp);
      const formatProductLabel = (id) => {
        const productName = spMap[id] || "";
        return productName && productName !== id ? `${id} - ${productName}` : id;
      };
      const formatCustomerLabel = (id) => {
        const customerName = khMap[id] || "";
        return customerName && customerName !== id ? `${id} - ${customerName}` : id;
      };
      const totalQty = details.reduce((sum, item) => sum + Number(item.slg || 0), 0);
      const totalMoney = details.reduce((sum, item) => sum + Number(item.thanh_tien || 0), 0);

      openDrawer("Chi tiết Đơn hàng", `ID đơn hàng: ${orderId}`, `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:12px;">
            <div class="field"><label>ID đơn hàng</label><input value="${safeText(orderId)}" readonly style="background:var(--brand-soft); color:var(--brand); font-weight:700"/></div>
            <div class="field"><label>Ngày</label><input value="${safeText(formatDateVi(first.ngay))}" readonly style="background:var(--soft)"/></div>
            <div class="field"><label>Nhà phân phối</label><input value="${safeText(formatCustomerLabel(first.npp || ""))}" readonly style="background:var(--soft)"/></div>
            <div class="field"><label>ID nhân viên</label><input value="${safeText(first.id_nv || "")}" readonly style="background:var(--soft)"/></div>
          </div>

          <div class="table-wrap" style="border:1px solid var(--line); border-radius:10px;">
            <table style="min-width:100%;">
              <thead>
                <tr>
                  <th>ID sản phẩm</th>
                  <th>Loại SP</th>
                  <th style="text-align:right">Đơn giá</th>
                  <th style="text-align:center">Số lượng</th>
                  <th style="text-align:right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${details.map(item => `
                  <tr>
                    <td class="mono">${safeText(formatProductLabel(item.id_sp))}</td>
                    <td>${safeText(item.sp_chinh_thuong || "-")}</td>
                    <td style="text-align:right">${money(item.don_gia)}</td>
                    <td style="text-align:center">${safeText(item.slg)}</td>
                    <td style="text-align:right"><strong>${money(item.thanh_tien)}</strong></td>
                  </tr>
                `).join("")}
              </tbody>
              <tfoot style="font-weight:800; background:#f8fafc;">
                <tr>
                  <td colspan="3" style="text-align:right">Tổng cộng</td>
                  <td style="text-align:center;color:var(--brand)">${safeText(totalQty)}</td>
                  <td style="text-align:right;color:var(--brand)">${money(totalMoney)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      `);
    }

    function renderKpi() {
      const container = document.getElementById("kpi");

      // Khởi tạo giá trị lọc nếu chưa có
      if (window.kpiFilterYear === undefined) window.kpiFilterYear = "";
      if (window.kpiFilterMonth === undefined) window.kpiFilterMonth = "";
      if (window.kpiFilterNv === undefined) window.kpiFilterNv = "";

      // Helper để lấy năm từ thang
      const getYear = (th) => {
        if (!th) return "";
        if (th.includes("-")) return th.split("-")[0];
        if (th.includes("/")) { const p = th.split("/"); return p[p.length - 1]; }
        return "";
      };

      // Lấy danh sách unique để làm filter
      const uniqueYears = [...new Set(appState.KPI.map(item => getYear(item.thang)))].filter(Boolean).sort().reverse();
      const uniqueMonths = [...new Set(appState.KPI.map(item => item.thang))].filter(Boolean).sort().reverse();
      const uniqueNvs = [...new Set(appState.KPI.map(item => item.id_nv))].filter(Boolean).sort();

      // Filter and Sort
      let filtered = appState.KPI.filter(item => {
        const matchYear = !window.kpiFilterYear || getYear(item.thang) === window.kpiFilterYear;
        const matchMonth = !window.kpiFilterMonth || String(item.thang) === window.kpiFilterMonth;
        const matchNv = !window.kpiFilterNv || String(item.id_nv) === window.kpiFilterNv;
        const hasValidNvId = (item.id_nv || "").toString().trim() !== "";
        return matchYear && matchMonth && matchNv && hasValidNvId;
      });

      // SẮP XẾP CỘT thang lớn tới nhỏ
      filtered.sort((a, b) => {
        const valA = String(a.thang || "");
        const valB = String(b.thang || "");
        return valB.localeCompare(valA);
      });

      // Tính tổng thực nhận
      const totalActual = filtered.reduce((sum, item) => sum + Number(item.tong_tien_thuong_thuc || 0), 0);

      container.innerHTML = `
        <div class="section-shell">
          <div class="section-header">
            <div class="section-title"><span class="title-dot"></span><span>QUẢN LÝ KPI NHÂN VIÊN</span></div>
            <div class="section-actions">
               <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                  <div class="filter-group" style="display:flex; align-items:center; background:#fff; border:1px solid var(--line); border-radius:8px; padding:0 10px; height:38px;">
                     <label style="font-size:12px; color:var(--muted); font-weight:600; margin-right:8px;">NĂM:</label>
                     <select id="kpiYearFilter" style="border:none; outline:none; font-size:13px; background:transparent; cursor:pointer; min-width:80px;">
                        <option value="">Tất cả</option>
                        ${uniqueYears.map(y => `<option value="${safeText(y)}" ${window.kpiFilterYear === y ? 'selected' : ''}>${safeText(y)}</option>`).join("")}
                     </select>
                  </div>
                  <div class="filter-group" style="display:flex; align-items:center; background:#fff; border:1px solid var(--line); border-radius:8px; padding:0 10px; height:38px;">
                     <label style="font-size:12px; color:var(--muted); font-weight:600; margin-right:8px;">THÁNG:</label>
                     <select id="kpiMonthFilter" style="border:none; outline:none; font-size:13px; background:transparent; cursor:pointer; min-width:100px;">
                        <option value="">Tất cả</option>
                        ${uniqueMonths.map(m => `<option value="${safeText(m)}" ${window.kpiFilterMonth === m ? 'selected' : ''}>${safeText(m)}</option>`).join("")}
                     </select>
                  </div>
                  <div class="filter-group" style="display:flex; align-items:center; background:#fff; border:1px solid var(--line); border-radius:8px; padding:0 10px; height:38px;">
                     <label style="font-size:12px; color:var(--muted); font-weight:600; margin-right:8px;">MÃ NV:</label>
                     <select id="kpiNvFilter" style="border:none; outline:none; font-size:13px; background:transparent; cursor:pointer; min-width:100px;">
                        <option value="">Tất cả</option>
                        ${uniqueNvs.map(nv => `<option value="${safeText(nv)}" ${window.kpiFilterNv === nv ? 'selected' : ''}>${safeText(nv)}</option>`).join("")}
                     </select>
                  </div>
                  <button class="btn btn-secondary" id="kpiResetBtn" title="Xóa bộ lọc" style="height:38px">Xóa lọc</button>
               </div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">
            <div class="card" style="padding:16px; border:none; box-shadow:0 4px 16px rgba(0,0,0,.04); background: #f0fdf4; border-left: 4px solid #16a34a;">
               <small style="color:#16a34a; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">TỔNG THỰC NHẬN (THEO BỘ LỌC)</small>
               <strong style="display:block; font-size:28px; color:#111; margin-top:4px;">${money(totalActual)}</strong>
            </div>
          </div>
          
          <div class="panel">
            <div class="table-wrap" style="max-height: calc(100vh - 360px); overflow: auto;">
              <table style="min-width: 1400px; border-collapse: separate; border-spacing: 0;">
                <thead style="position: sticky; top: 0; z-index: 10; background: #f8fafc; box-shadow: 0 1px 0 var(--line);">
                  <tr>
                    <th style="width: 120px">THÁNG</th>
                    <th style="width: 180px">ID NV</th>
                    <th style="text-align: right">DOANH SỐ CHÍNH</th>
                    <th style="text-align: right">DOANH SỐ THƯỞNG</th>
                    <th style="text-align: right">THƯỞNG DS CHÍNH</th>
                    <th style="text-align: right">THƯỞNG DS THƯỞNG</th>
                    <th style="text-align: right">TIỀN THƯỞNG DS</th>
                    <th style="text-align: right; width: 120px">TỈ LỆ THU NỢ (%)</th>
                    <th style="text-align: right">TỔNG THƯỞNG</th>
                    <th style="text-align: right; background: #f0fdf4; font-weight: 700;">TỔNG THỰC NHẬN</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered.length ? filtered.map(item => `
                    <tr>
                      <td style="font-weight:600">${safeText(item.thang)}</td>
                      <td class="mono" style="font-weight:600; color:var(--brand)">${safeText(item.id_nv)}</td>
                      <td style="text-align: right">${money(item.ds_chinh)}</td>
                      <td style="text-align: right">${money(item.ds_thuong)}</td>
                      <td style="text-align: right">${money(item.tien_thuong_ds_chinh)}</td>
                      <td style="text-align: right">${money(item.tien_thuong_ds_thuong)}</td>
                      <td style="text-align: right">${money(item.tien_thuong_ds)}</td>
                      <td style="text-align: right; font-weight:700; color:#0ea5e9">${Number(item.ti_le_thu_con_no || 0).toLocaleString("vi-VN")}%</td>
                      <td style="text-align: right">${money(item.tong_tien_thuong)}</td>
                      <td style="text-align: right; font-weight:800; color:#16a34a; background: #f0fdf4;">${money(item.tong_tien_thuong_thuc)}</td>
                    </tr>
                  `).join("") : '<tr><td colspan="10" class="empty">Không tìm thấy dữ liệu KPI phù hợp.</td></tr>'}
                </tbody>
              </table>
            </div>
            <div style="margin-top: 12px; font-size: 13px; color: var(--muted); display: flex; justify-content: space-between; align-items: center;">
              <span>Hiển thị <strong>${filtered.length}</strong> dòng kết quả.</span>
              <span style="font-style: italic;">* Dữ liệu từ Sheet KPI.</span>
            </div>
          </div>
        </div>
      `;

      // Event listeners
      document.getElementById("kpiYearFilter").addEventListener("change", (e) => {
        window.kpiFilterYear = e.target.value;
        renderKpi();
      });
      document.getElementById("kpiMonthFilter").addEventListener("change", (e) => {
        window.kpiFilterMonth = e.target.value;
        renderKpi();
      });
      document.getElementById("kpiNvFilter").addEventListener("change", (e) => {
        window.kpiFilterNv = e.target.value;
        renderKpi();
      });
      document.getElementById("kpiResetBtn").addEventListener("click", () => {
        window.kpiFilterYear = "";
        window.kpiFilterMonth = "";
        window.kpiFilterNv = "";
        renderKpi();
      });
    }

    // ===== MODULE THƯỞNG NHÂN VIÊN =====
    function renderThuong() {
      const container = document.getElementById("thuong");
      if (!container) return;

      // Khởi tạo filter
      if (window.thuongFilterMonth === undefined) window.thuongFilterMonth = "";
      if (window.thuongFilterNv === undefined) window.thuongFilterNv = "";

      // --- Helper: parse tháng từ ngày (dd/mm/yyyy hoặc yyyy-mm-dd) ---
      const parseThangFromDate = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.includes("-")) {
          const p = dateStr.split("-"); // yyyy-mm-dd
          return p.length >= 2 ? `${p[0]}-${p[1].padStart(2, "0")}` : "";
        }
        if (dateStr.includes("/")) {
          const p = dateStr.split("/"); // dd/mm/yyyy
          return p.length >= 3 ? `${p[2]}-${p[1].padStart(2, "0")}` : "";
        }
        return "";
      };

      // --- Helper: tra cứu điều kiện thưởng từ DK_THUONG ---
      // Hỗ trợ CỘNG DỒN nhiều rule khớp cùng khoảng doanh số.
      // Các kieu: "codinh" | "phantram" | "phantramvuot"
      // Ưu tiên: nếu có rule riêng cho NV thì dùng rule NV, bỏ rule chung cùng kieu
      const normString = (str) => normalizeBonusKey(str); // Xóa dấu, space, _ và -

      const lookupBonus = (loai, amount, nvId, thang) => {
        const rules = (fullAppState.DK_THUONG || appState.DK_THUONG || []);
        const targetLoai = normString(loai);
        const targetThang = normalizeMonthKey(thang);

        // Bước 1: lọc các rule khớp loại, NV, tháng, khoảng DS
        const matched = rules.filter(r => {
          if (normString(r.loai) !== targetLoai) return false;
          const rNv = (r.id_nv || "").trim();
          if (rNv && rNv !== nvId) return false;
          const rThang = normalizeMonthKey(r.thang);
          if (rThang && rThang !== targetThang) return false;
          const from = parseLooseNumber(r.muc_tu);
          const to = parseLooseNumber(r.muc_den);
          if (amount < from) return false;
          if (to > 0 && amount > to) return false;
          return true;
        });
        if (!matched.length) return 0;

        // Bước 2: với mỗi kieu, nếu có rule riêng NV thì bỏ rule chung cùng kieu
        const hasSpecific = (kieuNorm) => matched.some(r =>
          (r.id_nv || "").trim() === nvId &&
          normString(r.kieu) === kieuNorm
        );
        const effectiveRules = matched.filter(r => {
          const kieuNorm = normString(r.kieu);
          const isGeneral = (r.id_nv || "").trim() === "";
          return !(isGeneral && hasSpecific(kieuNorm));
        });

        // Bước 3: cộng dồn tất cả rule còn lại
        return effectiveRules.reduce((sum, rule) => {
          const gia_tri = parseLooseNumber(rule.gia_tri);
          const kieu = normString(rule.kieu); // "co_dinh"→"codinh", "phan_tram"→"phantram", "phan_tram_vuot"→"phantramvuot"
          const muc_tu = parseLooseNumber(rule.muc_tu);
          const muc_den = parseLooseNumber(rule.muc_den);
          if (kieu === "phantram" || kieu === "%" || kieu === "phantramtong") {
            if (muc_den > 0) {
              return sum + amount * gia_tri / 100;
            } else {
              return sum + muc_tu * gia_tri / 100;
            }
          }
          if (kieu === "phantramvuot") {
            // % tính trên phần DS vượt quá muc_tu
            const phan_vuot = Math.max(0, amount - muc_tu);
            return sum + phan_vuot * gia_tri / 100;
          }
          // codinh hoặc thuongnong hoặc mặc định → dùng gia_tri cố định
          if (kieu === "khong") return sum; // không thưởng
          return sum + gia_tri;
        }, 0);
      };

      // --- Tổng hợp dữ liệu DH_CT theo (thang, id_nv) ---
      const mapKey = (thang, nvId) => `${thang}||${nvId}`;
      const salesMap = {}; // key => { ds_chinh, ds_thuong }
      (appState.DH_CT || []).forEach(row => {
        const nvId = (row.id_nv || "").trim();
        if (!nvId) return;
        const thang = parseThangFromDate(row.ngay || "");
        if (!thang) return;
        const key = mapKey(thang, nvId);
        if (!salesMap[key]) salesMap[key] = { thang, nvId, ds_chinh: 0, ds_thuong: 0 };
        const loaiSp = normalizeProductType(row.sp_chinh_thuong);
        const tt = Number(row.thanh_tien || 0);
        if (loaiSp === "chinh") salesMap[key].ds_chinh += tt;
        else if (loaiSp === "thuong") salesMap[key].ds_thuong += tt;
      });

      // --- Tổng hợp công nợ theo (thang, id_nv) ---
      const debtMap = {}; // key => { phat_sinh, da_thu }
      (appState.CONG_NO || []).forEach(row => {
        const nvId = (row.id_nv || "").trim();
        if (!nvId) return;
        const thang = parseThangFromDate(row.ngay || "");
        if (!thang) return;
        const key = mapKey(thang, nvId);
        if (!debtMap[key]) debtMap[key] = { phat_sinh: 0, da_thu: 0 };
        const st = Number(row.so_tien || 0);
        if ((row.thu_chi || "") === "chi") debtMap[key].phat_sinh += st;
        else if ((row.thu_chi || "") === "thu") debtMap[key].da_thu += st;
      });

      // --- Tính bảng thưởng ---
      const rows = Object.values(salesMap).map(entry => {
        const { thang, nvId, ds_chinh, ds_thuong } = entry;
        const thuong_sp_chinh = Math.round(lookupBonus("sp_chinh", ds_chinh, nvId, thang));
        const thuong_sp_thuong = Math.round(lookupBonus("sp_thuong", ds_thuong, nvId, thang));
        const thuong_doanh_so = thuong_sp_chinh + thuong_sp_thuong;

        const debt = debtMap[mapKey(thang, nvId)] || { phat_sinh: 0, da_thu: 0 };
        const ti_le_thu_no = debt.phat_sinh > 0 ? (debt.da_thu / debt.phat_sinh * 100) : 100;

        let prevThang = "";
        if (thang && thang.includes("-")) {
          let [yyyy, mm] = thang.split("-").map(Number);
          mm -= 1;
          if (mm === 0) { mm = 12; yyyy -= 1; }
          prevThang = `${yyyy}-${String(mm).padStart(2, "0")}`;
        }
        const prevDebt = debtMap[mapKey(prevThang, nvId)] || { phat_sinh: 0, da_thu: 0 };
        // TỈ LỆ THU NỢ THÁNG TRC = Nợ đã thu THÁNG NÀY / Nợ phát sinh THÁNG TRƯỚC
        const ti_le_thu_no_trc = prevDebt.phat_sinh > 0 ? (debt.da_thu / prevDebt.phat_sinh * 100) : 100;

        let selected_ti_le = ti_le_thu_no; // Mặc định là tháng này
        const nvIdLower = String(nvId || "").trim().toLowerCase();
        if (nvIdLower === "ngô tuấn anh" || nvIdLower === "vũ công tâm") {
          selected_ti_le = ti_le_thu_no_trc;
        } else if (nvIdLower === "đoàn văn quang" || nvIdLower === "trần doãn sáng") {
          selected_ti_le = ti_le_thu_no;
        }

        let tong_tien_thuong = 0;
        if (selected_ti_le < 50) {
          tong_tien_thuong = 0;
        } else if (selected_ti_le < 90) {
          tong_tien_thuong = Math.round(thuong_doanh_so * selected_ti_le / 100);
        } else {
          tong_tien_thuong = thuong_doanh_so;
        }

        return { thang, nvId, ds_chinh, ds_thuong, thuong_sp_chinh, thuong_sp_thuong, thuong_doanh_so, ti_le_thu_no, ti_le_thu_no_trc, no_phat_sinh: debt.phat_sinh, no_da_thu: debt.da_thu, tong_tien_thuong };
      });

      // --- Tính TỔNG THỰC NHẬN (Secondary pass cho các NV đặc biệt) ---
      rows.forEach(r => {
        const nvIdLower = String(r.nvId || "").trim().toLowerCase();
        if (nvIdLower === "ngô tuấn anh") {
          r.tong_thuc_nhan = Math.round(r.tong_tien_thuong / 2);
        } else if (nvIdLower === "vũ công tâm") {
          const nta = rows.find(x => x.thang === r.thang && String(x.nvId || "").trim().toLowerCase() === "ngô tuấn anh");
          const nta_bonus_half = nta ? Math.round(nta.tong_tien_thuong / 2) : 0;
          r.tong_thuc_nhan = r.tong_tien_thuong + nta_bonus_half;
        } else {
          r.tong_thuc_nhan = r.tong_tien_thuong;
        }
      });

      // Sắp xếp: tháng mới nhất trước, sau đó theo id_nv
      rows.sort((a, b) => b.thang.localeCompare(a.thang) || a.nvId.localeCompare(b.nvId));

      // --- Lọc ---
      const uniqueMonths = [...new Set(rows.map(r => r.thang))].sort().reverse();
      const uniqueNvs = [...new Set(rows.map(r => r.nvId))].sort();

      const filtered = rows.filter(r => {
        if (window.thuongFilterMonth && r.thang !== window.thuongFilterMonth) return false;
        if (window.thuongFilterNv && r.nvId !== window.thuongFilterNv) return false;
        return true;
      });

      const totalThuong = filtered.reduce((s, r) => s + r.tong_tien_thuong, 0);
      const totalThucNhan = filtered.reduce((s, r) => s + r.tong_thuc_nhan, 0);
      const totalDs = filtered.reduce((s, r) => s + r.ds_chinh + r.ds_thuong, 0);

      // --- Debug info ---
      const dkData = (fullAppState.DK_THUONG || appState.DK_THUONG || []);
      const dkLoaiValues = [...new Set(dkData.map(r => JSON.stringify({ loai: r.loai, kieu: r.kieu })))];
      const spLoaiValues = [...new Set((appState.DH_CT || []).map(r => r.sp_chinh_thuong || "(trống)"))];

      // --- Render HTML ---
      container.innerHTML = `
        <style>
          .thuong-badge-full { background:#dcfce7; color:#16a34a; }
          .thuong-badge-partial { background:#fef9c3; color:#a16207; }
          .thuong-badge-none { background:#fee2e2; color:#dc2626; }
        </style>
        <div class="section-shell">
          <div class="section-header">
            <div class="section-title"><span class="title-dot"></span><span>THƯỞNG NHÂN VIÊN THEO THÁNG</span></div>
            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
              <div style="display:flex;align-items:center;background:#fff;border:1px solid var(--line);border-radius:8px;padding:0 10px;height:38px;">
                <label style="font-size:12px;color:var(--muted);font-weight:600;margin-right:8px;">THÁNG:</label>
                <select id="thuongMonthFilter" style="border:none;outline:none;font-size:13px;background:transparent;cursor:pointer;min-width:110px;">
                  <option value="">Tất cả</option>
                  ${uniqueMonths.map(m => `<option value="${safeText(m)}" ${window.thuongFilterMonth === m ? 'selected' : ''}>${safeText(m)}</option>`).join("")}
                </select>
              </div>
              <div style="display:flex;align-items:center;background:#fff;border:1px solid var(--line);border-radius:8px;padding:0 10px;height:38px;">
                <label style="font-size:12px;color:var(--muted);font-weight:600;margin-right:8px;">MÃ NV:</label>
                <select id="thuongNvFilter" style="border:none;outline:none;font-size:13px;background:transparent;cursor:pointer;min-width:110px;">
                  <option value="">Tất cả</option>
                  ${uniqueNvs.map(nv => `<option value="${safeText(nv)}" ${window.thuongFilterNv === nv ? 'selected' : ''}>${safeText(nv)}</option>`).join("")}
                </select>
              </div>
              <button class="btn btn-secondary" id="thuongResetBtn" style="height:38px;">Xóa lọc</button>
            </div>
          </div>

          <div class="panel" style="padding-top:16px;">
            ${canManageData() ? `
            <div style="margin-bottom:12px;padding:12px 14px;background:#fef3c7;border-radius:10px;border:1px solid #fde68a;font-size:12px;color:#92400e;line-height:1.6;">
              <div style="margin-bottom:6px;">
                <strong>Quy tắc thưởng theo tỉ lệ thu nợ:</strong><br/>
                ❌ <strong>&lt;50%</strong> → Không thưởng | 
                ⚠️ <strong>50–89%</strong> → Thưởng × tỉ lệ thu nợ | 
                ✅ <strong>≥90%</strong> → Hưởng 100% thưởng
              </div>
              <div style="border-top:1px dashed rgba(146, 64, 14, 0.2); padding-top:6px;">
                <strong>Ghi chú áp dụng Tỉ lệ:</strong><br/>
                • <strong>Đoàn Văn Quang, Trần Doãn Sáng:</strong> Dùng TỈ LỆ THÁNG NÀY (Thu tháng này / Phát sinh tháng này).<br/>
                • <strong>Ngô Tuấn Anh, Vũ Công Tâm:</strong> Dùng TỈ LỆ THÁNG TRC (Thu tháng này / Phát sinh tháng trước).<br/>
                <span style="font-style:italic; opacity:0.8;">* Ngô Tuấn Anh chia 50% tiền thưởng cho Vũ Công Tâm. Cột TỔNG THỰC NHẬN thể hiện số tiền cuối cùng.</span>
              </div>
            </div>` : ""}
            <div class="table-wrap" style="max-height:calc(100vh - 400px);overflow:auto;">
              <table style="min-width:1200px;border-collapse:separate;border-spacing:0;">
                <thead style="position:sticky;top:0;z-index:10;background:#f8fafc;box-shadow:0 1px 0 var(--line);">
                  <tr>
                    <th style="width:110px;">THÁNG</th>
                    <th style="width:180px;">ID NV</th>
                    <th style="text-align:right;">DS SP CHÍNH</th>
                    <th style="text-align:right;">DS SP THƯỜNG</th>
                    <th style="text-align:right;">THƯỞNG SP CHÍNH</th>
                    <th style="text-align:right;">THƯỞNG SP THƯỜNG</th>
                    <th style="text-align:right;">THƯỞNG DOANH SỐ</th>
                    <th style="text-align:right;width:130px;">TỈ LỆ THU NỢ THÁNG TRC</th>
                    <th style="text-align:right;width:130px;">TỈ LỆ THÁNG NÀY</th>
                    <th style="text-align:right;background:#fff7ed;font-weight:700;">TỔNG TIỀN THƯỞNG</th>
                    <th style="text-align:right;background:#f0fdf4;font-weight:700;">TỔNG THỰC NHẬN</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered.length ? filtered.map(r => {
        const tiLeStr = r.ti_le_thu_no.toFixed(0) + "%";
        let tiLeBadge, tiLeBg;
        if (r.ti_le_thu_no >= 90) { tiLeBadge = "thuong-badge-full"; tiLeBg = "#f0fdf4"; }
        else if (r.ti_le_thu_no >= 50) { tiLeBadge = "thuong-badge-partial"; tiLeBg = "#fefce8"; }
        else { tiLeBadge = "thuong-badge-none"; tiLeBg = "#fff1f2"; }

        const tiLeStrTrc = r.ti_le_thu_no_trc.toFixed(0) + "%";
        let tiLeBadgeTrc;
        if (r.ti_le_thu_no_trc >= 90) tiLeBadgeTrc = "thuong-badge-full";
        else if (r.ti_le_thu_no_trc >= 50) tiLeBadgeTrc = "thuong-badge-partial";
        else tiLeBadgeTrc = "thuong-badge-none";

        return `
                    <tr>
                      <td style="font-weight:600;">${safeText(r.thang)}</td>
                      <td class="mono" style="font-weight:600;color:var(--brand);">${safeText(r.nvId)}</td>
                      <td style="text-align:right;">${money(r.ds_chinh)}</td>
                      <td style="text-align:right;">${money(r.ds_thuong)}</td>
                      <td style="text-align:right;color:#2563eb;">${money(r.thuong_sp_chinh)}</td>
                      <td style="text-align:right;color:#7c3aed;">${money(r.thuong_sp_thuong)}</td>
                      <td style="text-align:right;font-weight:700;">${money(r.thuong_doanh_so)}</td>
                      <td style="text-align:right;">
                        <span class="badge ${tiLeBadgeTrc}" style="font-size:12px;">${tiLeStrTrc}</span>
                      </td>
                      <td style="text-align:right;">
                        <span class="badge ${tiLeBadge}" style="font-size:12px;">${tiLeStr}</span>
                      </td>
                      <td style="text-align:right;font-weight:700;background:${tiLeBg};">${money(r.tong_tien_thuong)}</td>
                      <td style="text-align:right;font-weight:800;background:#f0fdf4;color:#16a34a;">${money(r.tong_thuc_nhan)}</td>
                    </tr>`;
      }).join("") : '<tr><td colspan="11" class="empty">Không có dữ liệu thưởng. Vui lòng kiểm tra dữ liệu DH_CT và DK_THUONG.</td></tr>'}
                </tbody>
                ${filtered.length ? `<tfoot style="background:#f8fafc;font-weight:700;position:sticky;bottom:0;">
                  <tr>
                    <td colspan="2" style="text-align:right;color:var(--muted);">TỔNG CỘNG:</td>
                    <td style="text-align:right;">${money(filtered.reduce((s, r) => s + r.ds_chinh, 0))}</td>
                    <td style="text-align:right;">${money(filtered.reduce((s, r) => s + r.ds_thuong, 0))}</td>
                    <td style="text-align:right;color:#2563eb;">${money(filtered.reduce((s, r) => s + r.thuong_sp_chinh, 0))}</td>
                    <td style="text-align:right;color:#7c3aed;">${money(filtered.reduce((s, r) => s + r.thuong_sp_thuong, 0))}</td>
                    <td style="text-align:right;">${money(filtered.reduce((s, r) => s + r.thuong_doanh_so, 0))}</td>
                    <td></td>
                    <td></td>
                    <td style="text-align:right;color:#e11d48;background:#fff7ed;">${money(totalThuong)}</td>
                    <td style="text-align:right;color:#16a34a;background:#f0fdf4;">${money(totalThucNhan)}</td>
                  </tr>
                </tfoot>` : ""}
              </table>
            </div>
            <div style="margin-top:12px;font-size:13px;color:var(--muted);display:flex;justify-content:space-between;align-items:center;">
              <span>Hiển thị <strong>${filtered.length}</strong> dòng kết quả.</span>
              <span style="font-style:italic;">* Dữ liệu tính từ DH_CT (doanh số) + CONG_NO (thu nợ) + DK_THUONG (điều kiện).</span>
            </div>
          </div>
          <div style="margin:12px 16px 16px;padding:12px 14px;background:#f1f5f9;border-radius:10px;border:1px solid #cbd5e1;font-size:12px;font-family:Consolas,monospace;">
            <strong style="color:#334155;font-size:11px;text-transform:uppercase;letter-spacing:.04em;">🔍 DEBUG – Trạng thái dữ liệu</strong>
            <div style="margin-top:8px;display:grid;gap:4px;">
              <div><b>DK_THUONG:</b> <span style="color:${dkData.length ? '#16a34a' : '#dc2626'}">${dkData.length} rule đã tải</span>
                ${dkData.length ? `<span style="color:#64748b"> | loai+kieu: ${dkLoaiValues.map(v => `<code style="background:#e2e8f0;padding:1px 4px;border-radius:3px;">${safeText(v)}</code>`).join(" ")}</span>` : '<span style="color:#dc2626"> ← Chưa có dữ liệu trong sheet DK_THUONG!</span>'}</div>
              <div><b>DH_CT sp_chinh_thuong:</b> ${spLoaiValues.map(v => `<code style="background:#e2e8f0;padding:1px 4px;border-radius:3px;">${safeText(v)}</code>`).join(" ")} <span style="color:#94a3b8">(code nhận: "chính"/"chinh" và "thường"/"thuong")</span></div>
            </div>
          </div>
        </div>
      `;

      // Event listeners
      document.getElementById("thuongMonthFilter").addEventListener("change", e => { window.thuongFilterMonth = e.target.value; renderThuong(); });
      document.getElementById("thuongNvFilter").addEventListener("change", e => { window.thuongFilterNv = e.target.value; renderThuong(); });
      document.getElementById("thuongResetBtn").addEventListener("click", () => { window.thuongFilterMonth = ""; window.thuongFilterNv = ""; renderThuong(); });
    }
    function renderTiTrong() {
      const container = document.getElementById("ti_trong");
      if (!container) return;
      if (window.tiTrongKhPage === undefined) window.tiTrongKhPage = 1;

      const isAllowedNcc = (ncc) => {
        const n = String(ncc || "").trim().toLowerCase();
        return n === "lock&king" || n === "takin";
      };

      // 1. Tính Doanh thu toàn công ty (Chỉ Lock&king và Takin)
      const ds_tong = appState.DH_CT
        .filter(row => isAllowedNcc(row.ncc))
        .reduce((sum, row) => sum + Number(row.thanh_tien || 0), 0);

      // 2. Tính Doanh thu từng khách hàng (Chỉ Lock&king và Takin)
      const ds_kh_map = {};
      appState.DH_CT
        .filter(row => isAllowedNcc(row.ncc))
        .forEach(row => {
          const npp = String(row.npp || "").trim();
          if (!npp) return;
          ds_kh_map[npp] = (ds_kh_map[npp] || 0) + Number(row.thanh_tien || 0);
        });

      // 3. Lấy danh sách unique cho filter
      const uniqueNvs = [...new Set(appState.KHACH_HANG.map(kh => kh.nv_quan_ly).filter(Boolean))].sort();
      const uniqueKenhs = [...new Set(appState.KHACH_HANG.map(kh => kh.kenh).filter(Boolean))].sort();

      // 4. Chuẩn bị dữ liệu hiển thị (có lọc)
      let rows = appState.KHACH_HANG.map(kh => {
        const doanh_thu = ds_kh_map[kh.id] || 0;
        const ti_trong = ds_tong > 0 ? (doanh_thu / ds_tong) : 0;
        const tt_value = parseLooseNumber(kh.tt);
        const kpi_2026 = Math.round(ti_trong * tt_value);
        const kpi_thang_2026 = Math.round(kpi_2026 / 12);

        return {
          id: kh.id,
          ten_kh: kh.ten_kh,
          nv_quan_ly: kh.nv_quan_ly,
          kenh: kh.kenh,
          doanh_thu,
          ti_trong,
          kpi_2026,
          kpi_thang_2026
        };
      });

      // Áp dụng bộ lọc
      rows = rows.filter(r => {
        if (window.tiTrongFilterKh && !(`${r.id} ${r.ten_kh}`).toLowerCase().includes(window.tiTrongFilterKh.toLowerCase())) return false;
        if (window.tiTrongFilterNv && r.nv_quan_ly !== window.tiTrongFilterNv) return false;
        if (window.tiTrongFilterKenh && r.kenh !== window.tiTrongFilterKenh) return false;
        return true;
      });

      // 5. Sắp xếp theo Doanh thu giảm dần
      rows.sort((a, b) => b.doanh_thu - a.doanh_thu);

      const tiTrongPageSize = 50;
      const tiTrongTotalRows = rows.length;
      const tiTrongTotalPages = Math.ceil(tiTrongTotalRows / tiTrongPageSize) || 1;
      if (window.tiTrongKhPage > tiTrongTotalPages) window.tiTrongKhPage = tiTrongTotalPages;
      if (window.tiTrongKhPage < 1) window.tiTrongKhPage = 1;
      const tiTrongStartIdx = (window.tiTrongKhPage - 1) * tiTrongPageSize;
      const tiTrongPageRows = rows.slice(tiTrongStartIdx, tiTrongStartIdx + tiTrongPageSize);

      // 5.1 Tính Tổng doanh thu theo lọc
      const ds_loc = rows.reduce((sum, r) => sum + r.doanh_thu, 0);

      // 5.2 Tính Tổng hợp theo Nhân viên (Dựa trên danh sách đã lọc)
      const nv_map = {};
      rows.forEach(r => {
        const nv = r.nv_quan_ly || "Chưa phân công";
        if (!nv_map[nv]) nv_map[nv] = { nv, ds: 0, tt_tong: 0, kpi: 0, kpi_thang: 0 };
        nv_map[nv].ds += r.doanh_thu;
        nv_map[nv].tt_tong += r.ti_trong;
        nv_map[nv].kpi += r.kpi_2026;
        nv_map[nv].kpi_thang += r.kpi_thang_2026;
      });

      const nv_summary = Object.values(nv_map).map(s => {
        const ds_con_thieu = s.kpi - s.ds;
        return {
          ...s,
          ds_con_thieu
        };
      }).sort((a, b) => b.ds - a.ds);

      // 5.3 Tính Tổng cộng của tất cả dựa trên lọc
      const tong_ds_loc = rows.reduce((sum, r) => sum + r.doanh_thu, 0);
      const tong_kpi_loc = rows.reduce((sum, r) => sum + r.kpi_2026, 0);
      const ty_le_dat_tong = tong_kpi_loc > 0 ? (tong_ds_loc / tong_kpi_loc) : 0;
      const ty_le_con_tong = 1 - ty_le_dat_tong;
      const tong_thieu_loc = tong_kpi_loc - tong_ds_loc;

      // 6. Render HTML
      container.innerHTML = `
        <style>
          .ti-trong-dropdown { position:relative; min-width:180px; }
          .ti-trong-dropdown input { width:100%; border:none; outline:none; font-size:13px; background:transparent; padding:0; height:100%; }
          .ti-trong-menu { position:absolute; top:calc(100% + 8px); left:-10px; right:-10px; background:#fff; border:1px solid var(--line); border-radius:8px; overflow-y:auto; z-index:1000; display:none; box-shadow:0 8px 24px rgba(0,0,0,0.12); max-height:280px; }
          .ti-trong-menu.show { display:block; }
          .ti-trong-item { padding:10px 14px; cursor:pointer; font-size:13px; border-bottom:1px solid #f1f5f9; transition:background 0.1s; display:flex; flex-direction:column; gap:2px; }
          .ti-trong-item:last-child { border-bottom:none; }
          .ti-trong-item:hover { background:var(--brand-soft); }
          .ti-trong-item b { color:var(--brand); font-family:var(--mono); font-size:12px; }
          .summary-card-wrap { display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:20px; }
          .summary-card-inner { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 12px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .summary-title { font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        </style>
        <div class="section-shell">
          <div class="section-header">
            <div class="section-title"><span class="title-dot"></span><span>PHÂN TÍCH TỈ TRỌNG DOANH THU</span></div>
            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
              <div class="ti-trong-dropdown" id="tiTrongKhBox" style="display:flex;align-items:center;background:#fff;border:1px solid var(--line);border-radius:8px;padding:0 10px;height:38px; min-width:200px;">
                <label style="font-size:12px;color:var(--muted);font-weight:600;margin-right:8px;">KHÁCH HÀNG:</label>
                <input type="text" id="tiTrongKhFilter" placeholder="Gõ để tìm..." value="${safeText(window.tiTrongFilterKhText || "")}" autocomplete="off" />
                <span id="tiTrongKhClear" style="font-size:16px; cursor:pointer; color:#999; margin-left:5px; display:${window.tiTrongFilterKh ? 'block' : 'none'};">&times;</span>
                <div class="ti-trong-menu" id="tiTrongKhMenu"></div>
              </div>
              <div style="display:flex;align-items:center;background:#fff;border:1px solid var(--line);border-radius:8px;padding:0 10px;height:38px;">
                <label style="font-size:12px;color:var(--muted);font-weight:600;margin-right:8px;">NV QUẢN LÝ:</label>
                <select id="tiTrongNvFilter" style="border:none;outline:none;font-size:13px;background:transparent;cursor:pointer;min-width:110px;">
                  <option value="">Tất cả</option>
                  ${uniqueNvs.map(nv => `<option value="${safeText(nv)}" ${window.tiTrongFilterNv === nv ? 'selected' : ''}>${safeText(nv)}</option>`).join("")}
                </select>
              </div>
              <div style="display:flex;align-items:center;background:#fff;border:1px solid var(--line);border-radius:8px;padding:0 10px;height:38px;">
                <label style="font-size:12px;color:var(--muted);font-weight:600;margin-right:8px;">KÊNH:</label>
                <select id="tiTrongKenhFilter" style="border:none;outline:none;font-size:13px;background:transparent;cursor:pointer;min-width:90px;">
                  <option value="">Tất cả</option>
                  ${uniqueKenhs.map(k => `<option value="${safeText(k)}" ${window.tiTrongFilterKenh === k ? 'selected' : ''}>${safeText(k)}</option>`).join("")}
                </select>
              </div>
              <button class="btn btn-secondary" id="tiTrongResetBtn" style="height:38px;">Xóa lọc</button>
            </div>
          </div>

          <div class="panel">
            <!-- TỔNG HỢP CARDS TẤT CẢ -->
            <div class="summary-card-wrap">
              <div class="card" style="padding:16px; background:#f0fdf4; border:1px solid #bbf7d0;">
                <small style="color:#16a34a; font-weight:700; text-transform:uppercase; font-size:11px;">Tổng Doanh thu theo lọc</small>
                <strong style="display:block; font-size:20px; margin-top:4px; color:#16a34a;">${money(tong_ds_loc)}</strong>
              </div>
              <div class="card" style="padding:16px; background:#fff7ed; border:1px solid #fed7aa;">
                <small style="color:#c2410c; font-weight:700; text-transform:uppercase; font-size:11px;">Tỉ lệ đạt</small>
                <strong style="display:block; font-size:20px; margin-top:4px; color:#ea580c;">${(ty_le_dat_tong * 100).toFixed(1)}%</strong>
              </div>
              <div class="card" style="padding:16px; background:#faf5ff; border:1px solid #e9d5ff;">
                <small style="color:#7e22ce; font-weight:700; text-transform:uppercase; font-size:11px;">Tỉ lệ còn lại</small>
                <strong style="display:block; font-size:20px; margin-top:4px; color:#9333ea;">${(Math.max(0, ty_le_con_tong) * 100).toFixed(1)}%</strong>
              </div>
              <div class="card" style="padding:16px; background:#fff1f2; border:1px solid #fecdd3;">
                <small style="color:#be123c; font-weight:700; text-transform:uppercase; font-size:11px;">Tổng DT còn thiếu</small>
                <strong style="display:block; font-size:20px; margin-top:4px; color:#e11d48;">${money(tong_thieu_loc)}</strong>
              </div>
            </div>

            <div style="background:#fff7ed; border:1px solid #ffedd5; padding:10px 14px; border-radius:10px; font-size:12px; color:#9a3412; margin-bottom:20px;">
              <strong>Điều kiện tính toán:</strong> Chỉ tính doanh thu của các đơn hàng có Nhà cung cấp (NCC) là <strong>Lock&king</strong> hoặc <strong>Takin</strong>.
            </div>

            <!-- BẢNG TỔNG HỢP THEO NHÂN VIÊN -->
            <div class="summary-card-inner" style="margin-bottom:24px;">
              <div class="summary-title"><div style="width:4px;height:14px;background:#6366f1;border-radius:2px;"></div>TỔNG HỢP THEO NHÂN VIÊN (KPI 2026)</div>
              <div class="table-wrap">
                <table style="font-size:12px; border-collapse: collapse;">
                  <thead>
                    <tr style="background:#f8fafc; border-bottom: 2px solid var(--line);">
                      <th style="padding:10px 8px;">NHÂN VIÊN QUẢN LÝ</th>
                      <th style="text-align:right; padding:10px 8px;">DOANH THU ĐẠT</th>
                      <th style="text-align:right; padding:10px 8px;">TỈ TRỌNG KPI (%)</th>
                      <th style="text-align:right; padding:10px 8px;">KPI NĂM 2026</th>
                      <th style="text-align:right; padding:10px 8px;">KPI TB THÁNG</th>
                      <th style="text-align:right; padding:10px 8px; color:#ef4444;">D.THU CÒN THIẾU</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${nv_summary.map(s => `
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="font-weight:700; color:#475569; padding:10px 8px;">${safeText(s.nv)}</td>
                        <td style="text-align:right; font-weight:600; padding:10px 8px;">${money(s.ds)}</td>
                        <td style="text-align:right; color:#6366f1; font-weight:700; padding:10px 8px;">${(s.tt_tong * 100).toFixed(2)}%</td>
                        <td style="text-align:right; font-weight:600; padding:10px 8px;">${money(s.kpi)}</td>
                        <td style="text-align:right; font-weight:600; padding:10px 8px;">${money(s.kpi_thang)}</td>
                        <td style="text-align:right; color:${s.ds_con_thieu > 0 ? '#ef4444' : '#16a34a'}; font-weight:700; padding:10px 8px;">${money(s.ds_con_thieu)}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- BẢNG CHI TIẾT KHÁCH HÀNG -->
            <div class="summary-title" style="margin-left:4px;"><div style="width:4px;height:14px;background:#00b894;border-radius:2px;"></div>CHI TIẾT THEO KHÁCH HÀNG</div>
            <div class="table-wrap" style="max-height:calc(100vh - 450px); overflow:auto;">
              <table style="min-width:1200px; border-collapse:separate; border-spacing:0;">
                <thead style="position:sticky; top:0; z-index:10; background:#f8fafc; box-shadow:0 1px 0 var(--line);">
                  <tr>
                    <th style="width:100px;">ID</th>
                    <th>KHÁCH HÀNG</th>
                    <th style="width:180px;">NV QUẢN LÝ</th>
                    <th style="width:120px;">KÊNH</th>
                    <th style="text-align:right;">DOANH THU</th>
                    <th style="text-align:right;">TỈ TRỌNG (%)</th>
                    <th style="text-align:right;">KPI 2026</th>
                    <th style="text-align:right;">KPI THÁNG 2026</th>
                  </tr>
                </thead>
                <tbody>
                  ${tiTrongPageRows.map(r => `
                    <tr>
                      <td class="mono">${safeText(r.id)}</td>
                      <td style="font-weight:600;">${safeText(r.ten_kh)}</td>
                      <td>${safeText(r.nv_quan_ly)}</td>
                      <td><span class="badge" style="background:${r.kenh === 'ONLINE' ? '#e0f2fe' : '#f1f5f9'}; color:${r.kenh === 'ONLINE' ? '#0369a1' : '#475569'}">${safeText(r.kenh)}</span></td>
                      <td style="text-align:right; font-weight:600;">${money(r.doanh_thu)}</td>
                      <td style="text-align:right; color:var(--brand); font-weight:700;">${(r.ti_trong * 100).toFixed(2)}%</td>
                      <td style="text-align:right; color:#16a34a; font-weight:600;">${money(r.kpi_2026)}</td>
                      <td style="text-align:right; color:#16a34a; font-weight:600;">${money(r.kpi_thang_2026)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
            <div class="pagination" id="tiTrongKhPagination">
              ${tiTrongTotalRows <= tiTrongPageSize
                ? `<span style="font-size:13px; color:var(--muted)">Hiển thị ${tiTrongTotalRows} khách hàng.</span>`
                : `<span style="font-size:13px; color:var(--muted)">Trang ${window.tiTrongKhPage} / ${tiTrongTotalPages} (Tổng ${tiTrongTotalRows} khách hàng)</span><div class="pager">
                    <div class="page-box ${window.tiTrongKhPage === 1 ? 'disabled' : ''}" onclick="${window.tiTrongKhPage > 1 ? `window.setTiTrongKhPage(${window.tiTrongKhPage - 1})` : ''}">‹</div>
                    ${Array.from({ length: tiTrongTotalPages }, (_, i) => i + 1).map(p => {
                      if (p === 1 || p === tiTrongTotalPages || (p >= window.tiTrongKhPage - 2 && p <= window.tiTrongKhPage + 2)) {
                        return `<div class="page-box ${p === window.tiTrongKhPage ? 'active' : ''}" onclick="window.setTiTrongKhPage(${p})">${p}</div>`;
                      }
                      if (p === window.tiTrongKhPage - 3 || p === window.tiTrongKhPage + 3) return '<div class="page-box-dots">...</div>';
                      return "";
                    }).join("")}
                    <div class="page-box ${window.tiTrongKhPage === tiTrongTotalPages ? 'disabled' : ''}" onclick="${window.tiTrongKhPage < tiTrongTotalPages ? `window.setTiTrongKhPage(${window.tiTrongKhPage + 1})` : ''}">›</div>
                  </div>`}
            </div>
          </div>
        </div>
      `;

      // Event listeners & Dropdown logic
      window.setTiTrongKhPage = (page) => {
        window.tiTrongKhPage = page;
        renderTiTrong();
      };
      const resetTiTrongPage = () => { window.tiTrongKhPage = 1; };
      const khInput = document.getElementById("tiTrongKhFilter");
      const khMenu = document.getElementById("tiTrongKhMenu");
      const khClear = document.getElementById("tiTrongKhClear");

      const renderKhList = (query) => {
        const q = (query || "").toLowerCase().trim();
        const matches = appState.KHACH_HANG.filter(kh =>
          (`${kh.id} ${kh.ten_kh}`).toLowerCase().includes(q)
        ).slice(0, 50); // Giới hạn 50 gợi ý

        khMenu.innerHTML = matches.map(kh => `
          <div class="ti-trong-item" data-id="${safeText(kh.id)}" data-name="${safeText(kh.ten_kh)}">
            <b>${safeText(kh.id)}</b>
            <span>${safeText(kh.ten_kh)}</span>
          </div>
        `).join("");

        if (!matches.length) khMenu.innerHTML = '<div style="padding:10px; color:#aaa; font-size:12px">Không tìm thấy khách hàng.</div>';

        khMenu.querySelectorAll('.ti-trong-item').forEach(el => {
          el.onclick = () => {
            window.tiTrongFilterKh = el.dataset.id;
            window.tiTrongFilterKhText = el.dataset.name;
            resetTiTrongPage();
            khInput.value = el.dataset.name;
            khMenu.classList.remove("show");
            khClear.style.display = "block";
            renderTiTrong();
          };
        });
      };

      khInput.addEventListener("focus", () => { renderKhList(khInput.value); khMenu.classList.add("show"); });
      khInput.addEventListener("input", (e) => {
        renderKhList(e.target.value);
        khMenu.classList.add("show");
        if (!e.target.value) {
          window.tiTrongFilterKh = "";
          window.tiTrongFilterKhText = "";
          resetTiTrongPage();
          khClear.style.display = "none";
          renderTiTrong();
        }
      });

      khClear.addEventListener("click", () => {
        window.tiTrongFilterKh = "";
        window.tiTrongFilterKhText = "";
        resetTiTrongPage();
        khInput.value = "";
        khClear.style.display = "none";
        khMenu.classList.remove("show");
        renderTiTrong();
      });

      document.addEventListener("click", (e) => {
        if (!document.getElementById("tiTrongKhBox").contains(e.target)) khMenu.classList.remove("show");
      });

      document.getElementById("tiTrongNvFilter").addEventListener("change", e => { window.tiTrongFilterNv = e.target.value; resetTiTrongPage(); renderTiTrong(); });
      document.getElementById("tiTrongKenhFilter").addEventListener("change", e => { window.tiTrongFilterKenh = e.target.value; resetTiTrongPage(); renderTiTrong(); });
      document.getElementById("tiTrongResetBtn").addEventListener("click", () => {
        window.tiTrongFilterKh = "";
        window.tiTrongFilterKhText = "";
        window.tiTrongFilterNv = "";
        window.tiTrongFilterKenh = "";
        resetTiTrongPage();
        renderTiTrong();
      });
    }
    // ===== END MODULE TỈ TRỌNG =====

    function renderSync() {
      document.getElementById("sync").innerHTML = `
        <div class="layout-2">
          <div class="card panel">
            <h2>Trạng thái đồng bộ</h2>
            <p class="subtle">Dữ liệu đọc và ghi trực tiếp lên Google Sheets theo từng bảng tương ứng.</p>
            <div class="grid-2">
              <div class="field"><label>Spreadsheet ID</label><input value="${safeText(CONFIG.spreadsheetId)}" readonly /></div>
              <div class="field"><label>Đăng nhập từ sheet</label><input value="${safeText(CONFIG.authSheetName)}" readonly /></div>
              <div class="field full"><label>Thời điểm tải gần nhất</label><input value="${safeText(syncMeta.lastLoadedAt || "Chưa có")}" readonly /></div>
              <div class="field full"><label>Các sheet đang dùng</label><textarea readonly>${safeText(["DSNV"].concat(Object.keys(CONFIG.sheets)).join(", "))}</textarea></div>
            </div>
            <div class="button-row"><button class="btn btn-accent" type="button" id="syncNowBtn">Tải lại từ Google Sheets</button>${canManageData() ? '<button class="btn btn-warn" type="button" id="pushNowBtn">Ghi đè dữ liệu hiện tại lên Sheets</button>' : '<button class="btn btn-secondary" type="button" disabled>Chế độ user: chỉ xem dữ liệu</button>'}</div>
          </div>
          <div class="card panel">
            <h2>Dữ liệu JSON hiện tại</h2>
            <p class="subtle">Phần này để bạn kiểm tra nhanh dữ liệu sau khi ghép code.</p>
            <div class="field"><label>JSON hiện tại</label><textarea id="jsonDump" readonly>${safeText(JSON.stringify(appState, null, 2))}</textarea></div>
            <div class="button-row"><button class="btn btn-secondary" type="button" id="copyJsonBtn">Copy JSON</button></div>
          </div>
        </div>`;
      document.getElementById("syncNowBtn").addEventListener("click", async () => { await loadBusinessDataFromSheets(); showToast("Đã tải lại dữ liệu từ Google Sheets."); });
      if (document.getElementById("pushNowBtn")) document.getElementById("pushNowBtn").addEventListener("click", async () => { await persistAllSheets("Đã ghi dữ liệu hiện tại lên Google Sheets."); });
      document.getElementById("copyJsonBtn").addEventListener("click", async () => { await navigator.clipboard.writeText(JSON.stringify(appState, null, 2)); showToast("Đã copy JSON."); });
    }

    function renderAll() {
      if (activeTab === "orders") activeTab = "sales_dashboard";
      if (isAdminUser()) fullAppState = normalizeState(clone(appState));
      renderNav();
      renderActiveSection(activeTab);
      document.querySelectorAll(".section").forEach((section) => section.classList.toggle("active", section.id === activeTab));
      const meta = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];
      el.pageTitle.textContent = meta.label;
      el.pageSubtitle.textContent = meta.subtitle;
      if (typeof window.updateSalesDashSticky === "function") requestAnimationFrame(() => window.updateSalesDashSticky());
      cacheState();
      el.sheetSummary.textContent = `Đã tải lúc: ${syncMeta.lastLoadedAt || "chưa có"} | Sheets: ${Object.keys(CONFIG.sheets).join(", ")}`;
    }

    async function persistAllSheets(successMessage = "Đã lưu dữ liệu.") {
      if (!requireAdminAccess("Chỉ admin mới được ghi dữ liệu lên Google Sheets.")) return;
      fullAppState = normalizeState(fullAppState);
      recalcState(fullAppState);
      refreshVisibleState();
      const data = clone(fullAppState);
      for (const [sheetName, headers] of Object.entries(CONFIG.sheets)) {
        await clearSheet(sheetName);
        await updateSheet(sheetName, objectsToRows(data[sheetName], headers));
      }
      syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
      syncMeta.sourceSheets = Object.keys(CONFIG.sheets);
      renderAll();
      showToast(successMessage);
    }

    async function loadBusinessDataFromSheets() {
      const loaded = {};
      for (const [sheetName, headers] of Object.entries(CONFIG.sheets)) {
        try {
          const values = await fetchSheetValues(sheetName);
          loaded[sheetName] = rowsToObjects(values.length ? values : [headers], headers);
        } catch (err) {
          console.warn(`Bỏ qua lỗi tải sheet ${sheetName}:`, err);
          loaded[sheetName] = []; // Cho phép chạy tiếp nếu thiếu một số sheet
        }
      }
      applyAccessControlledState(loaded);
      syncMeta.lastLoadedAt = new Date().toLocaleString("vi-VN");
      syncMeta.sourceSheets = Object.keys(CONFIG.sheets);
      renderAll();
    }

    async function handleLoginSubmit(event) {
      event.preventDefault();
      const username = el.usernameInput.value.trim();
      const password = el.passwordInput.value.trim();
      if (!username || !password) return alert("Vui lòng nhập tài khoản và mật khẩu.");
      const user = usersData.find((item) => item.id === username && String(item.mk || "") === password);
      if (!user) return alert("Sai tài khoản hoặc mật khẩu.");
      currentUser = user;
      saveSession(user);
      applyUserToHeader();
      el.loginScreen.classList.add("hidden");
      el.mainApp.classList.remove("hidden");
      await loadBusinessDataFromSheets();
    }

    async function handleLogout() {
      currentUser = null;
      clearSession();
      el.mainApp.classList.add("hidden");
      el.loginScreen.classList.remove("hidden");
      el.usernameInput.value = "";
      el.passwordInput.value = "";
      applyUserToHeader();
      showToast("Đã đăng xuất.");
    }

    function bindStaticEvents() {
      el.loginForm.addEventListener("submit", handleLoginSubmit);
      el.logoutBtn.addEventListener("click", handleLogout);
      el.reloadSheetsBtn.addEventListener("click", async () => { await loadBusinessDataFromSheets(); showToast("Đã tải lại dữ liệu."); });
      el.closeModalBtn.addEventListener("click", closeModal);
      el.modalBackdrop.addEventListener("click", (event) => { if (event.target === el.modalBackdrop) closeModal(); });
      document.getElementById("closeDrawerBtn").addEventListener("click", closeDrawer);
      document.getElementById("drawerBackdrop").addEventListener("click", (event) => { if (event.target === document.getElementById("drawerBackdrop")) closeDrawer(); });
      initSidebarToggle();
    }

    async function bootstrap() {
      bindStaticEvents();
      loadCachedState();
      renderAll();
      try {
        await fetchAuthUsers();
      } catch (error) {
        console.error(error);
        alert("Không tải được danh sách đăng nhập từ Google Sheets.");
      }
      const session = loadSession();
      if (session) {
        currentUser = session;
        applyUserToHeader();
        el.loginScreen.classList.add("hidden");
        el.mainApp.classList.remove("hidden");
        try {
          await loadBusinessDataFromSheets();
        } catch (error) {
          console.error(error);
          showToast("Không tải được dữ liệu sheet, đang dùng dữ liệu cache.", true);
        }
      } else {
        applyUserToHeader();
      }
    }

    window.addEventListener("load", bootstrap);
