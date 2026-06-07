import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getSubscriptionSummary, getSubscriptions } from '../../api/admin'; // ⚠️ 경로 확인

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
    { value: '', label: '전체' },
    { value: 'ACTIVE', label: '활성' },
    { value: 'EXPIRED', label: '만료' },
];

export default function SubscriptionManagement() {
    const [summary, setSummary] = useState(null);
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 요약 카드 (1회)
    useEffect(() => {
        getSubscriptionSummary().then((res) => setSummary(res.data)).catch(() => {});
    }, []);

    // 목록 조회
    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getSubscriptions({ page, size: PAGE_SIZE, search, status });
            setRows(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || '구독 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 페이지/상태 바뀌면 다시 조회
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, status]);

    // 검색: 1페이지로 돌리고 조회 (이미 0이면 직접 조회)
    const handleSearch = () => {
        if (page !== 0) setPage(0);
        else load();
    };

    const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('ko-KR') : '-');
    const isActive = (expiredAt) => new Date(expiredAt) > new Date();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">구독 관리</h1>

            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">활성 유료 구독자 수</p>
                        <p className="text-3xl font-bold text-green-600">{(summary.activeSubscribers ?? 0).toLocaleString()}명</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">만료된 구독</p>
                        <p className="text-3xl font-bold text-gray-600">{(summary.expiredSubscriptions ?? 0).toLocaleString()}건</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">추정 월 매출</p>
                        <p className="text-3xl font-bold text-blue-600">₩{(summary.estimatedRevenue ?? 0).toLocaleString()}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="구독자 또는 작성자로 검색..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(0); }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        검색
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구독자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대상 작성자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시작일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">월 구독료</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">불러오는 중...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-red-600">{error}</td></tr>
                        ) : rows.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">검색 결과가 없습니다.</td></tr>
                        ) : (
                            rows.map((row) => {
                                const active = isActive(row.expiredAt);
                                return (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.subscriberNickname ?? '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.creatorNickname ?? '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{fmtDate(row.startedAt)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.price != null ? `₩${row.price.toLocaleString()}` : '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {active ? '활성' : '만료'}
                        </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {totalPages > 0 ? `${page + 1} / ${totalPages} 페이지` : '0 페이지'}
          </span>
                    <div className="flex gap-2">
                        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40">
                            이전
                        </button>
                        <button onClick={() => setPage((p) => p + 1)} disabled={page + 1 >= totalPages}
                                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40">
                            다음
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}