import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    DollarSign,
    UserPlus,
    MessageCircleQuestion,
    Flag,
    Search,
    Bell,
    User,
} from 'lucide-react';

const menuItems = [
    { path: '/admin/dashboard',    label: '대시보드',      icon: LayoutDashboard },
    { path: '/admin/users',        label: '회원 관리',     icon: Users },
    { path: '/admin/content',      label: '콘텐츠 관리',   icon: FileText },
    { path: '/admin/settlement',   label: '정산 관리',     icon: DollarSign },
    { path: '/admin/subscription', label: '구독 관리',     icon: UserPlus },
    { path: '/admin/questions',    label: '1:1 질문 관리', icon: MessageCircleQuestion },
    { path: '/admin/reports',      label: '신고/문의 관리', icon: Flag },
];

export default function AdminLayout() {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* 사이드바 */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <h1 className="font-semibold text-xl text-gray-800">관리자 페이지</h1>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            {/* 메인 영역 */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* 상단 바 */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="검색..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-6">
                        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">관리자</span>
                        </button>
                    </div>
                </header>

                {/* 콘텐츠 영역 */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}