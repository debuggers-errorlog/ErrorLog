import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { getReports, resolveReport, rejectReport } from '../../api/admin';

const SIZE = 10;

// ⚠️ status 값은 네 ReportStatus enum에 맞춰 확인! (resolve=process(), reject=reject())
const STATUS_PENDING = 'PENDING'; // 아직 처리 안 된 신고 (액션 버튼 노출 기준)
const STATUS_TO_LABEL = { PENDING: '대기', RESOLVED: '완료', REJECTED: '반려' };
const STATUS_TO_ENUM = { '대기': 'PENDING', '완료': 'RESOLVED', '반려': 'REJECTED' };
const STATUS_COLOR = {
    PENDING: 'bg-gray-100 text-gray-700',
    RESOLVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
};

// 신고 대상 유형
const TARGET_TO_LABEL = { USER: '사용자', POST: '게시글', COMMENT: '댓글' };
const TARGET_TO_ENUM = { '사용자': 'USER', '게시글': 'POST', '댓글': 'COMMENT' };
const TARGET_COLOR = {
    USER: 'bg-purple-100 text-purple-700',
    POST: 'bg-blue-100 text-blue-700',
    COMMENT: 'bg-green-100 text-green-700',
};

export default function ReportManagement() {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [filterType, setFilterType] = useState('전체');
    const [filterStatus, setFilterStatus] = useState('전체');
    const [loading, setLoading] = useState(false);

    const load = async (targetPage = 0) => {
        setLoading(true);
        try {
            const params = { page: targetPage, size: SIZE };
            if (filterType !== '전체') params.targetType = TARGET_TO_ENUM[filterType];
            if (filterStatus !== '전체') params.status = STATUS_TO_ENUM[filterStatus];
            const res = await getReports(params);
            setReports(res.data.content);
            setPage(res.data.number);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (err) {
            console.error('신고 목록 로드 실패', err);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { load(0); }, [filterType, filterStatus]);

    const handleResolve = async (r) => {
        if (!confirm('이 신고를 처리 완료할까요?')) return;
        try { await resolveReport(r.reportId); load(page); }
        catch (err) { console.error('처리 실패', err); }
    };

    const handleReject = async (r) => {
        if (!confirm('이 신고를 반려할까요?')) return;
        try { await rejectReport(r.reportId); load(page); }
        catch (err) { console.error('반려 실패', err); }
    };

    // 현재 페이지 기준 대기 건수
    const pendingCount = reports.filter(r => r.status === STATUS_PENDING).length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">신고 관리</h1>

            {/* 대기 건수 카드 (현재 페이지 기준) */}
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-orange-800 mb-2">처리 대기 중</p>
                        <p className="text-3xl font-bold text-orange-600">{pendingCount}건</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* 필터 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>전체</option>
                        <option>사용자</option>
                        <option>게시글</option>
                        <option>댓글</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>전체</option>
                        <option>대기</option>
                        <option>완료</option>
                        <option>반려</option>
                    </select>
                </div>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대상</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사유</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">접수일</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">불러오는 중...</td>
                            </tr>
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">검색 결과가 없습니다.</td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report.reportId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${TARGET_COLOR[report.targetType] ?? 'bg-gray-100 text-gray-700'}`}>
                        {TARGET_TO_LABEL[report.targetType] ?? report.targetType}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                                        {report.targetSummary ?? `#${report.targetId}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="font-medium text-gray-800">{report.reasonCategory}</span>
                                        {report.reasonDetail && <span className="block text-xs text-gray-500 mt-0.5">{report.reasonDetail}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {report.reporterNickname ?? `#${report.reporterId}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{report.createdAt?.slice(0, 10)}</td>
                                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[report.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_TO_LABEL[report.status] ?? report.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {report.status === STATUS_PENDING ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleResolve(report)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    처리
                                                </button>
                                                <button
                                                    onClick={() => handleReject(report)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    반려
                                                </button>
                                            </div>
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
            총 {totalElements}건의 신고
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