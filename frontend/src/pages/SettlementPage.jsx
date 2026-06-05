import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";
import { getSettlement } from '../api/paymentApi';

const TABS = [
  { label: "구독 수익", value: "SUBSCRIPTION" },
  { label: "질문글 수익", value: "QUESTION" },
  { label: "전체", value: null },
];

export function SettlementPage() {
  const navigate = useNavigate();
  const creatorId = 2; // jwt 연동 후 제거

  const [activeTab, setActiveTab] = useState("SUBSCRIPTION");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSettlement() {
      setLoading(true);
      try {
        const { data } = await getSettlement(creatorId, activeTab);
        setData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSettlement();
  }, [activeTab]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
  };

  const formatPrice = (price) => `₩${price.toLocaleString()}`;

  const totalLabel = activeTab === "SUBSCRIPTION" ? "총 구독자 수" : activeTab === "QUESTION" ? "총 질문 건수" : "총 결제 건수";

  return (
    <div style={styles.page}>
      {/* 헤더 */}
      <div style={styles.header}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>정산 관리</h1>
            <p style={styles.subtitle}>구독 및 질문글 수익을 확인하세요</p>
          </div>
          <button style={styles.closeBtn} onClick={() => navigate(-1)}>✕</button>
        </div>
      </div>

      {/* 탭 */}
      <div style={styles.tabRow}>
        {TABS.map((tab) => (
          <button
            key={tab.label}
            style={activeTab === tab.value ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.muted}>불러오는 중...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <>
          {/* 메트릭 카드 */}
          <div style={styles.metricGrid}>
            <div style={styles.metricCard}>
              <p style={styles.metricLabel}>이번 달 수익</p>
              <p style={styles.metricValue}>{formatPrice(data.thisMonthRevenue)}</p>
            </div>
            <div style={styles.metricCard}>
              <p style={styles.metricLabel}>총 누적 수익</p>
              <p style={styles.metricValue}>{formatPrice(data.totalRevenue)}</p>
            </div>
            <div style={styles.metricCard}>
              <p style={styles.metricLabel}>{totalLabel}</p>
              <p style={styles.metricValue}>{data.totalCount}건</p>
            </div>
          </div>

          {/* 결제 내역 */}
          <div style={styles.sectionTitle}>
            <Receipt size={16} color="#00d4ff" />
            결제 내역
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>결제자</th>
                  <th style={styles.th}>결제 유형</th>
                  <th style={styles.th}>금액</th>
                  <th style={styles.th}>결제일</th>
                </tr>
              </thead>
              <tbody>
                {data.details.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ ...styles.td, textAlign: "center", color: "#717182" }}>
                      결제 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  data.details.map((item) => (
                    <tr key={item.paymentId}>
                      <td style={styles.td}>{item.payerName}</td>
                      <td style={styles.td}>
                        {item.paymentType === "SUBSCRIPTION" ? "구독" : "질문글"}
                      </td>
                      <td style={{ ...styles.td, color: "#00d4ff", fontWeight: 500 }}>
                        {formatPrice(item.price)}
                      </td>
                      <td style={styles.td}>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "#0d0d14",
    minHeight: "100vh",
    padding: "2rem",
    color: "#e8e8f0",
    fontFamily: "inherit",
  },
  header: { marginBottom: "2rem" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: "22px", fontWeight: 500, color: "#ffffff", margin: 0 , textAlign: "left" },
  subtitle: { fontSize: "13px", color: "#717182", marginTop: "4px" },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#717182",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0.25rem",
    lineHeight: 1,
  },
  tabRow: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
  tab: {
    padding: "0.5rem 1.25rem",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "#717182",
  },
  tabActive: {
    padding: "0.5rem 1.25rem",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid #00d4ff",
    background: "#00d4ff",
    color: "#0d0d14",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  metricCard: {
    background: "#1a1a24",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "1.25rem",
  },
  metricLabel: { fontSize: "12px", color: "#717182", margin: "0 0 0.5rem" },
  metricValue: { fontSize: "24px", fontWeight: 500, color: "#00d4ff", margin: 0 },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#00d4ff",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  tableWrap: {
    background: "#1a1a24",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse",tableLayout: "fixed" },
  th: {
    fontSize: "12px",
    color: "#717182",
    fontWeight: 500,
    padding: "0.75rem 1.25rem",
    textAlign: "left",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    width: "25%",
  },
  td: {
    fontSize: "13px",
    padding: "0.875rem 1.25rem",
    textAlign: "left",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "#e8e8f0",
    width: "25%",
  },
  muted: { color: "#717182", fontSize: "14px" },
  error: { color: "#ff4d4d", fontSize: "14px" },
};
