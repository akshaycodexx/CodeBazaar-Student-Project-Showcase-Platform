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

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/interviews/${id}`, { withCredentials: true });
                setInterview(res.data);
                setCode(res.data.problem?.starterCode || "// Write code here");
            } catch (e) { console.error("Failed to load room"); }
        };
        fetchDetails();
    }, [id]);

    const runCode = () => {
        // Mock execution
        setOutput("Running tests...\nTest Case 1: Passed ✅\nTest Case 2: Passed ✅\n\nOutput:\n[0, 1]");
    };

    if (!interview) return <div className="text-center py-20 text-white bg-neutral-900 min-h-screen">Loading Room...</div>;

    return (
        <div className="flex flex-col h-screen bg-neutral-900 text-white overflow-hidden">
            {/* Header */}
            <div className="h-14 border-b border-neutral-700 flex justify-between items-center px-6 bg-neutral-800">
                <h2 className="font-bold text-lg">{interview.topic} Interview</h2>
                <div className="flex gap-4">
                    <button className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"><Video className="w-5 h-5" /></button>
                    <button className="p-2 bg-neutral-700 rounded-full hover:bg-neutral-600 transition-colors"><Mic className="w-5 h-5" /></button>
                </div>
                <div className="text-sm text-neutral-400">Time Remaining: 45:00</div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Problem Statement (Left) */}
                <div className="w-1/3 border-r border-neutral-700 p-6 overflow-y-auto bg-neutral-800">
                    <h3 className="text-xl font-bold mb-4 text-emerald-400">Problem: {interview.problem?.title}</h3>
                    <p className="text-neutral-300 leading-relaxed mb-6">{interview.problem?.description}</p>

                    <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                        <h4 className="font-bold text-sm mb-2 text-neutral-400 uppercase">Example 1</h4>
                        <code className="text-sm font-mono text-neutral-300">
                            Input: nums = [2,7,11,15], target = 9<br />
                            Output: [0,1]<br />
                            Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                        </code>
                    </div>
                </div>

                {/* Code Editor (Right) */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    <div className="flex-1 p-4 font-mono text-sm outline-none">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full bg-transparent text-neutral-300 outline-none resize-none"
                            spellCheck="false"
                        />
                    </div>

                    {/* Output Panel */}
                    <div className="h-48 border-t border-neutral-700 bg-neutral-900 flex flex-col">
                        <div className="h-10 border-b border-neutral-800 flex items-center px-4 justify-between bg-neutral-800">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Console</span>
                            <button onClick={runCode} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded text-sm font-bold transition-colors">
                                <Play className="w-3 h-3" /> Run Code
                            </button>
                        </div>
                        <pre className="p-4 font-mono text-sm text-neutral-400 overflow-y-auto whitespace-pre-wrap">{output}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom;
