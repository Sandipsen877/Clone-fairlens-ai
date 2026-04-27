import { useEffect, useRef } from 'react';

const cards = [
  {
    icon: '⚖',
    title: 'Disparate Impact',
    body: 'Approval rates that differ by more than 20% across protected groups violate the four-fifths rule and trigger regulatory exposure.',
  },
  {
    icon: '◐',
    title: 'Hidden Proxies',
    body: 'Zip code, school, or device type can act as silent stand-ins for race or income — bias survives even after the obvious fields are removed.',
  },
  {
    icon: '⟁',
    title: 'Feedback Loops',
    body: 'Biased predictions become biased outcomes which become biased training data. Without monitoring, the model drifts further from fair every day.',
  },
  {
    icon: '◇',
    title: 'Opaque Accountability',
    body: '"The algorithm decided" is not an answer a regulator, an auditor, or a rejected applicant will accept. Explainability is the new compliance.',
  },
];

export default function Problem() {
  const gridRef = useRef(null);

  useEffect(() => {
    const cardEls = gridRef.current?.querySelectorAll('.card') || [];
    const handlers = [];
    cardEls.forEach((card) => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      };
      card.addEventListener('mousemove', onMove);
      handlers.push([card, onMove]);
    });
    return () => handlers.forEach(([c, h]) => c.removeEventListener('mousemove', h));
  }, []);

  return (
    <section id="problem" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">01 — The problem</span>
          <h2>Algorithms inherit our blind spots.</h2>
          <p className="lead">
            When training data reflects historical inequity, the model that learns from it
            encodes that inequity at industrial scale — denying loans, filtering résumés,
            and flagging risk along lines of race, gender, age, and geography.
          </p>
        </div>
        <div className="card-grid" ref={gridRef}>
          {cards.map((c) => (
            <article key={c.title} className="card">
              <div className="card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
