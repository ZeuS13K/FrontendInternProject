import React, { useState, useEffect } from 'react';
import './App.css';

//Entry Fields
const Input = ({ label, ...props }) => (
  <label style={{ display: 'block', marginBottom: 12 }}>
    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{label}</div>
    <input {...props} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
  </label>
);

const Select = ({ label, children, ...props }) => (
  <label style={{ display: 'block', marginBottom: 12 }}>
    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, }}>{label}</div>
    <select {...props} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}>
      {children}
    </select>
  </label>
);

const Button = ({ children, onClick, style, type = "button" }) => (
  <button type={type} onClick={onClick} style={{ padding: '10px 16px', borderRadius: 8, border: 0, background: '#2b6cb0', color: 'white', cursor: 'pointer', fontWeight: 500, ...style }}>{children}</button>
);

// List of Jobs
const sampleJobs = [
  {
    id: 1,
    title: 'Frontend Intern',
    Company: 'Acme Co',
    logo: '',
    posted: '2025-09-15',
    jobType: 'Sales/Marketing',
    employment: 'Internship',
    Skills: 'C++',
    location: 'Kathmandu, Nepal',
    salary: 'Negotiable'
  },
  {
    id: 2,
    title: 'Marketing Associate',
    Company: 'BrightAds',
    logo: '',
    posted: '2025-09-10',
    jobType: 'IT',
    employment: 'Full-time',
    Skills: 'JavaScript',
    location: 'Remote',
    salary: '$300/month'
  },
];

// Search job list
export default function App() {
  const [jobs, setJobs] = useState(() => {
    try {
      const raw = localStorage.getItem('jobs_v1');
      return raw ? JSON.parse(raw) : sampleJobs;
    } catch (e) {
      return sampleJobs;
    }
  });

  useEffect(() => {
    localStorage.setItem('jobs_v1', JSON.stringify(jobs));
  }, [jobs]);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ jobType: '', employment: '', Skills: '', location: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  function resetFilters() { setFilters({ jobType: '', employment: '', Skills: '', location: '' }); setQuery(''); }

  const filtered = jobs.filter((job) => {
    const normalizedJob = {
      title: job.title?.toLowerCase() || '',
      company: job.Company?.toLowerCase() || '',
      location: job.location?.toLowerCase() || '',
      skills: job.Skills?.toLowerCase() || '',
      jobType: job.jobType?.toLowerCase() || '',
      employment: job.employment?.toLowerCase() || '',
    };

    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

    const matchesQuery = tokens.every(token =>
      normalizedJob.title.includes(token) ||
      normalizedJob.company.includes(token) ||
      normalizedJob.location.includes(token) ||
      normalizedJob.skills.includes(token)
    );

    if (query && !matchesQuery) return false;

    // Filter by Job Type
    if (filters.jobType && normalizedJob.jobType !== filters.jobType.toLowerCase()) return false;

    // Filter by Employment Type
    if (filters.employment && normalizedJob.employment !== filters.employment.toLowerCase()) return false;

    // Filter by Skills Type
    if (filters.Skills && normalizedJob.skills !== filters.Skills.toLowerCase()) return false;

    // Filter by Location
    if (filters.location && !normalizedJob.location.includes(filters.location.toLowerCase())) return false;

    return true;
  }).sort((a, b) => new Date(b.posted) - new Date(a.posted));


  function handleDelete(id) {
    if (!window.confirm('Delete this job?')) return;
    setJobs(prev => prev.filter(j => j.id !== id));
  }

  function openAdd() { setEditing(null); setShowModal(true); }
  function openEdit(job) { setEditing(job); setShowModal(true); }

  return (
    <div style={{
      fontFamily: 'Inter, Arial, sans-serif', padding: 24, width: '100%', maxWidth: 1100, background: 'hsla(204, 65%, 76%, 1.00)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 20, minHeight: '90vh'
    }}>
      <header style={{ padding: '20px', background: 'hsla(222, 82%, 49%, 1.00)', color: 'white', borderRadius: '20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 30 }}>The <span style={{ color: '#00e5ffff' }}>Most Complete</span> Job Listing In The World</h1>
        <div style={{ display: 'flex', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Button onClick={openAdd} style={{ background: 'hsla(148, 50%, 55%, 1.00)', borderRadius: '20px' }}>Add Job</Button>
          <Button onClick={() => { localStorage.removeItem('jobs_v1'); setJobs(sampleJobs); }} style={{ background: '#e53e3e', borderRadius: '20px' }}>Reset</Button>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        <aside style={{ border: '1px solid #ddd', padding: 30, borderRadius: 25, background: '#fff' }}>
          <h3 style={{ marginBottom: 16, fontSize: 18 }}>🔍 Filters</h3>
          <Input label="Search" value={query} onChange={e => setQuery(e.target.value)} />

          <Select label="Job Type" value={filters.jobType} onChange={e => setFilters(prev => ({ ...prev, jobType: e.target.value }))}>
            <option value="">All</option>
            <option value="Sales/Marketing">Sales/Marketing</option>
            <option value="IT">IT</option>
            <option value="Design">Design</option>
            <option value="Others">Others</option>
          </Select>

          <Select label="Employment" value={filters.employment} onChange={e => setFilters(prev => ({ ...prev, employment: e.target.value }))}>
            <option value="">All</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </Select>

          <Select label="Skills" value={filters.Skills} onChange={e => setFilters(prev => ({ ...prev, Skills: e.target.value }))}>
            <option value="">All</option>
            <option value="C++">C++</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Backend">Backend</option>
            <option value="Python">Python</option>
          </Select>

          <Input label="Location contains" value={filters.location} onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))} />

          <div style={{ display: 'flex', gap: 5, marginTop: 12 }}>
            <Button onClick={() => { }}>Apply</Button>
            <Button onClick={resetFilters} style={{ background: '#718096' }}>Clear</Button>
          </div>
        </aside>


        <main>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 500 }}>{filtered.length} jobs found</div>
            <div style={{ fontSize: 13, color: 'rgba(8, 2, 2, 1)' }}>Sorted by newest</div>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            {filtered.map(job => (
              <div key={job.id} style={{ padding: 20, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, #ffffff, #f9fafb)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {job.logo && <img src={job.logo} alt="logo" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} />}
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(2, 2, 2, 1)' }}>{job.title}</div>
                    <div style={{ color: '#444', fontWeight: 500 }}>{job.Company} • {job.location}</div>
                    <div style={{ marginTop: 6, fontSize: 14, color: '#555' }}>
                      • {job.jobType} • {job.employment} • {job.Skills} • {job.salary}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>📅 Posted: {job.posted}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Button onClick={() => openEdit(job)} style={{ background: '#3182ce' }}>Edit</Button>
                  <Button onClick={() => handleDelete(job.id)} style={{ background: '#e53e3e' }}>Delete</Button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ padding: 24, background: '#fff3cd', borderRadius: 8 }}>No jobs match your search/filters.</div>
            )}
          </div>
        </main>
      </section>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <JobForm onClose={() => setShowModal(false)} initial={editing} onSave={(data) => {
            if (editing) {
              setJobs(prev => prev.map(j => j.id === editing.id ? { ...j, ...data } : j));
            } else {
              const id = Date.now();
              setJobs(prev => [{ id, ...data }, ...prev]);
            }
            setShowModal(false);
          }} />
        </Modal>
      )}
    </div>
  );
}

