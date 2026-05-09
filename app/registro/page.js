'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cat, UserPlus, Loader2, AlertTriangle } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', district: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          <Cat size={24} strokeWidth={2} /> RescueVet
        </Link>
      </nav>
      <div className="auth-page">
        <div className="auth-card fade-in">
          <h1 className="auth-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Cat size={28} strokeWidth={2} color="var(--accent)" /> Crear Cuenta
          </h1>
          <p className="auth-subtitle">Registra a tu mascota en menos de 2 minutos</p>
          {error && <div className="alert alert-error"><AlertTriangle size={16} /> {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre completo *</label>
              <input className="form-input" name="fullName" value={form.fullName} onChange={handleChange} placeholder="María Elena Quispe" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+51 987 654 321" required />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña *</label>
              <input className="form-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Distrito</label>
                <input className="form-input" name="district" value={form.district} onChange={handleChange} placeholder="Miraflores" />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input className="form-input" name="city" value={form.city} onChange={handleChange} placeholder="Lima" />
              </div>
            </div>
            <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
              {loading ? <><Loader2 className="spinner" size={20} /> Creando cuenta...</> : <><UserPlus size={20} /> Crear Cuenta</>}
            </button>
          </form>
          <p className="auth-footer">
            ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </>
  );
}
