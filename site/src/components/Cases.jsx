const cases = [
  {
    tag: 'Hiring',
    title: 'The résumé-screening model that learned to penalize "women\'s"',
    body: 'An e-commerce giant scrapped its internal recruiting AI after discovering it down-ranked résumés containing the word "women\'s" — a pattern learned from a decade of male-dominated tech hiring data.',
  },
  {
    tag: 'Healthcare',
    title: 'The risk algorithm that under-served Black patients',
    body: 'A widely deployed health-risk score used spending as a proxy for need, systematically allocating fewer care resources to Black patients with the same medical complexity as white patients.',
  },
  {
    tag: 'Criminal Justice',
    title: 'The recidivism tool flagged for racial disparity',
    body: 'Investigations found a leading recidivism prediction model produced false positive rates nearly twice as high for Black defendants compared to white defendants with otherwise similar profiles.',
  },
  {
    tag: 'Lending',
    title: 'The mortgage model that redlined by zip code',
    body: "Even with race excluded as a feature, a major lender's approval model used zip-code-derived signals that produced denial patterns nearly identical to historical redlining maps.",
  },
];

export default function Cases() {
  return (
    <section id="cases" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">05 — In the wild</span>
          <h2>Where unchecked models have failed.</h2>
        </div>
        <div className="case-grid">
          {cases.map((c) => (
            <article key={c.tag + c.title} className="case">
              <div className="case-tag">{c.tag}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
