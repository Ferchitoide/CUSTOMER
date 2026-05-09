'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Cat, Dog, PawPrint, Search, User, Phone, AlertTriangle, Syringe, Building2, Calendar, ShieldCheck } from 'lucide-react';

export default function PublicQRPage({ params }) {
  const { code } = use(params);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/qr/${code}`);
        if (!res.ok) { setError('Perfil no encontrado'); return; }
        const data = await res.json();
        setPet(data.pet);
      } catch {
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  const getSpeciesIcon = (s, size = 48) => {
    if (s === 'perro') return <Dog size={size} strokeWidth={1.5} color="var(--accent)" />;
    if (s === 'gato') return <Cat size={size} strokeWidth={1.5} color="var(--accent)" />;
    return <PawPrint size={size} strokeWidth={1.5} color="var(--accent)" />;
  };

  const getAge = (d) => {
    if (!d) return '';
    const y = new Date().getFullYear() - new Date(d).getFullYear();
    return y > 0 ? `${y} año${y > 1 ? 's' : ''}` : 'Cachorro';
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

  if (error || !pet) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '1rem' }}><Search size={64} strokeWidth={1.5} /></div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Perfil no encontrado</h1>
          <p style={{ color: 'var(--text-secondary)' }}>El código QR no es válido o fue desactivado.</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Ir al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-profile fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="public-header">
        <div className="public-avatar">{getSpeciesIcon(pet.species, 56)}</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{pet.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {pet.breed || pet.species} • {pet.sex === 'macho' ? '♂️ Macho' : '♀️ Hembra'} • {getAge(pet.birthDate)}
          {pet.weightKg && ` • ${pet.weightKg} kg`}
        </p>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><User size={14} /> Dueño: {pet.owner?.fullName}</span>
          {pet.owner?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>• <Phone size={14} /> {pet.owner.phone}</span>}
        </p>
      </div>

      {/* Conditions */}
      {pet.conditions?.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title" style={{ color: 'var(--warning)' }}><AlertTriangle size={20} /> Condiciones Importantes</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {pet.conditions.map(c => (
              <span key={c.id} className="tag tag-warning" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                {c.condition.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Vaccinations */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title" style={{ color: 'var(--success)' }}><Syringe size={20} /> Historial de Vacunación</h2>
        {pet.vaccinations?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pet.vaccinations.map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{v.vaccine.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {v.veterinarianName && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><User size={12} /> {v.veterinarianName}</span>}
                    {v.clinic && <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>• <Building2 size={12} /> {v.clinic.name}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{formatDate(v.applicationDate)}</div>
                  {v.nextDoseDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end', fontSize: '0.75rem', marginTop: '0.25rem', color: new Date(v.nextDoseDate) < new Date() ? 'var(--danger)' : 'var(--success)' }}>
                      <Calendar size={12} /> Próxima: {formatDate(v.nextDoseDate)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sin vacunas registradas</p>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
          Perfil verificado por <strong style={{ color: 'var(--accent)' }}>RescueVet</strong> <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
        </p>
        <Link href="/" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>Conocer la plataforma</Link>
      </div>
    </div>
  );
}
