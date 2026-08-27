import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import { ConcurrencyStrategy, ConcurrencyRunResult, SimulatedTx } from '../types';
import {
  Play,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  Cpu,
  Lock,
  Unlock,
  Layers,
  Clock,
  Terminal,
  Columns,
  RefreshCw,
  Info,
  Sliders,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ConcurrencySimulator: React.FC = () => {
  const {
    events,
    runConcurrencySimulation,
    isSimulating,
    simulationProgress,
    lastSimResult,
    simHistory,
  } = useFest();

  // Configuration options
  const [strategy, setStrategy] = useState<ConcurrencyStrategy>('NO_LOCKING');
  const [concurrencyLevel, setConcurrencyLevel] = useState<number>(25);
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'evt-armaan');
  const [speedMs, setSpeedMs] = useState<number>(30); // 30ms per step

  // Side by Side Comparison State
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareResultNoLock, setCompareResultNoLock] = useState<ConcurrencyRunResult | null>(null);
  const [compareResult2PL, setCompareResult2PL] = useState<ConcurrencyRunResult | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Filter for Transaction Log
  const [logFilter, setLogFilter] = useState<'ALL' | 'COMMITTED' | 'REJECTED'>('ALL');
  const [selectedTxDetail, setSelectedTxDetail] = useState<SimulatedTx | null>(null);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleRunSimulation = async () => {
    setIsCompareMode(false);
    await runConcurrencySimulation({
      strategy,
      concurrencyLevel,
      targetEventId: selectedEventId,
      speedMs,
    });
  };

  const handleRunComparison = async () => {
    setIsCompareMode(true);
    setIsComparing(true);

    // 1. Run No Locking first
    const resNoLock = await runConcurrencySimulation({
      strategy: 'NO_LOCKING',
      concurrencyLevel,
      targetEventId: selectedEventId,
      speedMs: Math.max(5, Math.floor(speedMs / 2)),
    });
    setCompareResultNoLock(resNoLock);

    // Small gap
    await new Promise((r) => setTimeout(r, 400));

    // 2. Run 2PL
    const res2PL = await runConcurrencySimulation({
      strategy: 'TWO_PHASE_LOCKING',
      concurrencyLevel,
      targetEventId: selectedEventId,
      speedMs: Math.max(5, Math.floor(speedMs / 2)),
    });
    setCompareResult2PL(res2PL);

    setIsComparing(false);
  };

  const activeResult = isCompareMode ? compareResult2PL || lastSimResult : lastSimResult;

  const filteredTxs = activeResult
    ? activeResult.transactions.filter((tx) => {
        if (logFilter === 'COMMITTED') return tx.status === 'COMMITTED';
        if (logFilter === 'REJECTED') return tx.status === 'REJECTED' || tx.status === 'ROLLEDBACK';
        return true;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Academic Title */}
      <div className="bg-[#0e121a] border border-white/15 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00e5ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> TRANSACTION ENGINE LAB
              </span>
              <span className="text-xs text-white/50 font-mono">TRANSACTION & LOCKING BENCHMARK</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Database Locking & Transaction Simulator
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
              Demonstrating the <strong>Lost Update Race Condition</strong> when multiple simultaneous booking transactions
              compete for 1 remaining festival seat without transactional locking vs. mathematical serializability achieved via{' '}
              <strong>Strict Two-Phase Locking (2PL)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunComparison}
              disabled={isSimulating || isComparing}
              className="px-4 py-3 rounded-2xl bg-[#121620] hover:bg-[#1b2230] border border-[#00e5ff]/40 text-[#00e5ff] text-xs font-bold transition-all flex items-center gap-2 shadow-lg hover:scale-102 disabled:opacity-50"
            >
              <Columns className="w-4 h-4" />
              <span>Compare Side-by-Side</span>
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating || isComparing}
              className="px-6 py-3 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-black tracking-wide transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] hover:scale-102 flex items-center gap-2 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Simulating {simulationProgress}%...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>Execute Benchmark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Control Bench Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Concurrency Strategy Selector */}
        <div className="bg-[#0e121a] border border-white/15 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#ccff00]" /> 1. ISOLATION PROTOCOL
            </span>
            <span className="text-[10px] text-white/40 font-mono">DBMS STRATEGY</span>
          </div>

          <div className="space-y-2">
            {/* Option A: No Locking */}
            <button
              onClick={() => setStrategy('NO_LOCKING')}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                strategy === 'NO_LOCKING'
                  ? 'bg-red-500/15 border-red-500 text-white shadow-md'
                  : 'bg-[#080a0f] border-white/10 text-white/60 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5 text-red-400" /> No Locking (Race Condition)
                </span>
                <span className="text-[9px] font-mono font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                  OVERBOOKING BUG
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-1">
                Read Uncommitted / Interleaved Read-Write with zero mutexes. Multiple transactions both see stock=1 and overbook.
              </p>
            </button>

            {/* Option B: Two-Phase Locking (2PL) */}
            <button
              onClick={() => setStrategy('TWO_PHASE_LOCKING')}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                strategy === 'TWO_PHASE_LOCKING'
                  ? 'bg-[#ccff00]/15 border-[#ccff00] text-white shadow-md'
                  : 'bg-[#080a0f] border-white/10 text-white/60 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#ccff00]" /> Strict Two-Phase Locking (2PL)
                </span>
                <span className="text-[9px] font-mono font-bold text-[#ccff00] bg-[#ccff00]/10 px-1.5 py-0.5 rounded">
                  SERIALIZABLE
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-1">
                SELECT ... FOR UPDATE locks row with Exclusive Lock (X-Lock) in growing phase. Releases upon COMMIT.
              </p>
            </button>

            {/* Option C: Optimistic Concurrency Control */}
            <button
              onClick={() => setStrategy('OPTIMISTIC_OCC')}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                strategy === 'OPTIMISTIC_OCC'
                  ? 'bg-[#00e5ff]/15 border-[#00e5ff] text-white shadow-md'
                  : 'bg-[#080a0f] border-white/10 text-white/60 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" /> Optimistic OCC (Row Versioning)
                </span>
                <span className="text-[9px] font-mono font-bold text-[#00e5ff] bg-[#00e5ff]/10 px-1.5 py-0.5 rounded">
                  SNAPSHOT
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-1">
                Validates row version at commit time. First update increments version; concurrent collisions abort safely.
              </p>
            </button>
          </div>
        </div>

        {/* Step 2: Concurrent Load & Target Resource */}
        <div className="bg-[#0e121a] border border-white/15 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00e5ff]" /> 2. LOAD & TARGET SEAT
            </span>
            <span className="text-[10px] text-white/40 font-mono">SIMULATION LOAD</span>
          </div>

          <div>
            <label className="block text-[11px] text-white/70 font-mono mb-2">
              Concurrent Client Requests: <strong className="text-white text-xs">{concurrencyLevel} Threads</strong>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 25, 50].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setConcurrencyLevel(lvl)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    concurrencyLevel === lvl
                      ? 'bg-[#00e5ff] text-black shadow-md'
                      : 'bg-[#080a0f] border border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                >
                  {lvl} Requests
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-white/70 font-mono mb-1">Target Hotspot Event</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-[#080a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#00e5ff] focus:outline-none font-mono"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.availableSeats} available)
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#080a0f] p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[9px] text-white/40 block">CONTESTED RESOURCE</span>
              <span className="font-bold text-[#ccff00]">VIP Seat [A-1]</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-white/40 block">AVAILABLE CAPACITY</span>
              <span className="font-bold text-red-400">1 Seat Remaining</span>
            </div>
          </div>
        </div>

        {/* Step 3: Speed & Telemetry Configuration */}
        <div className="bg-[#0e121a] border border-white/15 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> 3. EXECUTION PACE
              </span>
              <span className="text-[10px] text-white/40 font-mono">STEP DELAY</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/60">Animation Speed:</span>
                <span className="text-[#ccff00] font-bold">
                  {speedMs === 5 ? 'High Speed (5ms)' : speedMs === 30 ? 'Step-by-Step (30ms)' : 'Lecture Mode (100ms)'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="w-full accent-[#ccff00] bg-white/10 rounded-lg h-2"
              />
              <div className="flex justify-between text-[9px] font-mono text-white/40">
                <span>Fast (Stress Test)</span>
                <span>Balanced</span>
                <span>Granular Trace</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIDE-BY-SIDE COMPARISON VIEW (When "Compare Side-by-Side" is triggered) */}
      {isCompareMode && (
        <div className="bg-[#0e121a] border border-[#00e5ff]/30 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Columns className="w-5 h-5 text-[#00e5ff]" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Direct Side-by-Side Comparison: No Locking vs. 2-Phase Locking
              </h2>
            </div>
            <span className="text-xs font-mono text-[#00e5ff] bg-[#00e5ff]/10 px-2.5 py-1 rounded-full border border-[#00e5ff]/30 font-bold">
              {concurrencyLevel} Simultaneous Requests vs 1 Remaining Seat
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: No Locking */}
            <div className="bg-[#080a0f] border border-red-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-red-400" />
                  <h3 className="font-bold text-white text-sm">NO LOCKING (RACE CONDITION)</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/30">
                  OVERBOOKING BUG
                </span>
              </div>

              {compareResultNoLock ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                      <span className="text-[9px] text-white/40 block">COMMITTED</span>
                      <span className="text-lg font-black text-red-400">{compareResultNoLock.successfulCount}</span>
                      <span className="text-[9px] text-red-400 block font-bold">OVERBOOKED!</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[9px] text-white/40 block">ACTUAL CAPACITY</span>
                      <span className="text-lg font-black text-white">{compareResultNoLock.initialStock}</span>
                      <span className="text-[9px] text-white/40 block">Original Seat</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[9px] text-white/40 block">FINAL STOCK</span>
                      <span className="text-lg font-black text-red-400">{compareResultNoLock.finalStock}</span>
                      <span className="text-[9px] text-red-400 block font-bold">Negative DB Value</span>
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl text-xs text-red-200 leading-relaxed font-mono">
                    <p className="font-bold mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400" /> Critical Race Anomaly Detected:
                    </p>
                    <p>
                      Because no Exclusive Locks were acquired, multiple threads executed interleaved{' '}
                      <code>SELECT (stock=1)</code> before any <code>UPDATE</code> was committed. Result:{' '}
                      <strong>{compareResultNoLock.overbookedSeats} duplicate tickets</strong> were issued for the same seat!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-white/40 font-mono animate-pulse">
                  Executing No-Locking Stress Test...
                </div>
              )}
            </div>

            {/* Right Card: Strict Two-Phase Locking */}
            <div className="bg-[#080a0f] border border-[#ccff00]/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#ccff00]" />
                  <h3 className="font-bold text-white text-sm">TWO-PHASE LOCKING (2PL)</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/30">
                  SERIALIZABILITY PRESERVED
                </span>
              </div>

              {compareResult2PL ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="bg-[#ccff00]/10 p-2.5 rounded-xl border border-[#ccff00]/20">
                      <span className="text-[9px] text-white/40 block">COMMITTED</span>
                      <span className="text-lg font-black text-[#ccff00]">{compareResult2PL.successfulCount}</span>
                      <span className="text-[9px] text-[#ccff00] block font-bold">1 Valid Ticket</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[9px] text-white/40 block">SAFELY REJECTED</span>
                      <span className="text-lg font-black text-white">{compareResult2PL.rejectedCount}</span>
                      <span className="text-[9px] text-white/40 block">409 Conflict</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[9px] text-white/40 block">FINAL STOCK</span>
                      <span className="text-lg font-black text-white">{compareResult2PL.finalStock}</span>
                      <span className="text-[9px] text-[#ccff00] block font-bold">Consistent (0 Left)</span>
                    </div>
                  </div>

                  <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 p-3.5 rounded-xl text-xs text-[#ccff00] leading-relaxed font-mono">
                    <p className="font-bold mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#ccff00]" /> Mathematical Serializability Guaranteed:
                    </p>
                    <p className="text-white/80">
                      Transaction <code>TX_101</code> acquired the row Exclusive Lock (X-Lock). All other {compareResult2PL.rejectedCount} transactions
                      were serialized and returned clean "Seat just taken" responses. Zero overbooking.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-white/40 font-mono animate-pulse">
                  Executing 2PL Protocol...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIVE SIMULATION RESULTS & TRANSACTION VISUALIZER */}
      {activeResult && (
        <div className="space-y-6">
          {/* Result Metric Banner */}
          <div
            className={`border rounded-3xl p-6 shadow-xl ${
              activeResult.overbookingDetected
                ? 'bg-red-500/10 border-red-500/40 text-red-100'
                : 'bg-[#ccff00]/10 border-[#ccff00]/40 text-white'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 text-white">
                    BENCHMARK COMPLETED ({activeResult.durationMs}ms)
                  </span>
                  <span className="text-xs font-mono text-white/60">PROTOCOL: {activeResult.strategy}</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {activeResult.overbookingDetected ? (
                    <span className="text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6" /> OVERBOOKING ANOMALY CONFIRMED: {activeResult.successfulCount} Bookings for 1 Seat!
                    </span>
                  ) : (
                    <span className="text-[#ccff00] flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6" /> SERIALIZABLE COMMIT: Exactly 1 Seat Allocated
                    </span>
                  )}
                </h3>
              </div>

              {/* Stat Badges */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="bg-black/50 px-3 py-2 rounded-xl border border-white/10 text-center">
                  <span className="text-[9px] text-white/40 block">REQUESTS</span>
                  <span className="font-bold text-white">{activeResult.concurrencyLevel}</span>
                </div>
                <div className="bg-black/50 px-3 py-2 rounded-xl border border-white/10 text-center">
                  <span className="text-[9px] text-white/40 block">COMMITTED</span>
                  <span
                    className={`font-bold ${
                      activeResult.overbookingDetected ? 'text-red-400' : 'text-[#ccff00]'
                    }`}
                  >
                    {activeResult.successfulCount}
                  </span>
                </div>
                <div className="bg-black/50 px-3 py-2 rounded-xl border border-white/10 text-center">
                  <span className="text-[9px] text-white/40 block">CONFLICTS</span>
                  <span className="font-bold text-white/70">{activeResult.rejectedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Worker Thread Grid */}
          <div className="bg-[#0e121a] border border-white/15 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00e5ff]" /> Simulated Transaction Worker Threads ({activeResult.concurrencyLevel})
                </h3>
                <p className="text-xs text-white/50 font-mono">
                  Click any transaction thread pill below to inspect its SQL trace and lock state
                </p>
              </div>

              {/* Thread Status Legend */}
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-[#ccff00]">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00]" /> Committed (200 OK)
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Overbooked Bug
                </span>
                <span className="flex items-center gap-1 text-white/40">
                  <span className="w-2 h-2 rounded-full bg-white/30" /> Conflict Rejected (409)
                </span>
              </div>
            </div>

            {/* Thread Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {activeResult.transactions.map((tx) => {
                const isCommitted = tx.status === 'COMMITTED';
                const isAnomaly = isCommitted && activeResult.strategy === 'NO_LOCKING' && tx.clientIndex > 1;
                const isRejected = tx.status === 'REJECTED' || tx.status === 'ROLLEDBACK';
                const isSelected = selectedTxDetail?.txId === tx.txId;

                let pillColor = 'bg-[#121620] border-white/10 text-white/60';
                if (isAnomaly) {
                  pillColor = 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
                } else if (isCommitted) {
                  pillColor = 'bg-[#ccff00]/20 border-[#ccff00] text-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.3)]';
                } else if (isRejected) {
                  pillColor = 'bg-[#080a0f] border-white/5 text-white/30';
                }

                return (
                  <button
                    key={tx.txId}
                    onClick={() => setSelectedTxDetail(tx)}
                    className={`p-2 rounded-xl border text-center transition-all text-xs font-mono font-bold flex flex-col items-center justify-center ${pillColor} ${
                      isSelected ? 'ring-2 ring-white scale-105' : 'hover:scale-102'
                    }`}
                  >
                    <span className="text-[10px] opacity-70">T-{tx.clientIndex}</span>
                    <span className="text-xs">{tx.txId}</span>
                    <span className="text-[8px] uppercase mt-0.5">
                      {isAnomaly ? 'OVERBOOK' : isCommitted ? 'COMMITTED' : 'CONFLICT'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Transaction Inspector Detail Drawer */}
            {selectedTxDetail && (
              <div className="bg-[#080a0f] border border-white/15 rounded-2xl p-4 mt-4 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#ccff00]" />
                    <span className="font-bold text-white font-mono text-xs">
                      SQL Trace: {selectedTxDetail.txId} ({selectedTxDetail.clientName})
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTxDetail(null)}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="space-y-1 bg-[#121620] p-3 rounded-xl font-mono text-xs">
                  {selectedTxDetail.sqlStatements.map((sql, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white/90">
                      <span className="text-white/30 select-none">{idx + 1}</span>
                      <code
                        className={
                          sql.includes('COMMIT')
                            ? 'text-[#ccff00] font-bold'
                            : sql.includes('ROLLBACK')
                            ? 'text-red-400 font-bold'
                            : sql.includes('EXCLUSIVE')
                            ? 'text-[#00e5ff] font-bold'
                            : 'text-white/80'
                        }
                      >
                        {sql}
                      </code>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                  <span>Status: <strong className="text-white">{selectedTxDetail.message}</strong></span>
                  <span>Latency: {selectedTxDetail.latencyMs}ms</span>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Request Timeline & Log Table */}
          <div className="bg-[#0e121a] border border-white/15 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#ccff00]" /> Transaction Execution Timeline & Audit Log
                </h3>
                <p className="text-xs text-white/50 font-mono">
                  Full deterministic execution sequence of {activeResult.transactions.length} transactions
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#080a0f] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setLogFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold ${
                    logFilter === 'ALL' ? 'bg-[#ccff00] text-black font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  All ({activeResult.transactions.length})
                </button>
                <button
                  onClick={() => setLogFilter('COMMITTED')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold ${
                    logFilter === 'COMMITTED'
                      ? 'bg-[#ccff00] text-black font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Committed ({activeResult.successfulCount})
                </button>
                <button
                  onClick={() => setLogFilter('REJECTED')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold ${
                    logFilter === 'REJECTED'
                      ? 'bg-[#ccff00] text-black font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Rejected ({activeResult.rejectedCount})
                </button>
              </div>
            </div>

            {/* Log Table */}
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#080a0f] text-white/50 sticky top-0 border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">TxID</th>
                    <th className="py-2.5 px-3">Client Session</th>
                    <th className="py-2.5 px-3">Target Seat</th>
                    <th className="py-2.5 px-3">Execution Outcome</th>
                    <th className="py-2.5 px-3">ACID / Lock Detail</th>
                    <th className="py-2.5 px-3 text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTxs.map((tx) => {
                    const isCommitted = tx.status === 'COMMITTED';
                    const isAnomaly = isCommitted && activeResult.strategy === 'NO_LOCKING' && tx.clientIndex > 1;

                    return (
                      <tr key={tx.txId} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{tx.txId}</td>
                        <td className="py-2 px-3 text-white/70">
                          {tx.clientName} <span className="text-[10px] text-white/40">({tx.regNumber})</span>
                        </td>
                        <td className="py-2 px-3 text-[#ccff00] font-bold">
                          {tx.seatAllocated || activeResult.targetSeatLabel}
                        </td>
                        <td className="py-2 px-3">
                          {isAnomaly ? (
                            <span className="text-red-400 bg-red-400/10 border border-red-400/30 px-2 py-0.5 rounded text-[10px] font-bold">
                              OVERBOOKED BUG
                            </span>
                          ) : isCommitted ? (
                            <span className="text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                              200 OK (COMMITTED)
                            </span>
                          ) : (
                            <span className="text-white/40 bg-white/5 px-2 py-0.5 rounded text-[10px]">
                              409 CONFLICT (ABORT)
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-white/60 truncate max-w-xs" title={tx.message}>
                          {tx.message}
                        </td>
                        <td className="py-2 px-3 text-right text-white/40">{tx.latencyMs}ms</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
