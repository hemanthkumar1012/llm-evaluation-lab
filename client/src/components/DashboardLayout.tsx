import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useIsMobile } from "@/hooks/useMobile";
import { Activity, BookOpen, ClipboardCheck, FlaskConical, Gauge, GitCompareArrows, LogIn, LogOut, PanelLeft, Route, Settings2, ShieldCheck } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const menuGroups = [
  { label: "Observe", items: [{ icon: Gauge, label: "Overview", path: "/" }, { icon: GitCompareArrows, label: "Compare runs", path: "/compare" }] },
  { label: "Build", items: [{ icon: FlaskConical, label: "Workflow lab", path: "/workflow" }, { icon: ClipboardCheck, label: "Datasets", path: "/datasets" }] },
  { label: "Understand", items: [{ icon: BookOpen, label: "Learn from scratch", path: "/learn" }, { icon: Route, label: "Roadmap", path: "/roadmap" }] },
];
const allMenuItems = menuGroups.flatMap(group => group.items);
const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 264;
const MIN_WIDTH = 224;
const MAX_WIDTH = 400;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => { const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY); return saved ? parseInt(saved, 10) : DEFAULT_WIDTH; });
  const { loading } = useAuth();
  useEffect(() => localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString()), [sidebarWidth]);
  if (loading) return <DashboardLayoutSkeleton />;
  return <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}><DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent></SidebarProvider>;
}

function DashboardLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (width: number) => void }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isCollapsed = state === "collapsed";
  const activeMenuItem = allMenuItems.find(item => item.path === location);

  useEffect(() => {
    const move = (event: MouseEvent) => { if (!isResizing) return; const left = sidebarRef.current?.getBoundingClientRect().left ?? 0; const width = event.clientX - left; if (width >= MIN_WIDTH && width <= MAX_WIDTH) setSidebarWidth(width); };
    const up = () => setIsResizing(false);
    if (isResizing) { document.addEventListener("mousemove", move); document.addEventListener("mouseup", up); document.body.style.cursor = "col-resize"; }
    return () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); document.body.style.cursor = ""; };
  }, [isResizing, setSidebarWidth]);

  return <>
    <div ref={sidebarRef} className="relative">
      <Sidebar collapsible="icon" className="border-r border-[#31483a] bg-[#1d3027] text-[#e6eee1]" disableTransition={isResizing}>
        <SidebarHeader className="h-24 justify-center border-b border-[#31483a]">
          <div className="flex items-center gap-3 px-2 w-full"><button onClick={toggleSidebar} className="focus-ring h-10 w-10 rounded-xl flex items-center justify-center bg-[#c9f36a] text-[#193025] shrink-0 transition-transform active:scale-95" aria-label="Toggle navigation"><PanelLeft className="h-4 w-4" /></button>{!isCollapsed && <div className="min-w-0"><div className="font-bold tracking-[-0.03em] text-white text-lg">Signal Lab</div><div className="mono-label text-[#9fb4a4] mt-1">Quality / Systems</div></div>}</div>
        </SidebarHeader>
        <SidebarContent className="gap-0 py-6"><div className="px-4 mb-5 flex items-center gap-2 text-[#9fb4a4] mono-label"><Activity className="h-3.5 w-3.5 text-[#c9f36a]" />Workspace</div>{menuGroups.map(group => <div key={group.label} className="mb-6"><div className="px-4 mb-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#718b7a] group-data-[collapsible=icon]:hidden">{group.label}</div><SidebarMenu className="px-2 gap-1">{group.items.map(item => <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={location === item.path} onClick={() => setLocation(item.path)} tooltip={item.label} className="focus-ring h-11 rounded-xl font-medium text-[#b8c9bc] transition-colors hover:bg-[#294337] hover:text-white data-[active=true]:bg-[#c9f36a] data-[active=true]:text-[#193025]"><item.icon className="h-4 w-4" /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></div>)}{!isCollapsed && <div className="mt-auto px-4 pt-5"><div className="rounded-2xl border border-[#3c5a48] bg-[#263f32] p-4"><div className="flex items-center gap-2 text-[#d9f69b] text-xs font-semibold"><ShieldCheck className="h-3.5 w-3.5" />Evidence mode</div><p className="text-[11px] leading-relaxed text-[#b5c9b7] mt-2">Every release claim should have a trace behind it.</p></div></div>}</SidebarContent>
        <SidebarFooter className="p-3 border-t border-[#31483a]"><DropdownMenu><DropdownMenuTrigger asChild><button className="focus-ring flex items-center gap-3 rounded-xl px-1 py-2 hover:bg-[#294337] w-full text-left"><Avatar className="h-9 w-9 border border-[#567261]"><AvatarFallback className="text-xs font-bold bg-[#c9f36a] text-[#193025]">{user?.name?.charAt(0).toUpperCase() || "L"}</AvatarFallback></Avatar><div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden"><p className="text-sm font-medium truncate text-white">{user?.name || "Local learner"}</p><p className="mono-label text-[#9fb4a4] truncate mt-1 normal-case tracking-normal">{user?.email || "Unsynced workspace"}</p></div></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52">{user ? <DropdownMenuItem onClick={logout} className="cursor-pointer"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem> : <DropdownMenuItem onClick={() => startLogin()} className="cursor-pointer"><LogIn className="mr-2 h-4 w-4" />Sign in to sync</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu></SidebarFooter>
      </Sidebar><div className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#c9f36a]/50 ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => setIsResizing(true)} />
    </div>
    <SidebarInset className="bg-transparent">{isMobile && <div className="flex border-b border-[#d8dfd2] h-14 items-center gap-2 bg-[#f5f4ed]/95 backdrop-blur px-3 sticky top-0 z-40"><SidebarTrigger className="focus-ring h-9 w-9 rounded-lg" /><span className="font-semibold text-[#193025]">{activeMenuItem?.label || "Signal Lab"}</span></div>}<main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full">{children}</main></SidebarInset>
  </>;
}
