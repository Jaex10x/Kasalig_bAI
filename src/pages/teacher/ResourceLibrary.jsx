import { useState } from 'react';
import { BUILT_IN_MATERIALS, TOPICS, competenciesOf, competencyById } from '../../data/curriculum';
import { formatDate } from '../../hooks/dashboardHooks';
import { useClassData } from '../../store/learningStore';
import { BookIcon, LinkIcon, PencilIcon, PlayIcon, PlusIcon, TrashIcon } from '../../components/dashboard/DashIcons';
import { SectionTabs } from '../../components/dashboard/DashWidgets';
import { TEACHER_TABS } from '../../components/dashboard/teacherTabs';

const TYPES = ['Video', 'PDF', 'Worksheet', 'Link'];
const ICONS = { Video: PlayIcon, PDF: BookIcon, Worksheet: PencilIcon, Link: LinkIcon };
const EMPTY = { title: '', url: '', type: 'Video', topicId: TOPICS[0].id, competencyId: '', note: '' };

const isWebLink = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

/** Teachers link materials to a topic; students with a gap in that topic see them in their learning path. */
export default function ResourceLibrary() {
  const { resources, addResource, deleteResource } = useClassData();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState('all');

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.title.trim()) next.title = 'Give the resource a title.';
    if (!isWebLink(form.url.trim())) next.url = 'Paste a full web link starting with https://';
    setErrors(next);
    if (Object.keys(next).length) return;
    addResource({ ...form, title: form.title.trim(), url: form.url.trim(), note: form.note.trim() });
    setForm({ ...EMPTY, topicId: form.topicId, type: form.type });
  };

  const shown = TOPICS.filter((t) => filter === 'all' || t.id === filter);

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Resource library</p>
          <h1>Learning materials</h1>
          <p>Link videos, PDFs and worksheets to a topic. Kasalig recommends them to every student with a gap in that topic, inside their learning path.</p>
        </div>
      </header>
      <SectionTabs tabs={TEACHER_TABS.assessments} label="Assessments" />

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>Add a resource</h2>
            <p>File uploads need the backend; for now, paste a link (Google Drive, YouTube, DepEd Commons…).</p>
          </div>
        </header>
        <form className="kd-form-grid" onSubmit={submit} noValidate>
          <label className="kd-field kd-field-wide">
            <span>Title</span>
            <input className="kd-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-invalid={Boolean(errors.title)} placeholder="e.g. Factoring trinomials – worked examples" />
            {errors.title && <small className="kd-field-error">{errors.title}</small>}
          </label>
          <label className="kd-field kd-field-wide">
            <span>Link</span>
            <input className="kd-input" type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} aria-invalid={Boolean(errors.url)} placeholder="https://" />
            {errors.url && <small className="kd-field-error">{errors.url}</small>}
          </label>
          <label className="kd-field">
            <span>Type</span>
            <select className="kd-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="kd-field">
            <span>Topic</span>
            <select className="kd-select" value={form.topicId} onChange={(e) => setForm({ ...form, topicId: e.target.value, competencyId: '' })}>
              {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <label className="kd-field">
            <span>Competency (optional)</span>
            <select className="kd-select" value={form.competencyId} onChange={(e) => setForm({ ...form, competencyId: e.target.value })}>
              <option value="">Whole topic</option>
              {competenciesOf(form.topicId).map((c) => <option key={c.id} value={c.id}>{c.code}</option>)}
            </select>
          </label>
          <label className="kd-field kd-field-wide">
            <span>Note for students (optional)</span>
            <input className="kd-input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Watch up to 6:30, then try the practice set." />
          </label>
          <div className="kd-field-wide">
            <button type="submit" className="kd-btn kd-btn-dark">
              <PlusIcon size={18} /> Add to library
            </button>
          </div>
        </form>
      </article>

      <div className="kd-toolbar">
        <select className="kd-select" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Show topic">
          <option value="all">All topics</option>
          {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <span className="kd-muted kd-small">{resources.length} of your resources · built-in materials shown in grey</span>
      </div>

      <div className="kd-library">
        {shown.map((t) => {
          const mine = resources.filter((r) => r.topicId === t.id);
          return (
            <article key={t.id} className="kd-card kd-library-topic" style={{ '--c': t.color, '--t': t.tint }}>
              <h2>{t.name}</h2>
              <ul className="kd-res-list">
                {mine.map((r) => {
                  const Icon = ICONS[r.type] ?? LinkIcon;
                  return (
                    <li key={r.id} className="kd-res-row">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="kd-res-item is-link">
                        <span className="kd-material-icon" aria-hidden="true"><Icon size={16} /></span>
                        <span>
                          <strong>{r.title}</strong>
                          <small>
                            {r.type}
                            {r.competencyId ? ` · ${competencyById(r.competencyId)?.code}` : ''} · added {formatDate(r.addedAt)}
                            {r.note ? ` · ${r.note}` : ''}
                          </small>
                        </span>
                      </a>
                      <button type="button" className="kd-icon-btn kd-icon-btn-sm" aria-label={`Remove ${r.title}`} onClick={() => deleteResource(r.id)}>
                        <TrashIcon size={16} />
                      </button>
                    </li>
                  );
                })}
                {(BUILT_IN_MATERIALS[t.id] ?? []).map((m) => {
                  const Icon = ICONS[m.type] ?? BookIcon;
                  return (
                    <li key={m.title}>
                      <span className="kd-res-item is-builtin">
                        <span className="kd-material-icon" aria-hidden="true"><Icon size={16} /></span>
                        <span>
                          <strong>{m.title}</strong>
                          <small>{m.type} · built-in</small>
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
