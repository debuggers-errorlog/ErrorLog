import { useState, useEffect } from 'react';
import { Search, Ban, CheckCircle } from 'lucide-react';
import { getMembers, suspendMember, restoreMember } from '../../api/admin';

const SIZE = 10; // 한 페이지에 보여줄 회원 수 (백엔드 Pageable size)

// 백엔드 status(ENUM) ↔ 화면 라벨 매핑
const STATUS_TO_ENUM = { '정상': 'ACTIVE', '정지': 'SUSPENDED' };
const STATUS_TO_LABEL = { ACTIVE: '정상', SUSPENDED: '정지' };

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('전체');
    const [loading, setLoading] = useState(false);

    // 현재 검색어/필터로 특정 페이지를 서버에서 불러오기
    const load = async (targetPage = 0) => {
        setLoading(true);
        try {
            const params = { page: targetPage, size: SIZE };
            if (searchTerm) params.nickname = searchTerm;                 // 검색어 → nickname 필터
            if (filterStatus !== '전체') params.status = STATUS_TO_ENUM[filterStatus];
            const res = await getMembers(params);
            setUsers(res.data.content);            // Spring Page → 목록은 content
            setPage(res.data.number);              // 현재 페이지 (0-base)
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (err) {
            console.error('회원 목록 로드 실패', err);
        } finally {
            setLoading(false);
        }
    };

    // 최초 1회 + 상태 필터 바뀔 때 자동 로드
    // (load를 deps에 넣으면 매 렌더마다 재생성돼 무한루프라 의도적으로 제외)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { load(0); }, [filterStatus]);

    // 정지/해제: 서버에 PATCH 후 현재 페이지 새로고침
    const handleToggle = async (user) => {
        try {
            if (user.status === 'ACTIVE') await suspendMember(user.id);
            else await restoreMember(user.id);
            load(page);
        } catch (err) {
            console.error('상태 변경 실패', err);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">회원 관리</h1>

            {/* 필터 및 검색 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="닉네임으로 검색 후 Enter..."
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
                        <option>정상</option>
                        <option>정지</option>
                    </select>
                </div>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">불러오는 중...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">검색 결과가 없습니다.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.nickname}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.createdAt?.slice(0, 10)}</td>
                                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                      }`}>
                        {STATUS_TO_LABEL[user.status] ?? user.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => handleToggle(user)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                                user.status === 'ACTIVE'
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                            }`}
                                        >
                                            {user.status === 'ACTIVE' ? (
                                                <>
                                                    <Ban className="w-4 h-4" />
                                                    정지
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    해제
                                                </>
                                            )}
                                        </button>
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
            총 {totalElements}명의 회원
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