import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, LayoutDashboard, TrendingUp, Map, FileText, LogOut,
  Calendar, Activity, Bot, Radio, Zap, FlaskConical,
  MapPin, BarChart2, AlertTriangle, ClipboardList,
  Droplets, Users, Truck, Stethoscope, UserCheck,
  DollarSign, ChevronRight, CheckCircle2, AlertOctagon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPrediction } from '../services/api';
import type { PredictionInput, PredictionResult } from '../types';
import '../styles/dashboard.css';

const WHO_REGIONS = [
  'Greater Equatoria', 'Greater Upper Nile', 'Greater Bahr el Ghazal',
  'Jonglei', 'Unity', 'Upper Nile', 'Central Equatoria', 'Eastern Equatoria',
  'Western Equatoria', 'Northern Bahr el Ghazal', 'Western Bahr el Ghazal', 'Warrap',
  'Lakes', 'AFRO Region', 'Other'
];

const SEVERITY_CONFIG = {
  Critical: { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', label: 'CRITICAL' },
  High:     { color: '#ea580c', bg: '#fff7ed', border: '#fdba74', label: 'HIGH' },
  Moderate: { color: '#d97706', bg: '#fffbeb', border: '#fcd34d', label: 'MODERATE' },
  Low:      { color: '#16a34a', bg: '#f0fdf4', border: '#86efac', label: 'LOW' },
};

function SeverityDot({ severity }: { severity: string }) {
  const cfg = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.Moderate;
  return <span className="severity-dot" style={{ background: cfg.color }} />;
}

function SeverityBadge({ severity, score }: { severity: string; score: number }) {
  const cfg = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.Moderate;
  return (
    <div className="severity-badge-wrapper" style={{ background: cfg.bg, border: `2px solid ${cfg.border}` }}>
      <SeverityDot severity={severity} />
      <div>
        <div className="severity-badge-title" style={{ color: cfg.color }}>{cfg.label} RISK</div>
        <div className="severity-badge-score">Risk Score: {score}/100</div>
      </div>
      <div className="severity-badge-gauge">
        <div className="severity-gauge-track">
          <div className="severity-gauge-fill" style={{ width: `${score}%`, background: cfg.color }} />
        </div>
      </div>
    </div>
  );
}

function PredictionCard({ label, data }: { label: string; data: { min: number; max: number; likely: number } }) {
  return (
    <div className="prediction-card">
      <div className="prediction-card-label">{label}</div>
      <div className="prediction-card-likely">{data.likely.toLocaleString()}</div>
      <div className="prediction-card-range">
        <span className="range-label">Range:</span>
        <span>{data.min.toLocaleString()} – {data.max.toLocaleString()}</span>
      </div>
    </div>
  );
}

function ActionList({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <div className="action-list-block">
      <h4 className="action-list-title">{icon} {title}</h4>
      <ul className="action-list">
        {items.map((item, i) => (
          <li key={i} className="action-list-item">
            <ChevronRight size={14} className="action-chevron" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<PredictionInput>({ cases: 0, deaths: 0, region: '', cfr: 0 });
  const [sendEmail, setSendEmail] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'actions' | 'resources' | 'metrics'>('actions');

  function handleLogout() { logout(); navigate('/login'); }
  function update(field: keyof PredictionInput, value: string | number) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.region) return setError('Please select a WHO region.');
    if (form.cases < 0 || form.deaths < 0 || form.cfr < 0) return setError('Values cannot be negative.');
    if (form.cfr > 100) return setError('CFR cannot exceed 100%.');

    setLoading(true);
    setPrediction(null);
    try {
      const res = await getPrediction({ ...form, sendEmail });
      setPrediction(res.prediction);
      setTimeout(() => document.getElementById('prediction-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Shield size={30} className="sidebar-shield-icon" strokeWidth={1.5} />
          <div>
            <div className="sidebar-brand-name">Afya Shield</div>
            <div className="sidebar-brand-sub">Outbreak Intelligence</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-nav-item sidebar-nav-active">
            <LayoutDashboard size={16} /><span>Dashboard</span>
          </div>
          <div className="sidebar-nav-item sidebar-nav-disabled">
            <TrendingUp size={16} /><span>History</span>
            <span className="sidebar-nav-badge">Soon</span>
          </div>
          <div className="sidebar-nav-item sidebar-nav-disabled">
            <Map size={16} /><span>Outbreak Map</span>
            <span className="sidebar-nav-badge">Soon</span>
          </div>
          <div className="sidebar-nav-item sidebar-nav-disabled">
            <FileText size={16} /><span>Reports</span>
            <span className="sidebar-nav-badge">Soon</span>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-org">{user?.organization || user?.email}</div>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {/* Header */
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <h1 className="dashboard-title">Outbreak Analysis</h1>
            <p className="dashboard-subtitle">Enter cholera data to generate AI-powered predictions and NGO response plans</p>
          </div>
          <div className="dashboard-header-right">
            <div className="dashboard-date-badge">
              <Calendar size={13} />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Stats Banner */}
        <div className="dashboard-stats-banner">
          <div className="stats-banner-item">
            <Activity size={26} className="stats-banner-icon-svg" />
            <div>
              <div className="stats-banner-value">Active Analysis</div>
              <div className="stats-banner-label">South Sudan</div>
            </div>
          </div>
          <div className="stats-banner-item">
            <Bot size={26} className="stats-banner-icon-svg" />
            <div>
              <div className="stats-banner-value">Predictor</div>
              <div className="stats-banner-label">Prediction Engine</div>
            </div>
          </div>
          <div className="stats-banner-item">
            <Radio size={26} className="stats-banner-icon-svg" />
            <div>
              <div className="stats-banner-value">WHO GTFCC</div>
              <div className="stats-banner-label">Protocol Aligned</div>
            </div>
          </div>
          <div className="stats-banner-item">
            <Zap size={26} className="stats-banner-icon-svg" />
            <div>
              <div className="stats-banner-value">&lt; 30 sec</div>
              <div className="stats-banner-label">Analysis Time</div>
            </div>
          </div>
        </div>

        {/* Data Input Form */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title-group">
              <FlaskConical size={20} className="dashboard-card-icon-svg" />
              <div>
                <h2 className="dashboard-card-title">Enter Outbreak Data</h2>
                <p className="dashboard-card-desc">Input current cholera surveillance data for AI analysis</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="form-error-banner">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-grid-4">
              <div className="form-field">
                <label className="form-label">
                  <Activity size={13} /> Active Cases
                </label>
                <input type="number" className="form-input" placeholder="e.g. 250"
                  min="0" value={form.cases || ''} onChange={e => update('cases', Number(e.target.value))} required />
                <span className="form-hint">Total confirmed cases</span>
              </div>
              <div className="form-field">
                <label className="form-label">
                  <AlertOctagon size={13} /> Reported Deaths
                </label>
                <input type="number" className="form-input" placeholder="e.g. 12"
                  min="0" value={form.deaths || ''} onChange={e => update('deaths', Number(e.target.value))} required />
                <span className="form-hint">Deaths attributed to cholera</span>
              </div>
              <div className="form-field">
                <label className="form-label">
                  <MapPin size={13} /> WHO Region
                </label>
                <select className="form-input form-select" value={form.region}
                  onChange={e => update('region', e.target.value)} required>
                  <option value="">Select region...</option>
                  {WHO_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <span className="form-hint">Affected geographic region</span>
              </div>
              <div className="form-field">
                <label className="form-label">
                  <BarChart2 size={13} /> Case Fatality Rate (%)
                </label>
                <input type="number" className="form-input" placeholder="e.g. 2.4"
                  min="0" max="100" step="0.1" value={form.cfr || ''}
                  onChange={e => update('cfr', Number(e.target.value))} required />
                <span className="form-hint">Deaths / cases x 100</span>
              </div>
            </div>

            <div className="form-email-row">
              <label className="form-checkbox-label">
                <input type="checkbox" className="form-checkbox" checked={sendEmail}
                  onChange={e => setSendEmail(e.target.checked)} />
                <span className="form-checkbox-custom" />
                <div>
                  <span className="form-checkbox-text">Email me the full prediction report</span>
                  <span className="form-checkbox-sub">Sends a detailed report to {user?.email}</span>
                </div>
              </label>
            </div>

            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? (
                <span className="form-btn-loading">
                  <span className="form-spinner" />
                  Analyzing outbreak data with AI...
                </span>
              ) : (
                <span className="form-btn-content">
                  <Bot size={16} /> Generate AI Prediction &amp; Action Plan
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="analysis-loading">
            <Shield size={48} className="analysis-loading-shield" strokeWidth={1.5} />
            <h3>Afya Shield is analyzing your data...</h3>
            <p>Analyzing epidemiological patterns and generating your action plan.</p>
            <div className="analysis-loading-steps">
              <div className="loading-step loading-step-active">
                <span className="step-dot step-dot-active" /> Analyzing outbreak patterns
              </div>
              <div className="loading-step">
                <span className="step-dot" /> Calculating case projections
              </div>
              <div className="loading-step">
                <span className="step-dot" /> Generating NGO action plan
              </div>
            </div>
          </div>
        )}

        {/* Prediction Results */}
        {prediction && !loading && (
          <div id="prediction-results" className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                <ClipboardList size={20} /> AI Prediction Report
              </h2>
              <span className="results-timestamp">Generated {new Date().toLocaleTimeString()}</span>
            </div>

            {/* Severity + Summary */}
            <div className="results-top-grid">
              <SeverityBadge severity={prediction.severity} score={prediction.severity_score} />
              <div className="results-summary-card">
                <h3 className="results-summary-title">Epidemiological Summary</h3>
                <p className="results-summary-text">{prediction.summary}</p>
                <div className="results-who-guidance">
                  <span className="who-badge">WHO</span>
                  <p>{prediction.who_guidance}</p>
                </div>
              </div>
            </div>

            {/* Case Projections */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-title-group">
                  <TrendingUp size={18} className="dashboard-card-icon-svg" />
                  <h3 className="dashboard-card-title">Case Projections</h3>
                </div>
              </div>
              <div className="projection-cards-grid">
                <PredictionCard label="7-Day Forecast" data={prediction.predictions.day_7} />
                <PredictionCard label="14-Day Forecast" data={prediction.predictions.day_14} />
                <PredictionCard label="30-Day Forecast" data={prediction.predictions.day_30} />
              </div>
            </div>

            {/* Risk Factors */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-title-group">
                  <AlertTriangle size={18} className="dashboard-card-icon-svg" />
                  <h3 className="dashboard-card-title">Key Risk Factors</h3>
                </div>
              </div>
              <div className="risk-factors-grid">
                {prediction.risk_factors.map((factor, i) => (
                  <div key={i} className="risk-factor-chip">
                    <span className="risk-factor-num">{i + 1}</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NGO Action Plan */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-title-group">
                  <ClipboardList size={18} className="dashboard-card-icon-svg" />
                  <h3 className="dashboard-card-title">NGO Action Plan</h3>
                </div>
                <div className="tab-group">
                  <button className={`tab-btn ${activeTab === 'actions' ? 'tab-btn-active' : ''}`} onClick={() => setActiveTab('actions')}>Response Actions</button>
                  <button className={`tab-btn ${activeTab === 'resources' ? 'tab-btn-active' : ''}`} onClick={() => setActiveTab('resources')}>Resources</button>
                  <button className={`tab-btn ${activeTab === 'metrics' ? 'tab-btn-active' : ''}`} onClick={() => setActiveTab('metrics')}>Metrics</button>
                </div>
              </div>

              {activeTab === 'actions' && (
                <div className="actions-grid">
                  <ActionList title="Immediate (48h)" icon={<Zap size={14} />} items={prediction.ngo_actions.immediate_48h} />
                  <ActionList title="WASH Interventions" icon={<Droplets size={14} />} items={prediction.ngo_actions.wash_interventions} />
                  <ActionList title="Community Engagement" icon={<Users size={14} />} items={prediction.ngo_actions.community_engagement} />
                  <ActionList title="Logistics" icon={<Truck size={14} />} items={prediction.ngo_actions.logistics} />
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="resources-grid">
                  <div className="resource-block">
                    <h4 className="resource-block-title"><Stethoscope size={14} /> Medical Supplies</h4>
                    <ul className="resource-list">
                      {prediction.resources_needed.medical_supplies.map((item, i) => (
                        <li key={i} className="resource-item"><ChevronRight size={12} />{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="resource-block">
                    <h4 className="resource-block-title"><UserCheck size={14} /> Personnel Needed</h4>
                    <ul className="resource-list">
                      {prediction.resources_needed.personnel.map((role, i) => (
                        <li key={i} className="resource-item"><ChevronRight size={12} />{role}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="budget-card">
                    <div className="budget-label"><DollarSign size={14} /> Estimated Budget Required</div>
                    <div className="budget-amount">
                      ${prediction.resources_needed.estimated_budget_usd.toLocaleString()}
                      <span className="budget-currency"> USD</span>
                    </div>
                    <div className="budget-note">Based on WHO standard response costs for this severity level</div>
                  </div>
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="metrics-list">
                  {prediction.success_metrics.map((metric, i) => (
                    <div key={i} className="metric-item">
                      <CheckCircle2 size={16} className="metric-check" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
