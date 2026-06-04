import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Star, FileText, Calendar, Heart, Bell, Unlock } from "lucide-react";

export function SubscriptionInfoPage() {
    const { creatorId } = useParams();
    const navigate = useNavigate();
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchInfo() {
            try {
                const res = await fetch(`/api/subscriptions/${creatorId}/info`);
                if (!res.ok) throw new Error("구독 정보를 불러올 수 없습니다.");
                const data = await res.json();
                setInfo(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchInfo();
    }, [creatorId]);

    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const formatDate = (d) =>
        `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.loadingText}>불러오는 중...</div>
            </div>
        );
    }

    if (error || !info) {
        return (
            <div style={styles.page}>
                <div style={styles.errorText}>{error ?? "오류가 발생했습니다."}</div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* 상단 헤더 */}
            <div style={styles.topHeader}>
                <h1 style={styles.topTitle}>크리에이터 구독</h1>
                <p style={styles.topSubtitle}>전문 지식을 지속적으로 받아보세요</p>
            </div>
            {/* 크리에이터 정보 */}
            <div style={styles.creatorHeader}>
                <div style={styles.creatorAvatar}>{info.creatorName[0]}</div>
                <div>
                    <p style={styles.creatorName}>{info.creatorName} 크리에이터</p>
                    <p style={styles.creatorCta}>구독 시작하기</p>
                </div>
            </div>

            {/* 가격 카드 */}
            <div style={styles.priceCard}>
                <p style={styles.priceLabel}>월 구독료</p>
                <div>
          <span style={styles.priceAmount}>
            ₩{info.price.toLocaleString()}
          </span>
                    <span style={styles.pricePeriod}> / 월</span>
                </div>
                <p style={styles.priceDesc}>{info.description}</p>
                <div style={styles.dateRange}>
                    <Calendar size={14} color="#717182" />
                    <span>
            {formatDate(today)} ~ {formatDate(nextMonth)} · 부가세 포함 금액
          </span>
                </div>
            </div>

            {/* 구독 혜택 */}
            <div style={styles.sectionTitle}>
                <Star size={16} color="#00d4ff" />
                구독 혜택
            </div>

            <div style={styles.benefitCard}>
                <div style={styles.benefitIcon}>
                    <Unlock size={16} color="#00d4ff" />
                </div>
                <span style={styles.benefitText}>모든 유료글 무제한 열람</span>
            </div>
            <div style={styles.benefitCard}>
                <div style={styles.benefitIcon}>
                    <Bell size={16} color="#00d4ff" />
                </div>
                <span style={styles.benefitText}>새 프리미엄 글 알림 수신</span>
            </div>

            {/* 프리미엄 콘텐츠 */}
            <div style={{ marginTop: "1.5rem" }}>
                <div style={styles.sectionTitle}>
                    <FileText size={16} color="#00d4ff" />
                    프리미엄 콘텐츠
                </div>
                <div style={styles.postCountBadge}>
                    <Lock size={12} color="#ffd700" />
                    총 {info.premiumPostCount}개의 프리미엄 글
                </div>
                {info.recentPremiumPosts.map((post) => (
                    <div key={post.id} style={styles.postItem}>
                        <span style={styles.postTitle}>{post.title}</span>
                        <div style={styles.postLock}>
                            <Lock size={13} color="#ffd700" />
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 버튼 */}
            <div style={styles.ctaSection}>
                <div style={styles.totalPrice}>
                    <span style={styles.totalLabel}>총 결제 금액</span>
                    <span style={styles.totalAmount}>
            ₩{info.price.toLocaleString()}
          </span>
                </div>
                <div style={styles.btnRow}>
                    <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
                        취소
                    </button>
                    <button
                        style={styles.ctaBtn}
                        onClick={() => navigate(`/subscriptions/${creatorId}/payment`)}
                    >
                        <Heart size={16} color="#0d0d14" />
                        구독 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        background: "#0d0d14",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "inherit",
        color: "#e8e8f0",
    },
    loadingText: { color: "#717182", fontSize: "14px" },
    errorText: { color: "#ff4d4d", fontSize: "14px" },
    creatorHeader: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "2rem",
    },
    creatorAvatar: {
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
    creatorName: { fontSize: "17px", fontWeight: 500, color: "#e8e8f0", margin: 0 },
    creatorCta: { fontSize: "17px", color: "#717182", margin: "2px 0 0",textAlign:"left" },
    priceCard: {
        background: "#1a1a24",
        border: "1px solid rgba(0,212,255,0.2)",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
    },
    priceLabel: { fontSize: "13px", color: "#717182", marginBottom: "0.5rem" },
    priceAmount: { fontSize: "36px", fontWeight: 500, color: "#00d4ff" },
    pricePeriod: { fontSize: "16px", color: "#717182" },
    priceDesc: { fontSize: "13px", color: "#a0a0b8", marginTop: "0.75rem" },
    dateRange: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        marginTop: "1rem",
        paddingTop: "1rem",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        fontSize: "13px",
        color: "#717182",
    },
    sectionTitle: {
        fontSize: "15px",
        fontWeight: 500,
        color: "#00d4ff",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1rem",
    },
    benefitCard: {
        background: "#1a1a24",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        marginBottom: "0.75rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
    },
    benefitIcon: {
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        background: "rgba(0,212,255,0.1)",
        border: "1px solid rgba(0,212,255,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    benefitText: { fontSize: "14px" },
    postCountBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.3rem 0.75rem",
        background: "rgba(255,215,0,0.1)",
        border: "1px solid rgba(255,215,0,0.3)",
        borderRadius: "20px",
        fontSize: "12px",
        color: "#ffd700",
        marginBottom: "1rem",
    },
    postItem: {
        background: "#1a1a24",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        marginBottom: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    postTitle: { fontSize: "14px", lineHeight: 1.4 },
    postLock: {
        width: "28px",
        height: "28px",
        borderRadius: "6px",
        background: "rgba(255,215,0,0.1)",
        border: "1px solid rgba(255,215,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginLeft: "1rem",
    },
    ctaSection: {
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.08)",
    },
    totalPrice: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
    },
    totalLabel: { fontSize: "14px", color: "#717182" },
    totalAmount: { fontSize: "20px", fontWeight: 500, color: "#e8e8f0" },
    btnRow: { display: "flex", gap: "0.75rem" },
    cancelBtn: {
        flex: 1,
        padding: "1rem",
        background: "#ffffff",
        color: "#0d0d14",
        border: "none",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: 500,
        cursor: "pointer",
    },
    ctaBtn: {
        flex: 1,
        padding: "1rem",
        background: "#00d4ff",
        color: "#0d0d14",
        border: "none",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
    },
    topHeader: {
        marginBottom: "2rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
    },
    topTitle: { fontSize: "22px", fontWeight: 500, color: "#ffffff", margin: 0 },
    topSubtitle: { fontSize: "13px", color: "#717182", marginTop: "6px" },
};
