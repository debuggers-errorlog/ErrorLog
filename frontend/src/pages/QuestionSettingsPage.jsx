import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** @deprecated 구독 플랜 설정 페이지로 통합됨 */
export function QuestionSettingsPage() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/subscription-settings', { replace: true });
    }, [navigate]);

    return null;
}
