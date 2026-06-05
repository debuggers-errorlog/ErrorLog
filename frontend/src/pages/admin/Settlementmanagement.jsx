import { useState } from 'react';
import { Search, CheckCircle, DollarSign } from 'lucide-react';

const mockSettlements = [
    { id: 1, author: '박개발', subscriptionRevenue: 2400000, questionRevenue: 800000, platformFee: 320000, settlementAmount: 2880000, status: '대기', period: '2024-05' },
    { id: 2, author: '이영희', subscriptionRevenue: 1800000, questionRevenue: 600000, platformFee: 240000, settlementAmount: 2160000, status: '대기', period: '2024-05' },
    { id: 3, author: '정프론트', subscriptionRevenue: 1200000, questionRevenue: 400000, platformFee: 160000, settlementAmount: 1440000, status: '완료', period: '2024-05' },
    { id: 4, author: '최백엔드', subscriptionRevenue: 900000, questionRevenue: 300000, platformFee: 120000, settlementAmount: 1080000, status: '대기', period: '2024-05' },
    { id: 5, author: '강디자인', subscriptionRevenue: 600000, questionRevenue: 200000, platformFee: 80000, settlementAmount: 720000, status: '완료', period: '2024-05' },
];

export default function SettlementManagement() {
    const [settlements, setSettlements] = useState(mockSettlements);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('전체');

    const processSettlement = (settlementId) => {
        if (confirm('정산을 완료 처리하시겠습니까?')) {
            setSettlements(settlements.map(settlement =>
                settlement.id === settlementId
                    ? { ...settlement, status: '완료' }
                    : settlement
            ));
        }
    };

    const filteredSettlements = settlements.filter(settlement => {
        const matchesSearch = settlement.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === '전체' || settlement.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalSettlementAmount = filteredSettlements
        .filter(s => s.status === '대기')
        .reduce((sum, s) => sum + s.settlementAmount, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">정산 관리</h1>

            {/* 총 정산액 카드 */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-8 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-purple-100 mb-2">이번 달 총 정산 예정액</p>
                        <p className="text-4xl font-bold">₩{totalSettlementAmount.toLocaleString()}</p>
                        <p className="text-purple-100 mt-2">2024년 5월</p>
                    </div>
                    <div className="bg-purple-400 bg-opacity-30 p-4 rounded-lg">
                        <DollarSign className="w-10 h-10" />
                    </div>
                </div>
            </div>

            {/* 필터 및 검색 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="작성자 이름으로 검색..."
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
                        <option>대기</option>
                        <option>완료</option>
                    </select>
                </div>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구독 수익</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1:1 수익</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">플랫폼 수수료</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정산 예정액</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredSettlements.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            filteredSettlements.map((settlement) => (
                                <tr key={settlement.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{settlement.author}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">₩{settlement.subscriptionRevenue.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">₩{settlement.questionRevenue.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">₩{settlement.platformFee.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₩{settlement.settlementAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          settlement.status === '완료'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}>
                        {settlement.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {settlement.status === '대기' ? (
                                            <button
                                                onClick={() => processSettlement(settlement.id)}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                정산 처리
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
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
            총 {filteredSettlements.length}건의 정산
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