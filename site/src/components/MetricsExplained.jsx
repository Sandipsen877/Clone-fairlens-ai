const items = [
  {
    tag: 'DP',
    title: 'Demographic Parity',
    body: 'Each group should be selected at the same rate, regardless of outcome. Useful when historical data is itself the source of harm.',
    code: 'P(Ŷ=1 | A=0) = P(Ŷ=1 | A=1)',
  },
  {
    tag: 'DI',
    title: 'Disparate Impact',
    body: 'The ratio of selection rates between protected and reference groups. Below 0.80 is a red flag for U.S. regulators.',
    code: 'min(P_A, P_B) / max(P_A, P_B) ≥ 0.80',
  },
  {
    tag: 'EO',
    title: 'Equal Opportunity',
    body: 'Among truly qualified candidates, every group should have an equal chance of being correctly approved. Penalizes false negatives unevenly.',
    code: 'TPR_A = TPR_B',
  },
  {
    tag: 'CA',
    title: 'Calibration',
    body: 'A predicted score of 0.7 should mean a 70% chance of the outcome — for every group. Without calibration, downstream decisions inherit hidden tilt.',
    code: 'P(Y=1 | Ŝ=s, A=a) = s',
  },
];

export default function MetricsExplained() {
  return (
    <section id="metrics" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">03 — The math, demystified</span>
          <h2>Four metrics. Zero ambiguity.</h2>
          <p className="lead">
            Fairness isn't a single number — different metrics surface different harms.
            We track the four most defensible ones and let you weight them to your context.
          </p>
        </div>
        <div className="metric-explain">
          {items.map((m) => (
            <div key={m.tag} className="explain-card">
              <div className="explain-tag">{m.tag}</div>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
              <code>{m.code}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
