import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck } from "lucide-react";
import { getSubscriptionList } from '../api/subscriptionApi';

export function SubscriptionManagePage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = 2; // JWT 연동 후 제거

  useEffect(() => {
    async function fetchList() {
      try {
        const { data } = await getSubscriptionList(userId);
        setData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
  };

  if (loading) return <div style={styles.page}><p style={styles.muted}>불러오는 중...</p></div>;
  if (error) return <div style={styles.page}><p style={styles.error}>{error}</p></div>;

  return (
      <div style={styles.page}>
        <div style={styles.content}>
          {/* 헤더 */}
          <div style={styles.header}>
            <div style={styles.headerRow}>
              <div>
                <h1 style={styles.title}>구독 관리</h1>
                <p style={styles.subtitle}>구독 중인 크리에이터와 구독자를 관리하세요</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button style={styles.settlementBtn} onClick={() => navigate("/subscription-settings")}>
                  구독 플랜 설정
                </button>
                <button style={styles.settlementBtn} onClick={() => navigate("/settlement")}>
                  정산 관리
                </button>
                <button style={styles.closeBtn} onClick={() => navigate(-1)}>✕</button>
              </div>
            </div>
          </div>

          {/* 그리드 */}
          <div style={styles.grid}>
            {/* 내가 구독중인 개발자 */}
            <div>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitleRow}>
                  <Users size={18} color="#e8e8f0" />
                  <span style={styles.sectionTitle}>내가 구독중인 개발자</span>
                  <span style={styles.badge}>{data.followingCount}</span>
                </div>
              </div>
              <div style={styles.list}>
                {data.following.length === 0 ? (
                    <p style={styles.muted}>구독중인 개발자가 없습니다.</p>
                ) : (
                    data.following.map((item) => (
                        <div key={item.creatorId} style={styles.card}>
                          <div style={styles.cardLeft}>
                            <div style={styles.avatar}>{item.creatorName[0]}</div>
                            <div>
                              <p style={styles.name}>{item.creatorName}</p>
                              <p style={styles.date}>구독 만료 날짜 : {formatDate(item.expiredAt)}</p>
                            </div>
                          </div>
                          <button
                              style={styles.renewBtn}
                              onClick={() => navigate(`/subscriptions/${item.creatorId}/payment`, {
                                state: { expiredAt: item.expiredAt }
                              })}
                          >
                            구독 연장하기
                          </button>
                        </div>
                    ))
                )}
              </div>
            </div>

            {/* 나를 구독하는 개발자 */}
            <div>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitleRow}>
                  <UserCheck size={18} color="#e8e8f0" />
                  <span style={styles.sectionTitle}>나를 구독하는 개발자</span>
                  <span style={styles.badge}>{data.followerCount}</span>
                </div>
              </div>
              <div style={styles.list}>
                {data.followers.length === 0 ? (
                    <p style={styles.muted}>구독자가 없습니다.</p>
                ) : (
                    data.followers.map((item) => (
                        <div key={item.subscriberId} style={styles.card}>
                          <div style={styles.cardLeft}>
                            <div style={styles.avatar}>{item.subscriberName[0]}</div>
                            <div>
                              <p style={styles.name}>{item.subscriberName}</p>
                              <p style={styles.date}>구독 시작 날짜 : {formatDate(item.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

const styles = {
  page: {
    background: "#0d0d14",
    minHeight: "100vh",
    width: "100%",
    padding: "2rem",
    color: "#e8e8f0",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  header: { marginBottom: "2rem" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: "22px", fontWeight: 500, margin: 0, color: "#ffffff" },
  subtitle: { fontSize: "13px", color: "#717182", marginTop: "4px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2rem",
  },
  sectionHeader: { marginBottom: "1rem" },
  sectionTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  sectionTitle: { fontSize: "16px", fontWeight: 500 },
  badge: {
    width: "22px",
    height: "22px",
    background: "#00d4ff",
    color: "#0d0d14",
    borderRadius: "50%",
    fontSize: "12px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  list: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  card: {
    background: "#1a1a24",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#00d4ff",
    color: "#0d0d14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: 500,
    flexShrink: 0,
  },
  name: { fontSize: "15px", fontWeight: 500, margin: 0 },
  date: { fontSize: "13px", color: "#717182", margin: "2px 0 0" },
  renewBtn: {
    padding: "0.5rem 1rem",
    background: "#00d4ff",
    color: "#0d0d14",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    flexShrink: 0,
  },
  settlementBtn: {
    padding: "0.5rem 1rem",
    background: "transparent",
    color: "#00d4ff",
    border: "1px solid rgba(0,212,255,0.3)",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#717182",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0.25rem",
    lineHeight: 1,
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  muted: { color: "#717182", fontSize: "14px" },
  error: { color: "#ff4d4d", fontSize: "14px" },
};
