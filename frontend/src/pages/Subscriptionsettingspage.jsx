import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Save } from "lucide-react";
import { getSubscriptionSettings, createSubscriptionSettings, updateSubscriptionSettings }
    from '../api/subscriptionApi';

export function SubscriptionSettingsPage() {
    const navigate = useNavigate();
    const creatorId = 1; // jwt 연동후 제거

    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [isExisting, setIsExisting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data } = await getSubscriptionSettings(creatorId);
                setPrice(data.price);
                setDescription(data.description);
                setIsExisting(true);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const handleSubmit = async () => {
        if (!price || !description) {
            setMessage({ type: "error", text: "가격과 설명을 입력해주세요." });
            return;
        }
        try {
            if (isExisting) {
                await updateSubscriptionSettings(creatorId, { userId: creatorId, price: Number(price), description });
            } else {
                await createSubscriptionSettings({ userId: creatorId, price: Number(price), description });
            }
            setIsExisting(true);
            setMessage({ type: "success", text: "구독 플랜이 저장되었습니다!" });
        } catch {
            setMessage({ type: "error", text: "저장에 실패했습니다." });
        }
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <p style={styles.muted}>불러오는 중...</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* 헤더 */}
            <div style={styles.header}>
                <div style={styles.headerRow}>
                    <div>
                        <h1 style={styles.title}>구독 플랜 설정</h1>
                        <p style={styles.subtitle}>구독자에게 제공할 플랜을 설정하세요</p>
                    </div>
                    <button style={styles.closeBtn} onClick={() => navigate(-1)}>✕</button>
                </div>
            </div>

            {/* 폼 */}
            <div style={styles.card}>
                <div style={styles.sectionTitle}>
                    <Settings size={16} color="#00d4ff" />
                    플랜 정보
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>월 구독료 (원)</label>
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setPrice(val);
                        }}
                        placeholder="예: 3900"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>플랜 설명</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="구독자에게 제공하는 혜택을 설명해주세요"
                        style={styles.textarea}
                    />
                </div>

                {message && (
                    <div style={message.type === "success" ? styles.successMsg : styles.errorMsg}>
                        {message.text}
                    </div>
                )}

                <div style={styles.btnRow}>
                    <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
                        취소
                    </button>
                    <button style={styles.saveBtn} onClick={handleSubmit}>
                        <Save size={16} color="#0d0d14" />
                        {isExisting ? "수정하기" : "등록하기"}
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
        color: "#e8e8f0",
        fontFamily: "inherit",
    },
    header: { marginBottom: "2rem" },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    title: { fontSize: "22px", fontWeight: 500, color: "#ffffff", margin: 0 },
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
    card: {
        background: "#1a1a24",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "1.5rem",
        maxWidth: "600px",
    },
    sectionTitle: {
        fontSize: "15px",
        fontWeight: 500,
        color: "#00d4ff",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1.5rem",
    },
    formGroup: { marginBottom: "1.25rem" },
    label: {
        display: "block",
        fontSize: "13px",
        color: "#717182",
        marginBottom: "0.5rem",
    },
    input: {
        width: "100%",
        padding: "0.75rem 1rem",
        background: "#0d0d14",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        color: "#e8e8f0",
        fontSize: "14px",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "textfield",
    },
    textarea: {
        width: "100%",
        padding: "0.75rem 1rem",
        background: "#0d0d14",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        color: "#e8e8f0",
        fontSize: "14px",
        outline: "none",
        resize: "vertical",
        minHeight: "100px",
    },
    successMsg: {
        padding: "0.75rem 1rem",
        background: "rgba(0,212,255,0.1)",
        border: "1px solid rgba(0,212,255,0.3)",
        borderRadius: "8px",
        fontSize: "13px",
        color: "#00d4ff",
        marginBottom: "1rem",
    },
    errorMsg: {
        padding: "0.75rem 1rem",
        background: "rgba(255,77,77,0.1)",
        border: "1px solid rgba(255,77,77,0.3)",
        borderRadius: "8px",
        fontSize: "13px",
        color: "#ff4d4d",
        marginBottom: "1rem",
    },
    btnRow: { display: "flex", gap: "0.75rem", marginTop: "1.5rem" },
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
    saveBtn: {
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
    muted: { color: "#717182", fontSize: "14px" },
};
