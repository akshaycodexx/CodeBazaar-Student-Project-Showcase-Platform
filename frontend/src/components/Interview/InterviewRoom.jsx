import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Mic, Video, Monitor, Play, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const InterviewRoom = () => {
    const { id } = useParams();
    const [interview, setInterview] = useState(null);
    const [code, setCode] = useState("// Loading starter code...");
    const [output, setOutput] = useState("");
    const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/interviews/${id}`, { withCredentials: true });
                setInterview(res.data);
                setCode(res.data.problem?.starterCode || "// Write code here");
            } catch (e) { console.error("Failed to load room"); }
        };
        fetchDetails();

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [id]);

    const runCode = () => {
        setIsRunning(true);
        setOutput("Running tests...");

        // Simulated Execution Delay
        setTimeout(() => {
            try {
                // Determine test case based on problem title (Simple keyword check for demo)
                // In real app, this runs in a sandbox container

                let success = false;
                let log = "";

                if (code.includes("return") && !code.includes("error")) {
                    success = true;
                    log = "Test Case 1: [2, 7, 11, 15], 9 \nExpected: [0, 1]\nActual: [0, 1]\nStatus: Passed ✅\n\nTest Case 2: [3, 2, 4], 6\nExpected: [1, 2]\nActual: [1, 2]\nStatus: Passed ✅";
                } else {
                    log = "SyntaxError: Unexpected token";
                }

                // If user wrote actual logic (very rough check)
                if (code.length > 50) {
                    setOutput(log);
                } else {
                    setOutput("Error: Code seems incomplete. Please implement the solution.");
                }
            } catch (e) {
                setOutput("Execution Error: " + e.message);
            } finally {
                setIsRunning(false);
            }
        }, 1500);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!interview) return <div className="text-center py-20 text-white bg-neutral-900 min-h-screen">Loading Room...</div>;

    return (
        <div className="flex flex-col h-screen bg-[#0d0d0d] text-white overflow-hidden font-sans">
            {/* Header */}
            <div className="h-16 border-b border-neutral-800 flex justify-between items-center px-6 bg-[#0d0d0d]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold">
                        <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">{interview.topic} Assessment</h2>
                        <span className="text-xs text-neutral-400">Session ID: {interview._id.slice(-6)}</span>
                    </div>
                </div>

                <div className="bg-neutral-800 px-4 py-2 rounded-lg font-mono text-xl font-bold text-indigo-400 border border-neutral-700">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex gap-3">
                    <button className="p-3 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700 group relative">
                        <Video className="w-5 h-5 text-neutral-400 group-hover:text-white" />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-neutral-800"></span>
                    </button>
                    <button className="p-3 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700 group">
                        <Mic className="w-5 h-5 text-neutral-400 group-hover:text-white" />
                    </button>
                    <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors ml-4">
                        End & Submit
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Problem Statement (Left) */}
                <div className="w-1/3 border-r border-neutral-800 flex flex-col bg-[#0d0d0d]">
                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                        <h3 className="text-2xl font-bold mb-6 text-white">{interview.problem?.title}</h3>
                        <div className="prose prose-invert max-w-none mb-8">
                            <p className="text-neutral-300 leading-relaxed text-base">{interview.problem?.description}</p>
                        </div>

                        <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 mb-6">
                            <h4 className="font-bold text-xs mb-4 text-neutral-500 uppercase tracking-wider">Example Case</h4>
                            <div className="font-mono text-sm space-y-2">
                                <div className="flex gap-4">
                                    <span className="text-indigo-400 w-16">Input:</span>
                                    <span className="text-neutral-300">nums = [2,7,11,15], target = 9</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-emerald-400 w-16">Output:</span>
                                    <span className="text-neutral-300">[0,1]</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/30 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-200">Tip: Focus on time complexity. An O(n²) solution is acceptable but O(n) is preferred.</p>
                        </div>
                    </div>
                </div>

                {/* Code Editor (Right) */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    <div className="flex-1 relative font-mono text-[15px] leading-relaxed">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-6 outline-none resize-none"
                            spellCheck="false"
                            style={{ fontFamily: '"Fira Code", monospace' }}
                        />
                    </div>

                    {/* Output Panel */}
                    <div className="h-64 border-t border-neutral-800 bg-[#0d0d0d] flex flex-col">
                        <div className="h-12 border-b border-neutral-800 flex items-center px-6 justify-between bg-[#151515]">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                <Monitor className="w-4 h-4" /> Terminal
                            </span>
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${isRunning ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20'}`}
                            >
                                {isRunning ? (
                                    <>Running Test Suite...</>
                                ) : (
                                    <><Play className="w-4 h-4 fill-current" /> Run Code</>
                                )}
                            </button>
                        </div>
                        <pre className={`p-6 font-mono text-sm overflow-y-auto whitespace-pre-wrap flex-1 ${output.includes("Error") ? "text-red-400" : "text-emerald-400"}`}>
                            {output || <span className="text-neutral-600 italic">Ready to execute. stdout will appear here...</span>}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom;
