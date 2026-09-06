import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, CircleHelp, GraduationCap } from "lucide-react";
import { useLocation } from "wouter";

const lessons = [
  ["LLM", "A large language model predicts and generates text from patterns learned during training."],
  ["Prompt", "The instructions and context sent to the model to shape its response."],
  ["Workflow", "The complete path from customer input to final answer, including prompts, tools, and checks."],
  ["Dataset", "A versioned collection of test cases used to measure whether the workflow behaves correctly."],
  ["Test case", "One input, its expected outcome, and labels that explain difficulty or risk."],
  ["Evaluation", "A repeatable test that scores a workflow against a dataset."],
  ["Regression", "A case where a new version becomes worse than the baseline version."],
  ["Metric", "A measurable signal such as task success, groundedness, or latency."],
  ["Release gate", "A rule that blocks a version when a critical quality or safety metric misses its threshold."],
  ["Human review", "A person checking uncertain or high-impact cases to validate automated scoring."],
];

export default function Learn() {
  const [, setLocation] = useLocation();
  return <DashboardLayout><div className="space-y-8"><button onClick={() => setLocation("/")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Back to overview</button><section><div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-emerald-700"><GraduationCap className="h-4 w-4" />Start here</div><h1 className="text-4xl font-semibold tracking-tight mt-2">Learn evaluation from scratch</h1><p className="text-slate-500 mt-2 max-w-2xl">Build the vocabulary first. Then you can explain what you measured, why the metric matters, and what the release decision means.</p></section><div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5"><Card className="border-slate-200/80"><CardHeader><CardTitle>Core vocabulary</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-3">{lessons.map(([term, definition], index) => <div key={term} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-slate-950 text-white text-xs flex items-center justify-center">{index + 1}</div><span className="font-semibold">{term}</span></div><p className="text-sm text-slate-500 leading-relaxed mt-3">{definition}</p></div>)}</CardContent></Card><Card className="border-slate-200/80 bg-[#10201c] text-white"><CardHeader><Badge className="w-fit bg-emerald-400/15 text-emerald-200 border border-emerald-300/20 hover:bg-emerald-400/15">LESSON 01</Badge><CardTitle className="text-white mt-3">Why start with a narrow task?</CardTitle></CardHeader><CardContent><p className="text-sm text-slate-300 leading-relaxed">Customer-support answer quality is narrow enough to define clearly and rich enough to teach the important failure modes: unsupported claims, unsafe disclosure, incomplete resolution, and prompt injection.</p><div className="mt-6 space-y-3">{["Define expected behavior", "Collect representative cases", "Run a baseline", "Inspect failures", "Improve and gate the candidate"].map((item, index) => <div key={item} className="flex items-center gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-300" /><span>{index + 1}. {item}</span></div>)}</div><div className="mt-7 rounded-2xl bg-white/10 p-4 flex gap-3"><CircleHelp className="h-5 w-5 text-emerald-300 shrink-0" /><p className="text-xs text-slate-300 leading-relaxed">Interview framing: “I separated the workflow from the evaluation dataset so I could change the prompt without losing the test contract.”</p></div></CardContent></Card></div></div></DashboardLayout>;
}
