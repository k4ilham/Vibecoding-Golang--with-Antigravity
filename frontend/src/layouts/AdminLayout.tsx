import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    WashingMachine,
    History,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    X,
    UserCircle,
    Bell,
    Search,
    Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import UserPage from '@/pages/admin/UserPage';
import LayananPage from '@/pages/admin/LayananPage';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

// Content Components (Placeholders)
const DashboardContent = () => <div className="p-8"> <h2 className="text-3xl font-bold mb-4">Dashboard Overview</h2> <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {[1, 2, 3].map(i => <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm h-32 animate-pulse" />)} </div> </div>;
const Transactions = () => <div className="p-8"> <h2 className="text-3xl font-bold mb-4">Transactions History</h2> <div className="bg-white rounded-2xl border p-8 shadow-sm"> <p className="text-gray-500 italic">History loading...</p> </div> </div>;
const SettingsContent = () => <div className="p-8"> <h2 className="text-3xl font-bold mb-4">System Settings</h2> <div className="bg-white rounded-2xl border p-8 shadow-sm"> <p className="text-gray-500 italic">Settings panel...</p> </div> </div>;

const componentMap: Record<string, React.FC> = {
    DashboardContent,
    UserManagement: UserPage,
    Transactions,
    ServicesList: LayananPage,
    SettingsContent
};

const SidebarItem = ({ icon: Icon, label, id, component, active, collapsed }: any) => {
    const addTab = useAppStore(state => state.addTab);
    return (
        <button
            onClick={() => addTab({ id, title: label, component })}
            className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group shrink-0",
                active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:bg-blue-50 hover:text-primary"
            )}
        >
            <Icon size={22} className={cn("shrink-0", active ? "text-white" : "group-hover:scale-110 transition-transform")} />
            {!collapsed && <span className="font-semibold">{label}</span>}
        </button>
    );
};

export const AdminLayout = () => {
    const { user, tabs, activeTabId, isSidebarOpen, setSidebarOpen, setActiveTab, removeTab, logout } = useAppStore();
    const activeTab = tabs.find(t => t.id === activeTabId);
    const ActiveComponent = activeTab ? componentMap[activeTab.component] : DashboardContent;

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-white border-r border-gray-200 flex flex-col z-30 shadow-xl"
            >
                <div className="h-20 flex items-center px-6 justify-between shrink-0">
                    {isSidebarOpen ? (
                        <div className="flex items-center space-x-3">
                            <div className="bg-primary p-2 rounded-xl">
                                <WashingMachine className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Maulana Admin</span>
                        </div>
                    ) : (
                        <div className="bg-primary p-2 rounded-xl mx-auto">
                            <WashingMachine className="text-white" size={24} />
                        </div>
                    )}
                </div>

                <div className="px-4 py-6 space-y-2 flex-grow">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" component="DashboardContent" active={activeTabId === 'dashboard'} collapsed={!isSidebarOpen} />
                    <SidebarItem icon={Users} label="Users" id="users" component="UserManagement" active={activeTabId === 'users'} collapsed={!isSidebarOpen} />
                    <SidebarItem icon={History} label="Transactions" id="transactions" component="Transactions" active={activeTabId === 'transactions'} collapsed={!isSidebarOpen} />
                    <SidebarItem icon={WashingMachine} label="Services" id="services" component="ServicesList" active={activeTabId === 'services'} collapsed={!isSidebarOpen} />
                    <div className="pt-4 pb-2">
                        {!isSidebarOpen ? <Separator /> : <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">System</span>}
                    </div>
                    <SidebarItem icon={Settings} label="Settings" id="settings" component="SettingsContent" active={activeTabId === 'settings'} collapsed={!isSidebarOpen} />
                </div>

                <div className="p-4 border-t border-gray-100 mt-auto space-y-2">
                    <Link
                        to="/"
                        className={cn(
                            "w-full flex items-center space-x-3 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all group",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <Home size={22} className="group-hover:scale-110 transition-transform" />
                        {isSidebarOpen && <span className="font-semibold">View Website</span>}
                    </Link>
                    <button
                        onClick={logout}
                        className={cn(
                            "w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all group",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="font-semibold">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Wrapper */}
            <div className="flex flex-col flex-grow overflow-hidden relative">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 justify-between shrink-0 z-20">
                    <div className="flex items-center space-x-6">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500">
                            {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                        </Button>
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input className="bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Search anything..." />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="relative text-gray-500">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-3 px-2 hover:bg-gray-50 rounded-full transition-all">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-primary font-bold">
                                        {user?.name?.[0] || 'A'}
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <p className="text-sm font-bold text-blue-900 leading-none">{user?.name || 'Admin User'}</p>
                                        <p className="text-[10px] text-gray-500 uppercase mt-1">Super Admin</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-2xl border-none p-2 mt-2">
                                <DropdownMenuLabel className="font-bold px-3 py-2">Account Management</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer focus:bg-blue-50 text-blue-900 font-medium">
                                    <UserCircle className="mr-3 h-5 w-5 opacity-70" /> Profile Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer focus:bg-blue-50 text-blue-900 font-medium" onClick={() => setActiveTab('settings')}>
                                    <Settings className="mr-3 h-5 w-5 opacity-70" /> Change Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="rounded-lg px-3 py-2 cursor-pointer text-red-500 focus:bg-red-50 font-bold focus:text-red-500">
                                    <LogOut className="mr-3 h-5 w-5" /> Terminate Session
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Tabs Bar */}
                <div className="bg-white border-b border-gray-200 h-12 flex items-center px-6 overflow-x-auto no-scrollbar shrink-0 z-10">
                    <div className="flex space-x-2">
                        {tabs.map(tab => (
                            <div
                                key={tab.id}
                                className={cn(
                                    "flex items-center h-12 px-4 transition-all border-b-2 cursor-pointer relative group",
                                    activeTabId === tab.id ? "border-primary bg-blue-50/50 text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={cn("text-sm font-medium whitespace-nowrap", activeTabId === tab.id ? "font-bold" : "")}>
                                    {tab.title}
                                </span>
                                {tab.id !== 'dashboard' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 ml-2 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTab(tab.id);
                                        }}
                                    >
                                        <X size={12} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <ScrollArea className="flex-grow">
                    <main className="min-h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTabId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ActiveComponent />
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </ScrollArea>
            </div>
        </div>
    );
};
