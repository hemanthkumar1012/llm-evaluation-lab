import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useIsMobile } from "@/hooks/useMobile";
import { BookOpen, ClipboardCheck, FlaskConical, Gauge, GitCompareArrows, LogIn, LogOut, PanelLeft, Route, Settings2 } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const menuItems = [
  { icon: Gauge, label: "Overview", path: "/" },
  { icon: FlaskConical, label: "Workflow lab", path: "/workflow" },
  { icon: ClipboardCheck, label: "Datasets", path: "/datasets" },
  { icon: GitCompareArrows, label: "Compare runs", path: "/compare" },
  { icon: BookOpen, label: "Learn from scratch", path: "/learn" },
  { icon: Route, label: "Roadmap", path: "/roadmap" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 220;
const MAX_WIDTH = 400;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
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
  const activeMenuItem = menuItems.find(item => item.path === location);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (!isResizing) return;
      const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const width = event.clientX - left;
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) setSidebarWidth(width);
    };
    const up = () => setIsResizing(false);
    if (isResizing) { document.addEventListener("mousemove", move); document.addEventListener("mouseup", up); document.body.style.cursor = "col-resize"; }
    return () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); document.body.style.cursor = ""; };
  }, [isResizing, setSidebarWidth]);

  return <>
    <div ref={sidebarRef} className="relative">
      <Sidebar collapsible="icon" className="border-r border-slate-200/80 bg-white" disableTransition={isResizing}>
        <SidebarHeader className="h-20 justify-center border-b border-slate-100">
          <div className="flex items-center gap-3 px-2 w-full">
            <button onClick={toggleSidebar} className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-950 text-white shrink-0" aria-label="Toggle navigation"><PanelLeft className="h-4 w-4" /></button>
            {!isCollapsed && <div className="min-w-0"><div className="font-semibold tracking-tight text-slate-950">Signal Lab</div><div className="text-[11px] text-slate-500 uppercase tracking-[0.18em]">AI quality systems</div></div>}
          </div>
        </SidebarHeader>
        <SidebarContent className="gap-0 py-4"><SidebarMenu className="px-2 gap-1">{menuItems.map(item => <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={location === item.path} onClick={() => setLocation(item.path)} tooltip={item.label} className="h-11 rounded-xl font-medium text-slate-600 data-[active=true]:bg-slate-950 data-[active=true]:text-white"><item.icon className="h-4 w-4" /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu><div className="mt-auto px-4 py-4">{!isCollapsed && <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3"><div className="flex items-center gap-2 text-amber-900 text-xs font-semibold"><Settings2 className="h-3.5 w-3.5" /> Learning mode</div><p className="text-[11px] leading-relaxed text-amber-800/80 mt-1.5">Every metric is explained in plain language as you build.</p></div>}</div></SidebarContent>
        <SidebarFooter className="p-3 border-t border-slate-100"><DropdownMenu><DropdownMenuTrigger asChild><button className="flex items-center gap-3 rounded-xl px-1 py-1.5 hover:bg-slate-50 w-full text-left"><Avatar className="h-9 w-9 border border-slate-200"><AvatarFallback className="text-xs font-semibold bg-emerald-100 text-emerald-800">{user?.name?.charAt(0).toUpperCase() || "L"}</AvatarFallback></Avatar><div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden"><p className="text-sm font-medium truncate text-slate-800">{user?.name || "Learner mode"}</p><p className="text-xs text-slate-500 truncate mt-1">{user?.email || "Demo workspace"}</p></div></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48">{user ? <DropdownMenuItem onClick={logout} className="cursor-pointer"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem> : <DropdownMenuItem onClick={() => startLogin()} className="cursor-pointer"><LogIn className="mr-2 h-4 w-4" />Sign in to save</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu></SidebarFooter>
      </Sidebar><div className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-emerald-400/30 ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => setIsResizing(true)} />
    </div>
    <SidebarInset className="bg-[#f7f8fa]">{isMobile && <div className="flex border-b h-14 items-center gap-2 bg-white px-3 sticky top-0 z-40"><SidebarTrigger className="h-9 w-9 rounded-lg" /><span className="font-semibold text-slate-900">{activeMenuItem?.label || "Signal Lab"}</span></div>}<main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full">{children}</main></SidebarInset>
  </>;
}
