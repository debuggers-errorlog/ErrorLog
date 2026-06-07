import { useState, useEffect } from 'react';
import { Search, Eye, EyeOff, Trash2 } from 'lucide-react';
import { getPosts, hidePost, showPost, deletePost } from '../../api/admin';

const SIZE = 10;

// 백엔드 ENUM ↔ 화면 라벨 매핑
const STATUS_TO_ENUM = { '공개': 'ACTIVE', '숨김': 'HIDDEN' };
const STATUS_TO_LABEL = { ACTIVE: '공개', HIDDEN: '숨김', DELETED: '삭제됨' };
const VISIBILITY_TO_LABEL = { PUBLIC: '전체', SUBSCRIBERS: '구독자' };

export default function ContentManagement() {
    const [contents, setContents] = useState([]);
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
            if (searchTerm) params.title = searchTerm;                   // 검색어 → title 필터
            if (filterStatus !== '전체') params.status = STATUS_TO_ENUM[filterStatus];
            const res = await getPosts(params);
            setContents(res.data.content);
            setPage(res.data.number);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (err) {
            console.error('콘텐츠 목록 로드 실패', err);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { load(0); }, [filterStatus]);

    // 숨김/공개 토글: 현재 상태에 따라 hide/show 호출 후 새로고침
    const handleToggleVisibility = async (content) => {
        try {
            if (content.status === 'ACTIVE') await hidePost(content.id);
            else await showPost(content.id);
            load(page);
        } catch (err) {
            console.error('숨김/공개 변경 실패', err);
        }
    };

    const handleDelete = async (content) => {
        if (!confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) return;
        try {
            await deletePost(content.id);
            load(page);
        } catch (err) {
            console.error('삭제 실패', err);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">콘텐츠 관리</h1>

            {/* 필터 및 검색 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="제목으로 검색 후 Enter..."
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
                        <option>공개</option>
                        <option>숨김</option>
                    </select>
                </div>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공개범위</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">불러오는 중...</td>
                            </tr>
                        ) : contents.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">검색 결과가 없습니다.</td>
                            </tr>
                        ) : (
                            contents.map((content) => (
                                <tr key={content.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{content.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{content.authorNickname}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{VISIBILITY_TO_LABEL[content.visibility] ?? content.visibility}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{content.createdAt?.slice(0, 10)}</td>
                                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          content.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}>
                        {STATUS_TO_LABEL[content.status] ?? content.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleVisibility(content)}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                                    content.status === 'ACTIVE'
                                                        ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                            >
                                                {content.status === 'ACTIVE' ? (
                                                    <>
                                                        <EyeOff className="w-4 h-4" />
                                                        숨김
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-4 h-4" />
                                                        공개
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(content)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                삭제
                                            </button>
                                        </div>
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
            총 {totalElements}개의 콘텐츠
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