import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap, Play, Clock, Edit2, Trash2, Plus, ArrowRight,
  CheckCircle2, Sparkles, X, MessageSquare, AlertCircle,
  PlayCircle, CornerDownRight, Check, BookOpen, Layers
} from 'lucide-react';
import { format } from 'date-fns';
import { presetRuleTemplates, presetIftttTemplates, presetCronTemplates } from '../data/mockAutomations';

export default function Automations() {
  const {
    quickRules, setQuickRules,
    iftttFlows, setIftttFlows,
    cronJobs, setCronJobs,
    showToast, addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState('quick');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleKeywords, setNewRuleKeywords] = useState('');
  const [newRuleAction, setNewRuleAction] = useState('reply');
  const [newRuleValue, setNewRuleValue] = useState('');

  // Live Test Simulator State
  const [testInput, setTestInput] = useState('How much is the linen collection?');
  const [simulationResult, setSimulationResult] = useState(null);

  const toggleRule = (id) => {
    setQuickRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    const rule = quickRules.find(r => r.id === id);
    const newState = !rule?.enabled;
    showToast(`Rule "${rule?.title}" ${newState ? 'activated' : 'paused'}`, newState ? 'success' : 'info');
  };

  const deleteRule = (id) => {
    setQuickRules(prev => prev.filter(r => r.id !== id));
    showToast('Rule removed', 'info');
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newRuleTitle.trim()) {
      showToast('Please provide a rule title', 'error');
      return;
    }

    const rule = {
      id: `qr-${Date.now()}`,
      title: newRuleTitle.trim(),
      description: `When comment contains "${newRuleKeywords}" → ${newRuleAction}`,
      enabled: true,
      trigger: 'comment',
      keywords: newRuleKeywords.split(',').map(k => k.trim()).filter(Boolean),
      action: newRuleAction,
      actionValue: newRuleValue || 'Thanks for your comment! Link in bio ✨',
      icon: newRuleAction === 'reply' ? '💬' : newRuleAction === 'send_dm' ? '📩' : '❤️',
    };

    setQuickRules(prev => [rule, ...prev]);
    addNotification({
      type: 'automation',
      message: `Created automation rule "${rule.title}" ⚡`,
      icon: '⚡'
    });
    showToast('Automation rule created and activated! ⚡');
    setShowRuleModal(false);
    setNewRuleTitle('');
    setNewRuleKeywords('');
    setNewRuleValue('');
  };

  const handleInstallTemplate = (tpl) => {
    const rule = {
      id: `qr-${Date.now()}`,
      title: tpl.title,
      description: tpl.description,
      enabled: true,
      trigger: tpl.trigger,
      keywords: tpl.keywords,
      action: tpl.action,
      actionValue: tpl.actionValue,
      icon: tpl.icon || '⚡',
    };

    setQuickRules(prev => [rule, ...prev]);
    setShowTemplateModal(false);
    showToast(`Installed "${rule.title}" template! 🚀`);
  };

  const handleRunSimulation = (e) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const lowerInput = testInput.toLowerCase();
    const matchedRule = quickRules.find(r =>
      r.enabled && r.keywords?.some(kw => lowerInput.includes(kw.toLowerCase()))
    );

    if (matchedRule) {
      setSimulationResult({
        matched: true,
        ruleName: matchedRule.title,
        action: matchedRule.action,
        reply: matchedRule.actionValue || 'Thank you for reaching out! Check our link in bio ✨',
        triggerKw: matchedRule.keywords.find(kw => lowerInput.includes(kw.toLowerCase()))
      });
      showToast('Rule matched and triggered! 🎯');
    } else {
      setSimulationResult({
        matched: false,
        message: 'No active automation rules matched the test text.'
      });
      showToast('No keyword matches found in active rules', 'info');
    }
  };

  const toggleFlow = (id) => {
    setIftttFlows(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    const flow = iftttFlows.find(f => f.id === id);
    showToast(`Workflow "${flow?.name}" ${!flow?.enabled ? 'enabled' : 'paused'}`);
  };

  const deleteFlow = (id) => {
    setIftttFlows(prev => prev.filter(f => f.id !== id));
    showToast('Workflow removed', 'info');
  };

  const toggleCron = (id) => {
    setCronJobs(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
    const job = cronJobs.find(c => c.id === id);
    showToast(`Scheduled task "${job?.action}" ${!job?.enabled ? 'enabled' : 'paused'}`);
  };

  const deleteCron = (id) => {
    setCronJobs(prev => prev.filter(c => c.id !== id));
    showToast('Task removed', 'info');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Automation & Trigger Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automate direct messages, auto-comment replies, and scheduled background tasks.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="btn-secondary text-xs !py-2.5 !px-3.5 shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Browse Preset Templates</span>
          </button>
          <button
            onClick={() => setShowRuleModal(true)}
            className="btn-primary text-xs !py-2.5 !px-4 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Custom Rule</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800 p-1.5 rounded-2xl w-fit shadow-sm">
        {[
          { id: 'quick', label: 'Trigger Rules', icon: Zap },
          { id: 'simulator', label: '🧪 Live Test Simulator', icon: PlayCircle },
          { id: 'ifttt', label: 'Multi-Step Workflows', icon: Play },
          { id: 'cron',  label: 'Scheduled Tasks', icon: Clock },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id
                ? 'ig-gradient text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: TRIGGER RULES */}
      {activeTab === 'quick' && (
        <div className="space-y-6 animate-fade-in">
          {quickRules.length === 0 ? (
            <div className="card p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No active automation rules
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Create a custom trigger rule from scratch or install pre-built templates for pricing inquiries and DM welcome notes.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="btn-secondary text-xs !py-2"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Choose from Templates
                </button>
                <button
                  onClick={() => setShowRuleModal(true)}
                  className="btn-primary text-xs !py-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Custom Rule
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {quickRules.map((rule) => (
                <div key={rule.id} className="card card-hover p-5 flex flex-col justify-between relative group">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-slate-50 dark:bg-slate-800/80 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        {rule.icon || '⚡'}
                      </div>

                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`w-12 h-6 rounded-full transition-all relative p-0.5 ${
                          rule.enabled ? 'toggle-active' : 'toggle-inactive'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                            rule.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                      {rule.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {rule.description}
                    </p>

                    {rule.keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {rule.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="text-[11px] font-semibold bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/40 px-2 py-0.5 rounded-lg"
                          >
                            "{kw}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Action: {rule.action?.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowRuleModal(true)}
                className="card p-6 flex flex-col items-center justify-center min-h-[220px] border-dashed border-2 border-slate-200 dark:border-slate-800 hover:border-pink-500/60 hover:bg-pink-50/20 dark:hover:bg-pink-950/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Create Custom Rule
                </span>
                <p className="text-xs text-slate-400 mt-1">Add keywords & automated responses</p>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="card p-6 sm:p-8 max-w-3xl mx-auto shadow-sm space-y-6 animate-fade-in">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-pink-500" />
              <span>Interactive Rule Simulation Playground</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Test your active trigger rules against incoming customer messages to verify match logic.
            </p>
          </div>

          <form onSubmit={handleRunSimulation} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Simulated Incoming Customer Comment or DM
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input text-xs"
                  placeholder="e.g. How much is the shipping cost to LA?"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary !px-5 text-xs font-bold shrink-0">
                  <PlayCircle className="w-4 h-4" /> Run Test
                </button>
              </div>
            </div>
          </form>

          {/* Result Box */}
          {simulationResult && (
            <div className={`p-5 rounded-2xl border transition-all animate-fade-in ${
              simulationResult.matched
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
            }`}>
              {simulationResult.matched ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Trigger Matched: "{simulationResult.ruleName}"</span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <p>Matched Keyword: <span className="font-bold text-pink-600">"{simulationResult.triggerKw}"</span></p>
                    <p>Automated Action: <span className="font-bold uppercase">{simulationResult.action}</span></p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Automated Customer Response Generated:
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      "{simulationResult.reply}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>{simulationResult.message} Create a trigger rule with matching keywords to test response flows.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: IFTTT WORKFLOWS */}
      {activeTab === 'ifttt' && (
        <div className="space-y-4 animate-fade-in">
          {iftttFlows.length === 0 ? (
            <div className="card p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-500 flex items-center justify-center mx-auto shadow-sm">
                <Play className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No active multi-step workflows
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Connect multi-action pipelines such as posting 1st comments and alerting team channels.
              </p>
              <button
                onClick={() => {
                  const tpl = presetIftttTemplates[0];
                  setIftttFlows(prev => [...prev, { ...tpl, id: `flow-${Date.now()}`, enabled: true }]);
                  showToast('Added multi-step workflow from template! ⚡');
                }}
                className="btn-primary text-xs !py-2.5 mx-auto"
              >
                <Plus className="w-4 h-4" /> Install Booster Workflow
              </button>
            </div>
          ) : (
            iftttFlows.map((flow) => (
              <div key={flow.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {flow.name}
                    </h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      flow.enabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {flow.enabled ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex-1">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                        IF TRIGGER OCCURS
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {flow.trigger?.label}
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-pink-500 hidden sm:block shrink-0" />

                    <div className="flex-1 space-y-2">
                      {flow.actions?.map((act, i) => (
                        <div key={i} className="p-3 rounded-xl bg-gradient-to-br from-pink-500/5 to-purple-500/5 border border-pink-500/20 dark:border-pink-500/30">
                          <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 block mb-0.5 uppercase tracking-wider">
                            {i === 0 ? 'THEN EXECUTE' : 'AND ALSO'}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {act.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toggleFlow(flow.id)}
                    className={`btn-secondary text-xs ${
                      flow.enabled ? '!text-rose-500 hover:!bg-rose-50 dark:hover:!bg-rose-950/40' : ''
                    }`}
                  >
                    {flow.enabled ? 'Pause' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteFlow(flow.id)}
                    className="p-2 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: CRON SCHEDULES */}
      {activeTab === 'cron' && (
        <div className="space-y-4 animate-fade-in">
          {cronJobs.length === 0 ? (
            <div className="card p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No scheduled background tasks
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Add periodic automated health-checks, analytics summaries, or post queue verifiers.
              </p>
              <button
                onClick={() => {
                  const tpl = presetCronTemplates[0];
                  setCronJobs(prev => [...prev, { ...tpl, id: `cron-${Date.now()}`, enabled: true, lastRun: new Date().toISOString() }]);
                  showToast('Added scheduled background task! ⏰');
                }}
                className="btn-primary text-xs !py-2.5 mx-auto"
              >
                <Plus className="w-4 h-4" /> Add Daily Queue Verifier
              </button>
            </div>
          ) : (
            <div className="card overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Scheduled Task</th>
                    <th className="py-3 px-5">Frequency</th>
                    <th className="py-3 px-5">Last Execution</th>
                    <th className="py-3 px-5 text-right">Toggle / Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cronJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-5 font-bold text-xs text-slate-800 dark:text-slate-200">
                        {job.action}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">{job.frequency}</span> at {job.time}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-400">
                        {job.lastRun ? format(new Date(job.lastRun), 'MMM d, h:mm a') : 'Pending'}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => toggleCron(job.id)}
                            className={`w-10 h-5 rounded-full transition-all relative p-0.5 ${
                              job.enabled ? 'toggle-active' : 'toggle-inactive'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md ${
                                job.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => deleteCron(job.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Template Library */}
      {showTemplateModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowTemplateModal(false)}
        >
          <div
            className="card max-w-lg w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-pink-500" />
                <span>Automation Template Library</span>
              </h3>
              <button onClick={() => setShowTemplateModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              1-click install high-converting Instagram automation templates:
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {presetRuleTemplates.map((tpl, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-3 hover:border-pink-500/50 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{tpl.icon}</span>
                      <span>{tpl.title}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{tpl.description}</p>
                  </div>
                  <button
                    onClick={() => handleInstallTemplate(tpl)}
                    className="btn-primary text-xs !py-1.5 !px-3 shrink-0"
                  >
                    Install
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Custom Automation Rule */}
      {showRuleModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowRuleModal(false)}
        >
          <div
            className="card max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Create Custom Automation Rule
              </h3>
              <button
                onClick={() => setShowRuleModal(false)}
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Rule Name
                </label>
                <input
                  className="input text-xs"
                  placeholder="e.g. Auto-Reply to Collaboration Inquiries"
                  value={newRuleTitle}
                  onChange={(e) => setNewRuleTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Trigger Keywords (comma separated)
                </label>
                <input
                  className="input text-xs"
                  placeholder="collab, partnership, sponsor, promote"
                  value={newRuleKeywords}
                  onChange={(e) => setNewRuleKeywords(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Automated Action
                </label>
                <select
                  className="input text-xs"
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value)}
                >
                  <option value="reply">Public Comment Reply</option>
                  <option value="send_dm">Direct Message (DM)</option>
                  <option value="like_comment">Like the Comment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Response Body
                </label>
                <textarea
                  className="input text-xs resize-none"
                  rows={3}
                  placeholder="Hey! Thanks for reaching out. Please send your pitch to info@brand.com!"
                  value={newRuleValue}
                  onChange={(e) => setNewRuleValue(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="btn-secondary flex-1 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 text-xs"
                >
                  Create & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
