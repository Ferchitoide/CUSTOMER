'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cat, Dog, PawPrint, Smartphone, Download, AlertTriangle, FileText, Syringe, Plus, X, Save, User, Building2, Calendar, ArrowLeft } from 'lucide-react';

export default function PetProfilePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showAddVax, setShowAddVax] = useState(false);
  const [vaccines, setVaccines] = useState([]);
  const [vaxForm, setVaxForm] = useState({ vaccineId: '', applicationDate: '', veterinarianName: '' });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/pets/${id}`);
        if (!res.ok) { router.push('/dashboard'); return; }
        const data = await res.json();
        setPet(data.pet);

        const vaxRes = await fetch(`/api/vaccines?species=${data.pet.species}`);
        const vaxData = await vaxRes.json();
        setVaccines(vaxData.vaccines || []);
      } catch {
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const generateQR = async () => {
    if (!pet?.qrCode) return;
    const QRCode = (await import('qrcode')).default;
    const url = `${window.location.origin}/qr/${pet.qrCode.shortCode}`;
    const dataUrl = await QRCode.toDataURL(url, { width: 250, margin: 2, color: { dark: '#1a1a2e', light: '#ffffff' } });
    setQrDataUrl(dataUrl);
    setShowQR(true);
  };

  const addVaccination = async () => {
    if (!vaxForm.vaccineId || !vaxForm.applicationDate) return;
    try {
      const res = await fetch(`/api/pets/${id}/vaccinations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vaxForm),
      });
      if (res.ok) {
        const updated = await fetch(`/api/pets/${id}`);
        const data = await updated.json();
        setPet(data.pet);
        setShowAddVax(false);
        setVaxForm({ vaccineId: '', applicationDate: '', veterinarianName: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSpeciesIcon = (s, size = 48) => {
    if (s === 'perro') return <Dog size={size} strokeWidth={1.5} color="var(--accent)" />;
    if (s === 'gato') return <Cat size={size} strokeWidth={1.5} color="var(--accent)" />;
    return <PawPrint size={size} strokeWidth={1.5} color="var(--accent)" />;
  };

  const getAge = (birthDate) => {
    if (!birthDate) return 'Edad desconocida';
    const birth = new Date(birthDate);
    const now = new Date();
    const y = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (y > 0) return `${y} año${y > 1 ? 's' : ''}`;
    return `${Math.max(1, m)} mes${m > 1 ? 'es' : ''}`;
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!pet) return null;

  return (
    <>
      <nav className="navbar">
        <Link href="/dashboard" className="navbar-brand">
          <Cat size={24} strokeWidth={2} /> RescueVet
        </Link>
        <Link href="/dashboard" className="btn btn-secondary btn-sm"><ArrowLeft size={16} /> Mis Mascotas</Link>
      </nav>

      <div className="container fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">{getSpeciesIcon(pet.species, 64)}</div>
          <div className="profile-info">
            <h1 className="profile-name">{pet.name}</h1>
            <p className="profile-meta">
              {pet.breed || pet.species} • {pet.sex === 'macho' ? '♂️ Macho' : pet.sex === 'hembra' ? '♀️ Hembra' : ''} • {getAge(pet.birthDate)}
              {pet.weightKg && ` • ${pet.weightKg} kg`}
            </p>
            <div className="profile-stats">
              <div className="stat">
                <div className="stat-value">{pet.vaccinations?.length || 0}</div>
                <div className="stat-label">Vacunas</div>
              </div>
              <div className="stat">
                <div className="stat-value">{pet.conditions?.length || 0}</div>
                <div className="stat-label">Condiciones</div>
              </div>
              <div className="stat">
                <div className="stat-value">{pet.media?.length || 0}</div>
                <div className="stat-label">Fotos</div>
              </div>
            </div>
          </div>
          <button onClick={generateQR} className="btn btn-primary"><Smartphone size={18} /> Ver QR</button>
        </div>

        {/* QR Modal */}
        {showQR && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => setShowQR(false)}>
            <div className="card" style={{ textAlign: 'center', maxWidth: '350px' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Smartphone size={20} /> QR de {pet.name}</h3>
              <div className="qr-container" style={{ margin: '0 auto' }}>
                {qrDataUrl && <img src={qrDataUrl} alt="QR Code" />}
                <div className="qr-code-text">{pet.qrCode?.shortCode}</div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '1rem' }}>
                Cualquier veterinario puede escanear este código para ver el historial de {pet.name}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary btn-block btn-sm" onClick={() => setShowQR(false)}>Cerrar</button>
                <a href={qrDataUrl} download={`qr-${pet.name}.png`} className="btn btn-primary btn-block btn-sm"><Download size={16} /> Descargar</a>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Conditions */}
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertTriangle size={18} style={{ color: 'var(--warning)' }} /> Alergias & Condiciones</span>
            </div>
            {pet.conditions?.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {pet.conditions.map(c => (
                  <span key={c.id} className="tag tag-warning">{c.condition.name}</span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sin alergias ni condiciones registradas</p>
            )}
          </div>

          {/* Notes */}
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} style={{ color: 'var(--accent)' }} /> Notas</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {pet.notes || 'Sin notas adicionales'}
            </p>
          </div>
        </div>

        {/* Vaccinations */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Syringe size={20} style={{ color: 'var(--success)' }} /> Historial de Vacunación</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddVax(!showAddVax)}>
              {showAddVax ? <X size={16} /> : <Plus size={16} />}
              {showAddVax ? ' Cancelar' : ' Agregar Vacuna'}
            </button>
          </div>

          {showAddVax && (
            <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--accent)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Vacuna *</label>
                  <select className="form-select" value={vaxForm.vaccineId} onChange={e => setVaxForm({ ...vaxForm, vaccineId: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {vaccines.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha *</label>
                  <input className="form-input" type="date" value={vaxForm.applicationDate} onChange={e => setVaxForm({ ...vaxForm, applicationDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Veterinario</label>
                  <input className="form-input" value={vaxForm.veterinarianName} onChange={e => setVaxForm({ ...vaxForm, veterinarianName: e.target.value })} placeholder="Dr. ..." />
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={addVaccination}><Save size={16} /> Guardar Vacuna</button>
            </div>
          )}

          {pet.vaccinations?.length > 0 ? (
            <div className="timeline">
              {pet.vaccinations.map(v => (
                <div key={v.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">{formatDate(v.applicationDate)}</div>
                    <div className="timeline-title">{v.vaccine.name}</div>
                    <div className="timeline-meta" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {v.veterinarianName && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><User size={12} /> {v.veterinarianName}</span>}
                      {v.clinic && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>• <Building2 size={12} /> {v.clinic.name}</span>}
                      {v.nextDoseDate && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>• <Calendar size={12} /> Próxima: {formatDate(v.nextDoseDate)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No hay vacunas registradas aún</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
