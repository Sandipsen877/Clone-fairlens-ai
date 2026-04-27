import { useEffect, useMemo, useRef, useState } from 'react';
import {
  classifyDI,
  classifyEO,
  classifyFS,
  formatBytes,
  formatTimestamp,
} from '../lib/classify.js';
import { exportDashboardAsPdf } from '../lib/exportPdf.js';

const API_URL =
  (typeof window !== 'undefined' && window.UNBIASED_API_URL) || '/api/analyze';

/* ---------------- Dropzone ---------------- */
function Dropzone({ kind, accept, file, onFile, onClear }) {
  const inputRef = useRef(null);
  const elRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const onClick = (e) => {
    if (e.target.closest('.dz-clear')) return;
    inputRef.current?.click();
  };

  const onChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) onFile(f);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  const cls = ['dropzone'];
  if (dragging) cls.push('dragging');
  if (file) cls.push('has-file');

  const isDataset = kind === 'dataset';
  const fileLabel = isDataset ? '.csv' : '.pkl';

  return (
    <div
      className={cls.join(' ')}
      ref={elRef}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={onChange}
      />
      <div className="dz-icon">
        {isDataset ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M14 3v6h6M9 13h6M9 17h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="m3 7 9 5 9-5M12 12v10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {!file && (
        <div className="dz-body">
          <div className="dz-title">
            Drop your <strong>{fileLabel}</strong>{' '}
            {isDataset ? 'dataset' : 'model'}
          </div>
          <div className="dz-sub">or click to browse</div>
        </div>
      )}
      {file && (
        <div className="dz-file">
          <span className="dz-file-name">
            {file.name} · {formatBytes(file.size)}
          </span>
          <button
            type="button"
            className="dz-clear"
            aria-label="Remove file"
            onClick={(e) => {
              e.stopPropagation();
              if (inputRef.current) inputRef.current.value = '';
              onClear();
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Meta chips ---------------- */
function MetaChip({ label, value }) {
  return (
    <span className="meta-chip">
      {label} <strong>{String(value)}</strong>
    </span>
  );
}

function TimestampChip({ date }) {
  return (
    <span className="meta-chip meta-chip-time">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9"></circle>
        <polyline points="12 7 12 12 15.5 14"></polyline>
      </svg>
      <span>Generated</span>
      <strong>{formatTimestamp(date)}</strong>
    </span>
  );
}

/* ---------------- KPI card ---------------- */
function KpiCard({ label, value, hint, fillPct, klass }) {
  const cls = ['dash-card', 'kpi'];
  if (klass) cls.push(klass);
  return (
    <div className={cls.join(' ')}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-bar">
        <div className="metric-bar-fill" style={{ width: `${fillPct}%` }} />
      </div>
      <div className="metric-hint">{hint}</div>
    </div>
  );
}

function FairnessKpi({ label, value, unit, hint, fillPct, klass }) {
  const cls = ['dash-card', 'kpi'];
  if (klass) cls.push(klass);
  return (
    <div className={cls.join(' ')}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">
        {value}
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
      <div className="metric-bar">
        <div className="metric-bar-fill" style={{ width: `${fillPct}%` }} />
      </div>
      <div className="metric-hint">{hint}</div>
    </div>
  );
}

/* ---------------- Group bar (animates in) ---------------- */
function GroupBar({ name, pct, count }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);
  return (
    <div className="bar-group">
      <div className="bar-track">
        <div className="bar bar-dyn" style={{ width: `${w}%` }} />
      </div>
      <div className="bar-label">
        {name} · {pct}%{count ? ` · ${(+count).toLocaleString()}` : ''}
      </div>
    </div>
  );
}

function FeatureRow({ name, importance, maxImp }) {
  const pct = maxImp > 0 ? (importance / maxImp) * 100 : 0;
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);
  return (
    <div className="feature-row">
      <div>
        <div className="feature-name">{name}</div>
        <div className="feature-bar">
          <div className="feature-bar-fill" style={{ width: `${w}%` }} />
        </div>
      </div>
      <div className="feature-score">{importance.toFixed(2)}</div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({ result, fallbackTimestamp, onDownload, pdfBusy, pdfLabel, dashboardRef }) {
  const m = (result && result.metrics) || {};
  const stamp =
    result && result.timestamp ? new Date(result.timestamp) : fallbackTimestamp;

  // Metric calculations (mirror the original script)
  const dp = typeof m.demographic_parity === 'number' ? m.demographic_parity : null;
  const di = typeof m.disparate_impact === 'number' ? m.disparate_impact : null;
  const eo =
    typeof m.equal_opportunity_delta === 'number' ? m.equal_opportunity_delta : null;
  const fs = typeof m.fairness_score === 'number' ? m.fairness_score : null;

  const dpFill = dp != null ? Math.max(0, Math.min(100, dp * 100)) : 0;
  const diFill = di != null ? Math.max(0, Math.min(100, di * 100)) : 0;
  const eoFill =
    eo != null ? Math.max(0, Math.min(100, Math.max(0, 1 - eo) * 100)) : 0;
  const fsFill = fs != null ? Math.max(0, Math.min(100, fs)) : 0;

  const dpKlass = dp != null ? classifyDI(dp) : null;
  const diKlass = di != null ? classifyDI(di) : null;
  const eoKlass = eo != null ? classifyEO(eo) : null;
  const fsKlass = fs != null ? classifyFS(fs) : null;

  const verdict = (result && result.verdict) || {};
  const verdictLevel =
    verdict.level || (fs != null ? classifyFS(fs) : 'bad');
  const verdictTitle =
    verdict.title ||
    (verdictLevel === 'good'
      ? 'Model passes fairness audit'
      : verdictLevel === 'warn'
      ? 'Borderline — investigate further'
      : 'Significant bias detected');
  const verdictText = verdict.text || '';
  const verdictCls = ['dash-card', 'span-2', 'verdict'];
  if (verdictLevel === 'good') verdictCls.push('good');
  else if (verdictLevel === 'warn') verdictCls.push('warn');

  const groups = Array.isArray(result && result.groups) ? result.groups : [];
  const features = Array.isArray(result && result.top_features)
    ? result.top_features
    : [];
  const mitigations = Array.isArray(result && result.mitigations)
    ? result.mitigations
    : [];
  const hasRates = groups.some(
    (g) => typeof g.tpr === 'number' || typeof g.fpr === 'number'
  );
  const maxImp = features.length
    ? Math.max(...features.map((f) => +f.importance || 0))
    : 0;

  const protectedAttr = result && result.protected_attribute;

  return (
    <div className="detector-output" ref={dashboardRef}>
      <div className="dashboard-head">
        <div>
          <div className="dash-eyebrow">Fairness audit · Live report</div>
          <h3 className="dash-title">Bias Analysis Dashboard</h3>
        </div>
        <div className="dash-head-right">
          <div className="result-meta">
            <TimestampChip date={stamp} />
            {result && result.dataset_name && (
              <MetaChip label="Dataset" value={result.dataset_name} />
            )}
            {result && result.model_name && (
              <MetaChip label="Model" value={result.model_name} />
            )}
            {result && typeof result.rows === 'number' && (
              <MetaChip label="Rows" value={result.rows.toLocaleString()} />
            )}
            {protectedAttr && (
              <MetaChip label="Protected" value={protectedAttr} />
            )}
          </div>
          <button
            type="button"
            className={`btn-download${pdfBusy ? ' is-busy' : ''}`}
            aria-label="Download report as PDF"
            disabled={pdfBusy}
            onClick={onDownload}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className="btn-download-label">{pdfLabel}</span>
          </button>
        </div>
      </div>

      <div className="dash-grid">
        <KpiCard
          label="Demographic Parity"
          value={dp != null ? dp.toFixed(2) : '—'}
          hint="P(approve | A) ÷ P(approve | B)"
          fillPct={dpFill}
          klass={dpKlass}
        />
        <KpiCard
          label="Disparate Impact"
          value={di != null ? di.toFixed(2) : '—'}
          hint="Four-fifths rule threshold: 0.80"
          fillPct={diFill}
          klass={diKlass}
        />
        <KpiCard
          label="Equal Opportunity Δ"
          value={eo != null ? eo.toFixed(2) : '—'}
          hint="|TPR(A) − TPR(B)| should approach 0"
          fillPct={eoFill}
          klass={eoKlass}
        />
        <FairnessKpi
          label="Fairness Score"
          value={fs != null ? Math.round(fs) : '—'}
          unit="/100"
          hint="Composite of all metrics, weighted"
          fillPct={fsFill}
          klass={fsKlass}
        />

        <div className={verdictCls.join(' ')}>
          <div className="verdict-icon">
            {verdictLevel === 'good' ? '✓' : '!'}
          </div>
          <div className="verdict-body">
            <div className="verdict-title">{verdictTitle}</div>
            <div className="verdict-text">{verdictText || '—'}</div>
          </div>
        </div>

        <div className="dash-card span-2">
          <div className="chart-head">
            <h4>Approval distribution by group</h4>
            <span className="muted">
              {protectedAttr ? `By ${protectedAttr}` : ''}
            </span>
          </div>
          <div className="bars">
            {groups.map((g, i) => (
              <GroupBar
                key={i + (g.name || '')}
                name={g.name || 'Group'}
                pct={Math.round((g.approval_rate || 0) * 100)}
                count={g.count}
              />
            ))}
          </div>
        </div>

        {hasRates && (
          <div className="dash-card span-2">
            <div className="chart-head">
              <h4>Confusion matrix by group</h4>
              <span className="muted">TPR / FPR per cohort</span>
            </div>
            <div className="confusion-grid">
              <div className="confusion-row head">
                <div>Group</div>
                <div>Approval</div>
                <div>TPR</div>
                <div>FPR</div>
                <div>Count</div>
              </div>
              {groups.map((g, i) => (
                <div className="confusion-row" key={`cm-${i}`}>
                  <div className="group-name">{g.name || '—'}</div>
                  <div className="cm-cell">
                    <strong>
                      {typeof g.approval_rate === 'number'
                        ? (g.approval_rate * 100).toFixed(1) + '%'
                        : '—'}
                    </strong>
                  </div>
                  <div className="cm-cell">
                    <strong>
                      {typeof g.tpr === 'number'
                        ? (g.tpr * 100).toFixed(1) + '%'
                        : '—'}
                    </strong>
                  </div>
                  <div className="cm-cell">
                    <strong>
                      {typeof g.fpr === 'number'
                        ? (g.fpr * 100).toFixed(1) + '%'
                        : '—'}
                    </strong>
                  </div>
                  <div className="cm-cell">
                    {g.count != null ? (+g.count).toLocaleString() : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {features.length > 0 && (
          <div className="dash-card span-2">
            <div className="chart-head">
              <h4>Top biased features</h4>
              <span className="muted">Contribution to disparate outcomes</span>
            </div>
            <div className="features">
              {features.map((f, i) => (
                <FeatureRow
                  key={`f-${i}-${f.name}`}
                  name={f.name || '—'}
                  importance={+f.importance || 0}
                  maxImp={maxImp}
                />
              ))}
            </div>
          </div>
        )}

        <div className="dash-card span-4 mitigations">
          <div className="chart-head">
            <h4>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="head-icon"
              >
                <path d="M9 12l2 2 4-4"></path>
                <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"></path>
              </svg>
              Suggested mitigations
            </h4>
            <span className="muted">
              {mitigations.length > 0
                ? `${mitigations.length} recommended action${
                    mitigations.length === 1 ? '' : 's'
                  }`
                : 'Recommended actions to reduce bias'}
            </span>
          </div>
          {mitigations.length > 0 ? (
            <ol className="mitigations-list">
              {mitigations.map((mit, idx) => {
                const sev = (mit.severity || '').toLowerCase();
                const sevClass =
                  sev === 'high' || sev === 'medium' || sev === 'low'
                    ? `sev-${sev}`
                    : '';
                return (
                  <li
                    key={`mit-${idx}`}
                    className={`mitigation-item ${sevClass}`}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="mitigation-index">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="mitigation-body">
                      <div className="mitigation-head">
                        <h5 className="mitigation-title">
                          {mit.title || 'Mitigation'}
                        </h5>
                        <div className="mitigation-tags">
                          {mit.category && (
                            <span className="mit-tag">{mit.category}</span>
                          )}
                          {sev && (
                            <span className={`mit-sev mit-sev-${sev}`}>
                              {sev}
                            </span>
                          )}
                        </div>
                      </div>
                      {mit.detail && (
                        <p className="mitigation-detail">{mit.detail}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <ol className="mitigations-list">
              <li className="mitigation-empty">
                No mitigations returned by the backend yet.
              </li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Detector ---------------- */
export default function Detector() {
  const [files, setFiles] = useState({ dataset: null, model: null });
  const [formMsg, setFormMsg] = useState(null); // { text, kind }
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [result, setResult] = useState(null);
  const [fallbackTimestamp, setFallbackTimestamp] = useState(new Date());

  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfLabel, setPdfLabel] = useState('Download PDF');

  const dashboardRef = useRef(null);

  const canAnalyse = useMemo(
    () => Boolean(files.dataset && files.model) && !loading,
    [files, loading]
  );

  const setFile = (kind, file, accept) => {
    const lower = file.name.toLowerCase();
    const ok = accept.some((ext) => lower.endsWith(ext));
    if (!ok) {
      setFormMsg({
        text: `${kind === 'dataset' ? 'Dataset' : 'Model'} must be a ${accept.join(' / ')} file.`,
        kind: 'error',
      });
      return;
    }
    setFormMsg(null);
    setFiles((f) => ({ ...f, [kind]: file }));
  };

  const clearFile = (kind) => {
    setFiles((f) => ({ ...f, [kind]: null }));
  };

  const analyse = async () => {
    if (!files.dataset || !files.model) return;
    setFormMsg(null);
    setLoading(true);
    setShowDashboard(true);
    setFallbackTimestamp(new Date());

    // Smooth-scroll to the dashboard so the user sees the layout.
    requestAnimationFrame(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const fd = new FormData();
    fd.append('dataset', files.dataset, files.dataset.name);
    fd.append('model', files.model, files.model.name);

    try {
      const res = await fetch(API_URL, { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
      // Non-OK responses leave the dashboard with placeholders — the
      // backend will populate it once it's wired up.
    } catch {
      // Network error / no backend — leave dashboard empty, no banner.
    } finally {
      setLoading(false);
    }
  };

  const flashLabel = (text) => {
    setPdfLabel(text);
    setPdfBusy(true);
    setTimeout(() => {
      setPdfLabel('Download PDF');
      setPdfBusy(false);
    }, 1600);
  };

  const handleDownload = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);
    setPdfLabel('Preparing');
    try {
      await exportDashboardAsPdf(dashboardRef.current);
      setPdfLabel('Download PDF');
    } catch (err) {
      console.error('PDF export failed:', err);
      flashLabel('Export failed — retry');
      return;
    } finally {
      // If we hit the success path, clear busy here. (Error path manages
      // its own timing via flashLabel.)
      setPdfBusy(false);
    }
  };

  return (
    <section id="detector" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">02 — Live audit</span>
          <h2>The Bias Detector.</h2>
          <p className="lead">
            Upload your dataset and trained model. We send them to the fairness engine,
            compute four bias metrics across protected cohorts, and return a regulator-ready dashboard.
          </p>
        </div>

        <div className="detector">
          <aside className="detector-controls">
            <div className="control-group">
              <label>Dataset file</label>
              <Dropzone
                kind="dataset"
                accept=".csv,text/csv"
                file={files.dataset}
                onFile={(f) => setFile('dataset', f, ['.csv'])}
                onClear={() => clearFile('dataset')}
              />
            </div>
            <div className="control-group">
              <label>Model file</label>
              <Dropzone
                kind="model"
                accept=".pkl,application/octet-stream"
                file={files.model}
                onFile={(f) => setFile('model', f, ['.pkl'])}
                onClear={() => clearFile('model')}
              />
            </div>

            <button
              className="btn btn-primary btn-block"
              disabled={!canAnalyse}
              onClick={analyse}
            >
              <span className="btn-label">
                {loading ? 'Analysing…' : 'Analyse files'}
              </span>
              {loading && (
                <span className="btn-spinner">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeOpacity=".25"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              )}
            </button>

            {formMsg && (
              <div
                className={`form-msg${formMsg.kind === 'info' ? ' info' : ''}`}
              >
                {formMsg.text}
              </div>
            )}
          </aside>

          {showDashboard && (
            <Dashboard
              result={result}
              fallbackTimestamp={fallbackTimestamp}
              onDownload={handleDownload}
              pdfBusy={pdfBusy}
              pdfLabel={pdfLabel}
              dashboardRef={dashboardRef}
            />
          )}
        </div>
      </div>
    </section>
  );
}
