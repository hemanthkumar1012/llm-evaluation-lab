import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Compare from "@/pages/Compare";
import Datasets from "@/pages/Datasets";
import Learn from "@/pages/Learn";
import Roadmap from "@/pages/Roadmap";
import Workflow from "@/pages/Workflow";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/workflow" component={Workflow} /><Route path="/datasets" component={Datasets} /><Route path="/compare" component={Compare} /><Route path="/learn" component={Learn} /><Route path="/roadmap" component={Roadmap} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
