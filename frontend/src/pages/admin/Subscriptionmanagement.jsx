import { useState } from 'react';
import { Search } from 'lucide-react';

const mockSubscriptions = [
    { id: 1, subscriber: '김철수', author: '박개발', startDate: '2024-01-15', status: '활성', monthlyFee: 9900 },
    { id: 2, subscriber: '이영희', author: '박개발', startDate: '2024-02-20', status: '활성', monthlyFee: 9900 },
    { id: 3, subscriber: '김철수', author: '정프론트', startDate: '2024-03-10', status: '활성', monthlyFee: 7900 },
    { id: 4, subscriber: '최디자인', author: '이영희', startDate: '2024-04-05', status: '해지', monthlyFee: 8900 },
    { id: 5, subscriber: '강개발', author: '박개발', startDate: '2024-05-12', status: '활성', monthlyFee: 9900 },
    { id: 6, subscriber: '박코더', author: '정프론트', startDate: '2024-04-20', status: '활성', monthlyFee: 7900 },
    { id: 7, subscriber: '송엔지니어', author: '이영희', startDate: '2024-03-15', status: '해지', monthlyFee: 8900 },
];

export default function SubscriptionManagement() {
    const [subscriptions] = useState(mockSubscriptions);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('전체');

    const filteredSubscriptions = subscriptions.filter(subscription => {
        const matchesSearch = subscription.subscriber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === '전체' || subscription.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const activeCount = subscriptions.filter(s => s.status === '활성').length;
    const canceledCount = subscriptions.filter(s => s.status === '해지').length;
    const totalRevenue = subscriptions
        .filter(s => s.status === '활성')
        .reduce((sum, s) => sum + s.monthlyFee, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">구독 관리</h1>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">활성 구독</p>
                    <p className="text-3xl font-bold text-green-600">{activeCount}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">해지된 구독</p>
                    <p className="text-3xl font-bold text-gray-600">{canceledCount}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">월 구독 수익</p>
                    <p className="text-3xl font-bold text-blue-600">₩{totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* 필터 및 검색 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="구독자 또는 작성자로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>전체</option>
                        <option>활성</option>
                        <option>해지</option>
                    </select>
                </div>
            </div>

            {/* 테이블 */}
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
                        {filteredSubscriptions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            filteredSubscriptions.map((subscription) => (
                                <tr key={subscription.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{subscription.subscriber}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{subscription.author}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{subscription.startDate}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">₩{subscription.monthlyFee.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.status === '활성'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}>
                        {subscription.status}
                      </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            총 {filteredSubscriptions.length}건의 구독
          </span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
                        <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">2</button>
                    </div>
                </div>
            </div>
        </div>
    );
}