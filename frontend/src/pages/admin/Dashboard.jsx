import { useState, useEffect } from 'react';
import { Users, DollarSign, MessageCircle, UserPlus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboard } from '../../api/admin';

const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-orange-100' },
};

export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        getDashboard()
            .then((res) => setData(res.data))
            .catch((err) => console.error('대시보드 로드 실패', err));
    }, []);

    if (!data) {
        return <p className="text-sm text-gray-500">불러오는 중...</p>;
    }

    // 백엔드 DashboardResponseDto의 실제 필드만 카드로 (없는 건 제외)
    const kpis = [
        { label: '총 회원수',        value: (data.totalMembers ?? 0).toLocaleString(),          icon: Users,         color: 'blue' },
        { label: '유료 구독자 수',   value: (data.activeSubscribers ?? 0).toLocaleString(),     icon: UserPlus,      color: 'green' },
        { label: '추정 월 매출',     value: `₩${(data.estimatedRevenue ?? 0).toLocaleString()}`, icon: DollarSign,    color: 'purple' },
        { label: '대기 중 1:1 질문', value: (data.pendingQuestionRequests ?? 0).toLocaleString(), icon: MessageCircle, color: 'orange' },
    ];

    const monthlyRevenue = data.monthlyRevenue ?? [];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">대시보드</h1>

            {/* KPI 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((item) => {
                    const Icon = item.icon;
                    const colors = colorMap[item.color];
                    return (
                        <div key={item.label} className={`${colors.bg} rounded-xl p-6 border border-gray-200`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                                    <p className={`text-2xl font-bold ${colors.text}`}>{item.value}</p>
                                </div>
                                <div className={`${colors.iconBg} p-3 rounded-lg`}>
                                    <Icon className={`w-6 h-6 ${colors.text}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 매출 추이 차트 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6">월별 매출 추이</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" tickFormatter={(value) => value.toLocaleString()} />
                        <Tooltip
                            formatter={(value) => [`₩${value.toLocaleString()}`, '매출']}
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}