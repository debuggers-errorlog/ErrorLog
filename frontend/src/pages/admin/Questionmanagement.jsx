import { useState, useEffect } from 'react';
import { Search, Clock, AlertCircle, XCircle } from 'lucide-react';
import { getQuestionRequests, cancelQuestionRequest } from '../../api/admin';

const SIZE = 10;
const DELAY_DAYS = 7; // 며칠 이상 PENDING이면 "지연"으로 볼지

// 백엔드 status(ENUM) ↔ 화면 라벨
const STATUS_TO_LABEL = { PENDING: '요청됨', ACCEPTED: '수락됨', REJECTED: '거절됨', CANCELLED: '취소됨' };
const STATUS_TO_ENUM = { '요청됨': 'PENDING', '수락됨': 'ACCEPTED', '거절됨': 'REJECTED', '취소됨': 'CANCELLED' };
const STATUS_COLOR = {
    PENDING: 'bg-gray-100 text-gray-700',
    ACCEPTED: 'bg-blue-100 text-blue-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

// 지연 = 아직 요청 상태(PENDING)인데 오래 묵은 것
const isDelayed = (q) => q.status === 'PENDING' && q.daysElapsed >= DELAY_DAYS;

export default function QuestionManagement() {
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('전체');
    const [loading, setLoading] = useState(false);

    const load = async (targetPage = 0) => {
        setLoading(true);
        try {
            const params = { page: targetPage, size: SIZE };
            if (searchTerm) params.mentorNickname = searchTerm;          // 검색 → 멘토 닉네임 (백엔드가 지원하는 필터)
            if (filterStatus !== '전체') params.status = STATUS_TO_ENUM[filterStatus];
            const res = await getQuestionRequests(params);
            setQuestions(res.data.content);
            setPage(res.data.number);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (err) {
            console.error('1:1 질문 목록 로드 실패', err);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { load(0); }, [filterStatus]);

    const handleCancel = async (q) => {
        if (!confirm('이 질문 요청을 취소 처리할까요?')) return;
        try {
            await cancelQuestionRequest(q.id);
            load(page);
        } catch (err) {
            console.error('취소 실패', err);
        }
    };

    // 통계 카드는 현재 불러온 페이지 기준 (전체 합계는 대시보드의 pendingQuestionRequests 몫)
    const inProgressCount = questions.filter(q => ['PENDING', 'ACCEPTED'].includes(q.status)).length;
    const delayedCount = questions.filter(isDelayed).length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">1:1 질문 관리</h1>

            {/* 통계 카드 (현재 페이지 기준) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">진행 중인 질문</p>
                            <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">답변 지연 건수</p>
                            <p className="text-3xl font-bold text-red-600">{delayedCount}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
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
                            placeholder="멘토 닉네임으로 검색 후 Enter..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') load(0); }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>전체</option>
                        <option>요청됨</option>
                        <option>수락됨</option>
                        <option>거절됨</option>
                        <option>취소됨</option>
                    </select>
                </div>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">질문 제목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">요청자(멘티)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">답변자(멘토)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">경과일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">불러오는 중...</td>
                            </tr>
                        ) : questions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">검색 결과가 없습니다.</td>
                            </tr>
                        ) : (
                            questions.map((q) => (
                                <tr key={q.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{q.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{q.menteeNickname}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{q.mentorNickname}</td>
                                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[q.status]}`}>
                        {STATUS_TO_LABEL[q.status] ?? q.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDelayed(q) ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {q.daysElapsed}일
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {['PENDING', 'ACCEPTED'].includes(q.status) ? (
                                            <button
                                                onClick={() => handleCancel(q)}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                취소
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
            총 {totalElements}건의 질문
          </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => load(page - 1)}
                            disabled={page <= 0}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            이전
                        </button>
                        <span className="text-sm text-gray-600">{page + 1} / {totalPages || 1}</span>
                        <button
                            onClick={() => load(page + 1)}
                            disabled={page >= totalPages - 1}
                            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}