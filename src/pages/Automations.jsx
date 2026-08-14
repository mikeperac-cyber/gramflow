import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Play, Clock, Edit2, Trash2, Plus, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Automations() {
  const { quickRules, setQuickRules, iftttFlows, setIftttFlows, cronJobs, setCronJobs, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('quick');

  const toggleRule = (id) => {
    setQuickRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    const rule = quickRules.find(r => r.id === id);
    showToast(`Rule "${rule.title}" ${!rule.enabled ? 'enabled' : 'disabled'}`);
  };

  const toggleFlow = (id) => {
    setIftttFlows(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    const flow = iftttFlows.find(f => f.id === id);
    showToast(`Flow "${flow.name}" ${!flow.enabled ? 'enabled' : 'disabled'}`);
  };

  const toggleCron = (id) => {
    setCronJobs(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
    const job = cronJobs.find(c => c.id === id);
    showToast(`Scheduled job "${job.action}" ${!job.enabled ? 'enabled' : 'disabled'}`);
  };

  const deleteCron = (id) => {
    setCronJobs(prev => prev.filter(c => c.id !== id));
    showToast('Scheduled job deleted');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Automations</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Put your Instagram growth on autopilot.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[
          { id: 'quick', label: 'Quick Rules', icon: Zap },
          { id: 'ifttt', label: 'Workflows',   icon: Play },
          { id: 'cron',  label: 'Scheduled',   icon: Clock },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t.id
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Quick Rules */}
      {activeTab === 'quick' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {quickRules.map(rule => (
            <div key={rule.id} className="card p-5 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {rule.icon}
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${rule.enabled ? 'toggle-active' : 'toggle-inactive'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{rule.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1">
                {rule.description}
              </p>
              {rule.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {rule.keywords.map(kw => (
                    <span key={kw} className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">
                      "{kw}"
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wide text-gray-400">Action: {rule.action.replace('_', ' ')}</span>
                <button className="text-gram-500 hover:text-gram-700"><Edit2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          <button className="card p-5 flex flex-col items-center justify-center min-h-[220px] border-dashed border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
            <div className="w-10 h-10 bg-gram-50 dark:bg-gram-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-gram-600 dark:text-gram-400" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Create Custom Rule</span>
          </button>
        </div>
      )}

      {/* IFTTT Workflows */}
      {activeTab === 'ifttt' && (
        <div className="space-y-4 animate-fade-in">
          {iftttFlows.map(flow => (
            <div key={flow.id} className="card p-0 overflow-hidden flex flex-col md:flex-row">
              <div className={`md:w-2 bg-gradient-to-b ${flow.color} h-2 md:h-auto`} />
              <div className="p-5 flex-1 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{flow.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${flow.enabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {flow.enabled ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
                    {/* Trigger */}
                    <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm border border-gray-100 dark:border-gray-700 flex-1">
                      <span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase tracking-wide">If this happens</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{flow.trigger.label}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 hidden sm:block shrink-0" />
                    {/* Actions */}
                    <div className="flex-1 space-y-2">
                      {flow.actions.map((act, i) => (
                        <div key={i} className="bg-gram-50 dark:bg-gram-900/20 px-3 py-2 rounded-lg text-sm border border-gram-100 dark:border-gram-900/50">
                          <span className="text-[10px] font-bold text-gram-500 block mb-0.5 uppercase tracking-wide">{i === 0 ? 'Then do this' : 'And then do this'}</span>
                          <span className="font-medium text-gram-900 dark:text-gram-100">{act.label}</span>
                          {act.value && <p className="text-xs text-gram-600 dark:text-gram-400 mt-1 line-clamp-1">"{act.value}"</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col justify-end gap-3 shrink-0 pt-4 md:pt-0 border-t border-gray-100 dark:border-gray-800 md:border-none">
                  <button
                    onClick={() => toggleFlow(flow.id)}
                    className={`btn-secondary ${flow.enabled ? '!bg-red-50 !text-red-600 dark:!bg-red-900/20 dark:!text-red-400 hover:!bg-red-100 dark:hover:!bg-red-900/40' : ''}`}
                  >
                    {flow.enabled ? 'Pause Workflow' : 'Enable Workflow'}
                  </button>
                  <button className="btn-secondary">Edit Flow</button>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full card p-4 border-dashed border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gram-600 dark:text-gram-400 font-medium">
            <Plus className="w-5 h-5" /> Build New Workflow
          </button>
        </div>
      )}

      {/* Cron Jobs */}
      {activeTab === 'cron' && (
        <div className="card overflow-hidden animate-fade-in">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="py-3 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Action</th>
                <th className="py-3 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Schedule</th>
                <th className="py-3 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Last Run</th>
                <th className="py-3 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {cronJobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                  <td className="py-4 px-5">
                    <span className="font-medium text-gray-900 dark:text-white">{job.action}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-800 dark:text-gray-200">{job.frequency} at {job.time}</span>
                      {job.day && <span className="text-[10px] text-gray-400 uppercase font-medium">{job.day}</span>}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-sm text-gray-500">{format(new Date(job.lastRun), 'MMM d, h:mm a')}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => toggleCron(job.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${job.enabled ? 'toggle-active' : 'toggle-inactive'}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${job.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <button onClick={() => deleteCron(job.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
            <button className="btn-primary text-xs flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Scheduled Task</button>
          </div>
        </div>
      )}
    </div>
  );
}
