import React, { useState, useEffect, useRef } from 'react';
import { useFest } from '../../context/FestContext';
import { ConcurrencyStrategy, SimulatedTx, ConcurrencyRunResult } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  Cpu,
  Play,
  Columns,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Code,
  Layers,
  Clock,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const AdminConcurrencyLabPage: React.FC = () => {
  const {
    events,
    runConcurrencySimulation,
    runSideBySideSimulation,
    isSimulating,
    simulationProgress,
    lastSimResult,
    lastSideBySideResult,
    resetDatabaseState,
  } = useFest();

  const reduced = usePrefersReducedMotion();

  const [strategy, setStrategy] = useState<ConcurrencyStrategy>('TWO_PHASE_LOCKING');
  const [concurrencyLevel, setConcurrencyLevel] = useState<number>(25);
  const [targetEventId, setTargetEventId] = useState<string>(events[0]?.id || 'evt-armaan');
  const [showSqlTrace, setShowSqlTrace] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'SINGLE' | 'SIDE_BY_SIDE'>('SINGLE');

  // Real-time streamed transactions for presentation feed
  const [streamedSingleTxs, setStreamedSingleTxs] = useState<SimulatedTx[]>([]);
  const [streamedNoLockTxs, setStreamedNoLockTxs] = useState<SimulatedTx[]>([]);
  const [streamedTwoPlTxs, setStreamedTwoPlTxs] = useState<SimulatedTx[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  const handleRunSingle = async () => {
    setViewMode('SINGLE');
    setStreamedSingleTxs([]);
    const res = await runConcurrencySimulation({
      strategy,
      concurrencyLevel,
      targetEventId,
    });
    if (res && res.transactions) {
      streamTransactions(res.transactions, setStreamedSingleTxs);
    }
  };

  const handleRunSideBySide = async () => {
    setViewMode('SIDE_BY_SIDE');
    setStreamedNoLockTxs([]);
    setStreamedTwoPlTxs([]);
    const res = await runSideBySideSimulation({
      concurrencyLevel,
      targetEventId,
    });
    if (res) {
      streamSideBySide(res.noLockResult.transactions, res.twoPlResult.transactions);
    }
  };

  const streamTransactions = (all: SimulatedTx[], setter: React.Dispatch<React.SetStateAction<SimulatedTx[]>>) => {
    if (reduced) {
      setter(all);
      return;
    }
    setIsStreaming(true);
    let index = 0;
    setter([]);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      index++;
      setter(all.slice(0, index));
      if (index >= all.length) {
        clearInterval(timerRef.current);
        setIsStreaming(false);
      }
    }, 110);
  };

  const streamSideBySide = (noLock: SimulatedTx[], twoPl: SimulatedTx[]) => {
    if (reduced) {
      setStreamedNoLockTxs(noLock);
      setStreamedTwoPlTxs(twoPl);
      return;
    }
    setIsStreaming(true);
    let index = 0;
    const max = Math.max(noLock.length, twoPl.length);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      index++;
      setStreamedNoLockTxs(noLock.slice(0, index));
      setStreamedTwoPlTxs(twoPl.slice(0, index));
      if (index >= max) {
        clearInterval(timerRef.current);
        setIsStreaming(false);
      }
    }, 110);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update streamed transactions if lastSimResult exists on mount
  useEffect(() => {
    if (lastSimResult && streamedSingleTxs.length === 0 && !isSimulating) {
      setStreamedSingleTxs(lastSimResult.transactions);
    }
  }, [lastSimResult]);

  useEffect(() => {
    if (lastSideBySideResult && streamedNoLockTxs.length === 0 && !isSimulating) {
      setStreamedNoLockTxs(lastSideBySideResult.noLockResult.transactions);
      setStreamedTwoPlTxs(lastSideBySideResult.twoPlResult.transactions);
    }
  }, [lastSideBySideResult]);

  const singleCommitted = useCountUp(lastSimResult?.successfulCount ?? 0, 700);
  const singleRejected = useCountUp(lastSimResult?.rejectedCount ?? 0, 700);
  const singleFinalStock = useCountUp(lastSimResult?.finalStock ?? 0, 700);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#DF367C]/25 text-[#FF7099] border border-[#DF367C]/50">
              DBMS TRANSACTION BENCHMARK
            </span>
            <span className="text-xs text-white/50 font-mono">Serializability &amp; Race Condition Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-wide mt-1">
            CONCURRENCY CONTROL SIMULATOR
          </h1>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={resetDatabaseState}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Inventory Baseline</span>
        </motion.button>
      </div>

      {/* Control Panel Card */}
      <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* 1. Protocol Select */}
          <div className="space-y-2">
            <label className="block font-bold text-white/80 uppercase">
              1. Isolation Strategy
            </label>
            <select
              value={strategy}
              onChange={(e: any) => setStrategy(e.target.value)}
              disabled={isSimulating || isStreaming}
              className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#DF367C] disabled:opacity-50"
            >
              <option value="NO_LOCKING">No Locking (Dirty Read / Lost Update Overbook)</option>
              <option value="TWO_PHASE_LOCKING">Strict 2-Phase Locking (Serializable 2PL)</option>
              <option value="OPTIMISTIC_OCC">Optimistic Concurrency Control (OCC Versioning)</option>
            </select>
          </div>

          {/* 2. Concurrency Level */}
          <div className="space-y-2">
            <label className="block font-bold text-white/80 uppercase">
              2. Concurrency Volume
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 25, 50].map((lvl) => (
                <motion.button
                  key={lvl}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConcurrencyLevel(lvl)}
                  disabled={isSimulating || isStreaming}
                  className={`py-3 rounded-xl font-bold transition-colors cursor-pointer ${
                    concurrencyLevel === lvl
                      ? 'bg-[#DF367C] text-white shadow-md'
                      : 'bg-[#2A1D26] text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {lvl} Req
                </motion.button>
              ))}
            </div>
          </div>

          {/* 3. Target Resource */}
          <div className="space-y-2">
            <label className="block font-bold text-white/80 uppercase">
              3. Target Seat Resource
            </label>
            <select
              value={targetEventId}
              onChange={(e) => setTargetEventId(e.target.value)}
              disabled={isSimulating || isStreaming}
              className="w-full bg-[#2A1D26] border border-white/15 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-[#DF367C] disabled:opacity-50"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} (1 unit test stock)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRunSingle}
            disabled={isSimulating || isStreaming}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#DF367C] hover:bg-[#c42867] text-white font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Run Single Protocol ({strategy.replace('_', ' ')})</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRunSideBySide}
            disabled={isSimulating || isStreaming}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#FF3E41] hover:bg-[#e03235] text-white font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Columns className="w-4 h-4" />
            <span>Compare Side-by-Side (No-Lock vs Strict 2PL)</span>
          </motion.button>
        </div>

        {/* Live Simulation Progress Indicator */}
        {isSimulating && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-white/70">
              <span>Executing Concurrent Transaction Threads...</span>
              <span>{simulationProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#2A1D26] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#DF367C] to-[#FF3E41]"
                style={{ width: `${simulationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* RESULTS DISPLAY SECTION */}

      {/* 1. SIDE-BY-SIDE COMPARATIVE VIEW */}
      {viewMode === 'SIDE_BY_SIDE' && lastSideBySideResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-display tracking-wide flex items-center gap-2">
              <Columns className="w-5 h-5 text-[#FF7099]" />
              <span>SIDE-BY-SIDE ISOLATION BENCHMARK RESULTS</span>
            </h2>
            <span className="text-xs font-mono text-white/50">
              {concurrencyLevel} Parallel Threads Tested Against Same Resource
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: No Locking */}
            <div className="bg-[#4C3549] border-2 border-red-500/50 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                  NO LOCKING (READ UNCOMMITTED)
                </span>
                {lastSideBySideResult.noLockResult.overbookingDetected && (
                  <motion.span
                    animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-xs font-mono text-red-400 font-bold flex items-center gap-1"
                  >
                    <Flame className="w-4 h-4" /> OVERBOOKING ANOMALY!
                  </motion.span>
                )}
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Committed</div>
                  <div className="text-xl font-black text-red-400">
                    {lastSideBySideResult.noLockResult.successfulCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Rejected</div>
                  <div className="text-xl font-black text-white/60">
                    {lastSideBySideResult.noLockResult.rejectedCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-red-500/40">
                  <div className="text-[10px] text-red-400 uppercase font-bold">Final Stock</div>
                  <motion.div
                    animate={lastSideBySideResult.noLockResult.finalStock < 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-xl font-black text-red-400"
                  >
                    {lastSideBySideResult.noLockResult.finalStock}
                  </motion.div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-300 space-y-1">
                <strong>Lost Update Bug Manifested:</strong>
                <p className="text-[11px] text-white/70">
                  {lastSideBySideResult.noLockResult.successfulCount} clients simultaneous booked 1 physical seat! Final inventory became {lastSideBySideResult.noLockResult.finalStock} (Negative inventory bug).
                </p>
              </div>

              {/* Request Timeline Mini-Table Streaming in Real-time */}
              <div className="max-h-64 overflow-y-auto font-mono text-[11px] space-y-1 pr-1">
                <AnimatePresence initial={false}>
                  {streamedNoLockTxs.map((tx) => {
                    const isAnomaly = tx.status === 'COMMITTED' && tx.txId !== 'TX-1001';
                    return (
                      <motion.div
                        key={tx.txId}
                        initial={reduced ? { opacity: 0 } : { opacity: 0, x: -10, backgroundColor: 'rgba(239,68,68,0.3)' }}
                        animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                        transition={{ duration: 0.25 }}
                        className={`p-2 rounded bg-[#2A1D26] border flex items-center justify-between ${
                          isAnomaly ? 'border-red-500 text-red-300' : 'border-white/5 text-white/80'
                        }`}
                      >
                        <span>{tx.txId} ({tx.clientName})</span>
                        <span className={tx.status === 'COMMITTED' ? 'text-red-400 font-bold' : 'text-white/40'}>
                          {tx.status} ({tx.latencyMs}ms)
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Col: Strict 2PL */}
            <div className="bg-[#4C3549] border-2 border-[#10B981]/60 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                  STRICT TWO-PHASE LOCKING (2PL)
                </span>
                <span className="text-xs font-mono text-[#10B981] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> ACID SERIALIZABLE
                </span>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Committed</div>
                  <div className="text-xl font-black text-[#10B981]">
                    {lastSideBySideResult.twoPlResult.successfulCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase">Rejected (409)</div>
                  <div className="text-xl font-black text-white/60">
                    {lastSideBySideResult.twoPlResult.rejectedCount}
                  </div>
                </div>
                <div className="bg-[#2A1D26] p-3 rounded-xl border border-[#10B981]/40">
                  <div className="text-[10px] text-[#10B981] uppercase font-bold">Final Stock</div>
                  <div className="text-xl font-black text-[#10B981]">
                    {lastSideBySideResult.twoPlResult.finalStock}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-mono text-[#10B981] space-y-1">
                <strong>Zero Overbooking Guarantee:</strong>
                <p className="text-[11px] text-white/70">
                  Exclusive X-Lock acquired on row. Exactly 1 transaction committed, remaining {lastSideBySideResult.twoPlResult.rejectedCount} safely rejected with 409 conflict.
                </p>
              </div>

              {/* Request Timeline Mini-Table Streaming in Real-time */}
              <div className="max-h-64 overflow-y-auto font-mono text-[11px] space-y-1 pr-1">
                <AnimatePresence initial={false}>
                  {streamedTwoPlTxs.map((tx) => (
                    <motion.div
                      key={tx.txId}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -10, backgroundColor: tx.status === 'COMMITTED' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.05)' }}
                      animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                      transition={{ duration: 0.25 }}
                      className="p-2 rounded bg-[#2A1D26] border border-white/5 flex items-center justify-between"
                    >
                      <span>{tx.txId} ({tx.clientName})</span>
                      <span className={tx.status === 'COMMITTED' ? 'text-[#10B981] font-bold' : 'text-white/40'}>
                        {tx.status} ({tx.latencyMs}ms)
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SINGLE RUN DETAILED RESULT */}
      {viewMode === 'SINGLE' && lastSimResult && (
        <div className="space-y-6">
          <div className="bg-[#4C3549] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/10 text-white/70">
                  BENCHMARK RUN: {lastSimResult.runId}
                </span>
                <h2 className="text-2xl font-black text-white font-display tracking-wide mt-1">
                  PROTOCOL: {lastSimResult.strategy.replace('_', ' ')}
                </h2>
              </div>

              {lastSimResult.overbookingDetected ? (
                <motion.span
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5"
                >
                  <Flame className="w-4 h-4" />
                  <span>OVERBOOKING ANOMALY ({lastSimResult.overbookedSeats} DUPLICATES)</span>
                </motion.span>
              ) : (
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ACID SERIALIZABILITY PRESERVED</span>
                </span>
              )}
            </div>

            {/* Summary KPI Strip with Count-Up */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Requests</div>
                <div className="text-xl font-black text-white">{lastSimResult.concurrencyLevel}</div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-[#10B981] uppercase">Committed</div>
                <div className="text-xl font-black text-[#10B981]">{singleCommitted}</div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Rejected</div>
                <div className="text-xl font-black text-white/60">{singleRejected}</div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Final Stock</div>
                <div className={`text-xl font-black ${lastSimResult.finalStock < 0 ? 'text-red-400 font-bold' : 'text-white'}`}>
                  {singleFinalStock}
                </div>
              </div>

              <div className="p-3.5 bg-[#2A1D26] rounded-xl border border-white/10">
                <div className="text-[10px] text-white/40 uppercase">Duration</div>
                <div className="text-xl font-black text-[#FF7099]">{lastSimResult.durationMs}ms</div>
              </div>
            </div>

            {/* Live Streaming Transaction Execution Timeline Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <span>Thread Transaction Execution Log:</span>
                  {isStreaming && (
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="text-xs text-[#FF7099]"
                    >
                      (Streaming in real time...)
                    </motion.span>
                  )}
                </h3>
                <span className="text-xs font-mono text-white/50">
                  {streamedSingleTxs.length} / {lastSimResult.transactions.length} rows
                </span>
              </div>

              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="sticky top-0 bg-[#4C3549] border-b border-white/10 text-white/40 text-[10px] uppercase">
                    <tr>
                      <th className="pb-2 pr-3">Tx ID</th>
                      <th className="pb-2 px-3">Client Worker</th>
                      <th className="pb-2 px-3">Status</th>
                      <th className="pb-2 px-3">Current Step</th>
                      <th className="pb-2 px-3">Message / Evaluation</th>
                      <th className="pb-2 pl-3">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    <AnimatePresence initial={false}>
                      {streamedSingleTxs.map((tx) => {
                        const isOverbookAnomaly =
                          lastSimResult.strategy === 'NO_LOCKING' &&
                          tx.status === 'COMMITTED' &&
                          tx.txId !== 'TX-1001';

                        return (
                          <motion.tr
                            key={tx.txId}
                            initial={
                              reduced
                                ? { opacity: 0 }
                                : {
                                    opacity: 0,
                                    x: -12,
                                    backgroundColor: isOverbookAnomaly
                                      ? 'rgba(239, 68, 68, 0.4)'
                                      : tx.status === 'COMMITTED'
                                      ? 'rgba(16, 185, 129, 0.25)'
                                      : 'rgba(255, 255, 255, 0.05)',
                                  }
                            }
                            animate={{ opacity: 1, x: 0, backgroundColor: isOverbookAnomaly ? 'rgba(239,68,68,0.1)' : 'transparent' }}
                            transition={{ duration: 0.25 }}
                            className={`hover:bg-white/5 ${isOverbookAnomaly ? 'text-red-300 font-semibold' : ''}`}
                          >
                            <td className="py-2.5 pr-3 font-bold text-[#FF7099]">{tx.txId}</td>
                            <td className="py-2.5 px-3 text-white">{tx.clientName}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  tx.status === 'COMMITTED'
                                    ? isOverbookAnomaly
                                      ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                                      : 'bg-[#10B981]/20 text-[#10B981]'
                                    : tx.status === 'REJECTED'
                                    ? 'bg-white/10 text-white/50'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-white/60">{tx.currentStep}</td>
                            <td className="py-2.5 px-3 text-white/70 truncate max-w-xs">{tx.message}</td>
                            <td className="py-2.5 pl-3 text-white/40">{tx.latencyMs}ms</td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Literal SQL Statement Traces */}
            <div className="space-y-3 pt-4 border-t border-white/10 font-mono text-xs">
              <button
                onClick={() => setShowSqlTrace(!showSqlTrace)}
                className="flex items-center gap-2 text-[#FF7099] hover:underline font-bold cursor-pointer"
              >
                <Code className="w-4 h-4" />
                <span>{showSqlTrace ? 'Hide Literal SQL Traces' : 'Show Literal SQL Traces'}</span>
              </button>

              <AnimatePresence>
                {showSqlTrace && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#2A1D26] p-4 rounded-2xl border border-white/10 space-y-2 text-[11px] text-[#FF7099] overflow-x-auto"
                  >
                    <div className="text-white/40 uppercase text-[10px]">Raw SQL Query Sequence:</div>
                    {lastSimResult.dbLogs.map((log, i) => (
                      <div key={i} className="text-white/80">{log}</div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
