'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cat, Dog, PawPrint, ArrowLeft, Pill, Syringe, Check, AlertTriangle, Camera, X, Plus, Loader2, Save } from 'lucide-react';

export default function NuevaMascotaPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vaccines, setVaccines] = useState([]);
  const [conditions, setConditions] = useState([]);

  // Step 1: Basic data
  const [petData, setPetData] = useState({
    name: '', species: 'perro', breed: '', birthDate: '', sex: '', notes: '',
  });

  // Step 2: Health
  const [weightKg, setWeightKg] = useState('');
  const [selectedConditions, setSelectedConditions] = useState([]);

  // Step 3: Vaccinations
  const [vaccineEntries, setVaccineEntries] = useState([
    { vaccineId: '', applicationDate: '', veterinarianName: '', notes: '' },
  ]);

  // Load vaccines and conditions when species changes
  useEffect(() => {
    async function loadCatalogs() {
      const [vaxRes, condRes] = await Promise.all([
        fetch(`/api/vaccines?species=${petData.species}`),
        fetch(`/api/conditions?species=${petData.species}`),
      ]);
      const vaxData = await vaxRes.json();
      const condData = await condRes.json();
      setVaccines(vaxData.vaccines || []);
      setConditions(condData.conditions || []);
    }
    loadCatalogs();
  }, [petData.species]);

  const handlePetChange = (e) => setPetData({ ...petData, [e.target.name]: e.target.value });

  const toggleCondition = (condId) => {
    setSelectedConditions(prev =>
      prev.includes(condId) ? prev.filter(c => c !== condId) : [...prev, condId]
    );
  };

  const updateVaccineEntry = (index, field, value) => {
    const updated = [...vaccineEntries];
    updated[index][field] = value;
    setVaccineEntries(updated);
  };

  const addVaccineEntry = () => {
    setVaccineEntries([...vaccineEntries, { vaccineId: '', applicationDate: '', veterinarianName: '', notes: '' }]);
  };

  const removeVaccineEntry = (index) => {
    if (vaccineEntries.length > 1) {
      setVaccineEntries(vaccineEntries.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...petData,
        weightKg: weightKg || null,
        conditions: selectedConditions.map(id => ({ conditionId: id })),
        vaccinations: vaccineEntries.filter(v => v.vaccineId && v.applicationDate),
      };

      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/mascotas/${data.pet.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const breeds = {
    perro: ['Mestizo', 'Golden Retriever', 'Labrador', 'Bulldog Francés', 'Pastor Alemán', 'Schnauzer', 'Poodle', 'Chihuahua', 'Husky Siberiano', 'Beagle', 'Boxer', 'Dálmata', 'Rottweiler', 'Cocker Spaniel', 'Shih Tzu', 'Yorkshire Terrier', 'Otro'],
    gato: ['Mestizo', 'Persa', 'Siamés', 'Maine Coon', 'Angora', 'Bengalí', 'Ragdoll', 'Británico', 'Sphynx', 'Otro'],
    otro: ['No aplica'],
  };

  return (
    <>
      <nav className="navbar">
        <Link href="/dashboard" className="navbar-brand">
          <Cat size={24} strokeWidth={2} /> RescueVet
        </Link>
        <Link href="/dashboard" className="btn btn-secondary btn-sm"><ArrowLeft size={16} /> Volver</Link>
      </nav>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="wizard fade-in">
          <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Registrar Nueva Mascota
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Completa los 3 pasos para crear el perfil
          </p>

          {/* Wizard Steps */}
          <div className="wizard-steps">
            <div className="wizard-connector"></div>
            {[
              { n: 1, label: 'Datos Básicos', icon: <PawPrint size={18} /> },
              { n: 2, label: 'Salud', icon: <Pill size={18} /> },
              { n: 3, label: 'Vacunas', icon: <Syringe size={18} /> },
            ].map(s => (
              <div key={s.n} className={`wizard-step ${step === s.n ? 'active' : step > s.n ? 'completed' : ''}`}>
                <div className="wizard-step-number">{step > s.n ? <Check size={18} /> : s.icon}</div>
                <span className="wizard-step-label">{s.label}</span>
              </div>
            ))}
          </div>

          {error && <div className="alert alert-error"><AlertTriangle size={16} /> {error}</div>}

          {/* Step 1: Basic Data */}
          {step === 1 && (
            <div className="wizard-body">
              <div className="card">
                <div className="form-group">
                  <label className="form-label">Nombre de tu mascota *</label>
                  <input className="form-input" name="name" value={petData.name} onChange={handlePetChange} placeholder="Ej: Firulais, Luna, Max..." required />
                </div>
                <div className="form-group">
                  <label className="form-label">Especie *</label>
                  <select className="form-select" name="species" value={petData.species} onChange={handlePetChange}>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Raza</label>
                  <select className="form-select" name="breed" value={petData.breed} onChange={handlePetChange}>
                    <option value="">Seleccionar raza...</option>
                    {(breeds[petData.species] || []).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Fecha de nacimiento</label>
                    <input className="form-input" type="date" name="birthDate" value={petData.birthDate} onChange={handlePetChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sexo</label>
                    <select className="form-select" name="sex" value={petData.sex} onChange={handlePetChange}>
                      <option value="">Seleccionar...</option>
                      <option value="macho">♂️ Macho</option>
                      <option value="hembra">♀️ Hembra</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="wizard-footer">
                <Link href="/dashboard" className="btn btn-secondary">Cancelar</Link>
                <button className="btn btn-primary" onClick={() => { if (!petData.name) { setError('El nombre es requerido'); return; } setError(''); setStep(2); }}>
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Health */}
          {step === 2 && (
            <div className="wizard-body">
              <div className="card">
                <div className="form-group">
                  <label className="form-label">Peso (kg)</label>
                  <input className="form-input" type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="Ej: 12.5" />
                </div>
                <div className="form-group">
                  <label className="form-label">Alergias y Condiciones Conocidas</label>
                  <p className="form-hint">Selecciona todas las que apliquen</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {conditions.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCondition(c.id)}
                        className={`tag ${selectedConditions.includes(c.id) ? 'tag-warning' : ''}`}
                        style={{
                          cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
                          border: selectedConditions.includes(c.id) ? '1px solid var(--warning)' : '1px solid var(--border-color)',
                          background: selectedConditions.includes(c.id) ? 'var(--warning-bg)' : 'var(--bg-input)',
                          color: selectedConditions.includes(c.id) ? 'var(--warning)' : 'var(--text-secondary)',
                          borderRadius: '20px', transition: 'var(--transition)',
                        }}
                      >
                        {selectedConditions.includes(c.id) && <Check size={12} />} {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notas adicionales</label>
                  <textarea className="form-textarea" name="notes" value={petData.notes} onChange={handlePetChange} placeholder="Cualquier información relevante sobre tu mascota..." />
                </div>
              </div>
              <div className="wizard-footer">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Atrás</button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>Siguiente →</button>
              </div>
            </div>
          )}

          {/* Step 3: Vaccinations */}
          {step === 3 && (
            <div className="wizard-body">
              <div className="card">
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Camera size={18} /> Agrega las vacunas del carnet físico de tu mascota. Puedes saltarte este paso y agregarlas después.
                </p>
                {vaccineEntries.map((entry, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Syringe size={16} /> Vacuna #{i + 1}</span>
                      {vaccineEntries.length > 1 && (
                        <button type="button" onClick={() => removeVaccineEntry(i)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <X size={14} /> Eliminar
                        </button>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vacuna *</label>
                      <select className="form-select" value={entry.vaccineId} onChange={(e) => updateVaccineEntry(i, 'vaccineId', e.target.value)}>
                        <option value="">Seleccionar vacuna...</option>
                        {vaccines.map(v => (
                          <option key={v.id} value={v.id}>{v.name} — {v.description}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Fecha de aplicación *</label>
                        <input className="form-input" type="date" value={entry.applicationDate} onChange={(e) => updateVaccineEntry(i, 'applicationDate', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Veterinario</label>
                        <input className="form-input" value={entry.veterinarianName} onChange={(e) => updateVaccineEntry(i, 'veterinarianName', e.target.value)} placeholder="Dr. ..." />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addVaccineEntry} className="btn btn-secondary btn-sm btn-block" style={{ marginTop: '0.5rem' }}>
                  <Plus size={16} /> Agregar otra vacuna
                </button>
              </div>
              <div className="wizard-footer">
                <button className="btn btn-secondary" onClick={() => setStep(2)}>← Atrás</button>
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><Loader2 className="spinner" size={20} /> Creando...</> : <><Save size={20} /> Crear Mascota y Generar QR</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