//Job form structure
function Modal({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={onClose}>
      <div style={{ width: 720, maxHeight: '90vh', overflow: 'auto', background: 'white', padding: 25, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <strong style={{ fontSize: 18 }}>Create / Edit Job</strong>
          <button onClick={onClose} style={{ border: 0, background: 'transparent', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Job form -> To add new job
function JobForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    title: initial?.title || '',
    Company: initial?.Company || '',
    logo: initial?.logo || '',
    posted: initial?.posted || new Date().toISOString().slice(0, 10),
    jobType: initial?.jobType || 'Sales/Marketing',
    employment: initial?.employment || 'Full-time',
    Skills: initial?.Skills || 'JavaScript',
    location: initial?.location || 'Enter location',
    salary: initial?.salary || ''
  }));

  function change(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.Company) { alert('Title and Company are required'); return; }
    onSave(form);
  }

  return (
    <form onSubmit={submit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Job Title" value={form.title} onChange={e => change('title', e.target.value)} style={{ height: 48, fontSize: 16 }}
        />
        <Input label="Company" value={form.Company} onChange={e => change('Company', e.target.value)} />
        <Input label="Company logo URL" value={form.logo} onChange={e => change('logo', e.target.value)} />
        <Input label="Posted date" type="date" value={form.posted} onChange={e => change('posted', e.target.value)} />
        <Select label="Job Type" value={form.jobType} onChange={e => change('jobType', e.target.value)}>
          <option value="Sales/Marketing">Sales/Marketing</option>
          <option value="IT">IT</option>
          <option value="Design">Design</option>
          <option value="Others">Others</option>
        </Select>
        <Select label="Employment Type" value={form.employment} onChange={e => change('employment', e.target.value)}>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
          <option value="Internship">Internship</option>
        </Select>
        <Select label="Skills" value={form.Skills} onChange={e => change('Skills', e.target.value)}>
          <option value="C++">C++</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Backend">Backend</option>
          <option value="Python">Python</option>
        </Select>
        <Input label="Location" value={form.location} onChange={e => change('location', e.target.value)} />
        <Input label="Salary" value={form.salary} onChange={e => change('salary', e.target.value)} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
        <Button type="submit">Save</Button>
        <Button onClick={onClose} style={{ background: '#718096' }}>Cancel</Button>
      </div>
    </form>
  );
}

