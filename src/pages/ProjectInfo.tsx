import React from 'react';
import {
  Info,
  Code,
  Terminal,
  Award,
  Layers,
  Save,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface StudentInfo {
  studentName: string;
  rollNumber: string;
  collegeName: string;
  department: string;
  academicYear: string;
  guideName: string;
}

export const ProjectInfo: React.FC = () => {
  const [studentInfo, setStudentInfo] = useLocalStorage<StudentInfo>(
    'pathfinder-student-info',
    {
      studentName: 'Candidate Name',
      rollNumber: '3rd Year CSE - Roll No.',
      collegeName: 'College of Engineering & Technology',
      department: 'Department of Computer Science and Engineering',
      academicYear: '2025 – 2026',
      guideName: 'Assistant Professor, CSE Dept.',
    }
  );

  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleUpdate = (field: keyof StudentInfo, value: string) => {
    setStudentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Info className="w-7 h-7 text-cyan-500" />
            Project Documentation &amp; Academic Credentials
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            College mini-project specifications, architecture standards, and editable student metadata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>CSE Mini-Project v1.0.0</span>
          </span>
        </div>
      </div>

      {/* Main Row: Project Architecture & Student Metadata Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Technical Architecture Card */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Technical Specification
              </h3>
              <p className="text-xs text-slate-400">Production Standards &amp; Frontend Stack</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-white/5">
              <span className="text-slate-400">Framework</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                React 18 + TypeScript (Strict Mode)
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-white/5">
              <span className="text-slate-400">Build Tool</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Vite 6</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-white/5">
              <span className="text-slate-400">Styling &amp; Theme</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Tailwind CSS (Dark Navy &amp; Cyan AI Lab)
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-white/5">
              <span className="text-slate-400">Motion &amp; Animations</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Framer Motion</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-white/5">
              <span className="text-slate-400">Data Visualization</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Recharts</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-white/5">
              <span className="text-slate-400">Testing Engine</span>
              <span className="font-semibold text-emerald-400">Vitest (Automated Unit Tests)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Storage Architecture</span>
              <span className="font-semibold text-cyan-400">
                LocalStorage Only (Zero Runtime APIs)
              </span>
            </div>
          </div>

          {/* Architectural Design Principles */}
          <div className="p-4 rounded-2xl bg-navy-950 border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Core Architecture Principles
            </h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Algorithms are pure functions returning deterministic step event streams.</li>
              <li>Replay engine indexes forward and backward without state drift.</li>
              <li>Grid editing immediately invalidates outdated algorithm results.</li>
              <li>Walls can never overwrite start or goal coordinates.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Editable Student / Team Submission Card */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Academic Viva Information
                </h3>
                <p className="text-xs text-slate-400">Edit details for project demonstration</p>
              </div>
            </div>

            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Student Name(s)</label>
              <input
                type="text"
                value={studentInfo.studentName}
                onChange={(e) => handleUpdate('studentName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Roll / Reg Number</label>
                <input
                  type="text"
                  value={studentInfo.rollNumber}
                  onChange={(e) => handleUpdate('rollNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Academic Year</label>
                <input
                  type="text"
                  value={studentInfo.academicYear}
                  onChange={(e) => handleUpdate('academicYear', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Department</label>
              <input
                type="text"
                value={studentInfo.department}
                onChange={(e) => handleUpdate('department', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">College / Institute</label>
              <input
                type="text"
                value={studentInfo.collegeName}
                onChange={(e) => handleUpdate('collegeName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Project Faculty Guide</label>
              <input
                type="text"
                value={studentInfo.guideName}
                onChange={(e) => handleUpdate('guideName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Credentials to LocalStorage</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Terminal Verification Commands */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <span>Examiner Verification Commands</span>
        </div>
        <div className="bg-navy-950 p-4 rounded-2xl border border-white/5 font-mono text-xs text-slate-300 space-y-1.5 overflow-x-auto">
          <p>
            <span className="text-emerald-400">$</span> npm run dev{' '}
            <span className="text-slate-500"># Start Vite dev server on port 3000</span>
          </p>
          <p>
            <span className="text-emerald-400">$</span> npm run build{' '}
            <span className="text-slate-500"># Run TypeScript type check and compile production bundle</span>
          </p>
          <p>
            <span className="text-emerald-400">$</span> npm test{' '}
            <span className="text-slate-500"># Run Vitest unit tests verifying algorithm correctness</span>
          </p>
        </div>
      </div>

      {/* College Viva Tips Box */}
      <div className="glass-card p-6 rounded-3xl space-y-3 border border-cyan-500/20 bg-cyan-950/20">
        <h4 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Tips for Presenting this Mini-Project in Your Viva</span>
        </h4>
        <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            <strong>Demonstrate Sample Demo Mode:</strong> Click "Sample Demo" on the Visualizer page to show A* solving the Slalom Zig-Zag maze. Pause and use "Step Backward" to show exact state replay.
          </li>
          <li>
            <strong>Showcase Comparison Page:</strong> Run the 3-way benchmark to show the professor that all three algorithms yield the <em>exact same path length</em>, proving A* preserves optimality while expanding ~70% fewer nodes.
          </li>
          <li>
            <strong>Export CSV:</strong> Download the benchmark CSV file live to show data logging capabilities.
          </li>
          <li>
            <strong>Reference the Viva FAQs:</strong> Refer to Section 8 of the Learn page to answer theory questions on heuristic admissibility ($h(n) \le h^*(n)$) and consistency.
          </li>
        </ol>
      </div>
    </div>
  );
};
