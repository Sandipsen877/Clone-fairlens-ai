const steps = [
  {
    n: '01',
    title: 'Ingest',
    body: 'Stream model predictions, ground truth, and protected attributes through a privacy-preserving connector. Nothing personally identifiable is stored.',
  },
  {
    n: '02',
    title: 'Slice',
    body: 'Automatically segment outcomes by every protected and proxy attribute, including intersectional cohorts (e.g. age × gender × geography).',
  },
  {
    n: '03',
    title: 'Audit',
    body: 'Compute demographic parity, disparate impact, equal opportunity, and calibration in parallel — with statistical significance tests for sample size.',
  },
  {
    n: '04',
    title: 'Mitigate',
    body: 'Recommend pre-processing (reweighing), in-processing (adversarial debiasing), or post-processing (threshold optimization) — with projected fairness gain for each.',
  },
  {
    n: '05',
    title: 'Report',
    body: 'Generate a regulator-ready audit trail: which model version, which decisions, which mitigations, signed and time-stamped.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">04 — Pipeline</span>
          <h2>From raw decision log to fairness verdict.</h2>
        </div>
        <div className="timeline">
          {steps.map((s) => (
            <div key={s.n} className="step">
              <div className="step-num">{s.n}</div>
              <div className="step-body">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
