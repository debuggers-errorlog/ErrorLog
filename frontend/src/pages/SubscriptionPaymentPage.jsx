import { useParams, useNavigate , useLocation } from "react-router-dom";
import { CreditCard, Shield, CheckCircle } from "lucide-react";
import { subscribe } from '../api/subscriptionApi';
import { cancelPayment } from '../api/paymentApi';

export function SubscriptionPaymentPage() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const expiredAt = location.state?.expiredAt;

  const handlePayment = async () => {
    try {
      await subscribe(1, Number(creatorId)); // JWT 연동 후 제거
      alert("구독 결제가 완료되었습니다!");
      navigate(`/creator/${creatorId}`); // 크리에이터 프로필 경로 확정 후 교체
    } catch {
      alert("결제에 실패했습니다.");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelPayment(1, Number(creatorId), Number(creatorId)); // JWT 연동 후 제거
    } catch (e) {
      console.error(e);
    } finally {
      alert("결제가 취소되었습니다.");
      navigate(`/creator/${creatorId}`); // 크리에이터 프로필 경로 확정 후 교체
    }
  };

  // expiredAt 있으면 만료일 기준, 없으면 오늘 기준
  const startDate = expiredAt ? new Date(expiredAt) : new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  const formatDate = (d) =>
      `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

  return (
      <div style={styles.page}>
        {/* 헤더 */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>결제하기</h2>
        </div>

        {/* 주문 정보 */}
        <div style={styles.orderCard}>
          <div style={styles.orderRow}>
            <span style={styles.orderLabel}>크리에이터</span>
            <span style={styles.orderValue}>김개발</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.orderRow}>
            <span style={styles.orderLabel}>구독 기간</span>
            <span style={styles.orderValue}>1개월</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.orderRow}>
            <span style={styles.orderLabel}>이용 기간</span>
            <span style={styles.orderValue}>
            {formatDate(startDate)} ~ {formatDate(endDate)}
          </span>
          </div>
        </div>

        {/* 총 결제 금액 */}
        <div style={styles.totalCard}>
          <span style={styles.totalLabel}>총 결제 금액</span>
          <span style={styles.totalAmount}>₩3,900</span>
          <p style={styles.vatText}>부가세 포함</p>
        </div>

        {/* 결제 수단 */}
        <div style={styles.sectionTitle}>결제 수단</div>
        <div style={styles.paymentMethod}>
          <div style={styles.methodLeft}>
            <div style={styles.radioActive} />
            <div style={styles.cardIcon}>
              <CreditCard size={18} color="#00d4ff" />
            </div>
            <div>
              <p style={styles.methodName}>신용카드</p>
              <p style={styles.methodDesc}>안전한 카드 결제</p>
            </div>
          </div>
          <CheckCircle size={18} color="#00d4ff" />
        </div>

        {/* 안내 문구 */}
        <div style={styles.noticeBox}>
          <Shield size={14} color="#717182" />
          <span style={styles.noticeText}>
          결제 버튼 클릭 시 PG사의 안전한 결제창으로 이동합니다
        </span>
        </div>

        {/* 버튼 */}
        <div style={styles.btnArea}>
          <div style={styles.btnRow}>
            <button style={styles.cancelBtn} onClick={handleCancel}>
              취소
            </button>
            <button style={styles.ctaBtn} onClick={handlePayment}>
              <CreditCard size={16} color="#0d0d14" />
              ₩3,900 결제하기
            </button>
          </div>
          <p style={styles.footerText}>구독 후 즉시 모든 프리미엄 콘텐츠에 접근할 수 있습니다</p>
        </div>
      </div>
  );
}

const styles = {
  page: {
    background: "#0d0d14",
    minHeight: "100vh",
    padding: "0",
    fontFamily: "inherit",
    color: "#e8e8f0",
  },
  header: {
    background: "#00d4ff",
    padding: "1.25rem 2rem",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: 500,
    color: "#0d0d14",
    margin: 0,
  },
  orderCard: {
    background: "#1a1a24",
    margin: "1.5rem",
    borderRadius: "12px",
    padding: "1.25rem",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0",
  },
  orderLabel: { fontSize: "14px", color: "#717182" },
  orderValue: { fontSize: "14px", color: "#e8e8f0" },
  divider: {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    margin: "0.25rem 0",
  },
  totalCard: {
    background: "rgba(0,212,255,0.08)",
    border: "1px solid rgba(0,212,255,0.2)",
    borderRadius: "12px",
    margin: "0 1.5rem 1.5rem",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  totalLabel: { fontSize: "13px", color: "#717182" },
  totalAmount: { fontSize: "32px", fontWeight: 500, color: "#00d4ff", marginTop: "0.25rem" },
  vatText: { fontSize: "12px", color: "#717182", margin: "0.25rem 0 0" },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#e8e8f0",
    padding: "0 1.5rem",
    marginBottom: "0.75rem",
  },
  paymentMethod: {
    background: "#1a1a24",
    border: "1px solid rgba(0,212,255,0.3)",
    borderRadius: "12px",
    margin: "0 1.5rem",
    padding: "1rem 1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  methodLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  radioActive: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "2px solid #00d4ff",
    background: "rgba(0,212,255,0.2)",
    flexShrink: 0,
  },
  cardIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "rgba(0,212,255,0.1)",
    border: "1px solid rgba(0,212,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  methodName: { fontSize: "14px", fontWeight: 500, margin: 0 },
  methodDesc: { fontSize: "12px", color: "#717182", margin: "2px 0 0" },
  noticeBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    margin: "1rem 1.5rem",
    padding: "0.75rem 1rem",
    background: "#1a1a24",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
  },
  noticeText: { fontSize: "12px", color: "#717182" },
  btnArea: {
    padding: "1.5rem",
    marginTop: "1rem",
  },
  btnRow: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
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
  footerText: {
    fontSize: "12px",
    color: "#717182",
    textAlign: "center",
    margin: 0,
  },
};
