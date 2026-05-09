'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cat, LogIn, Loader2, AlertTriangle, Lightbulb } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
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
          <h1 className="auth-title">Bienvenido</h1>
          <p className="auth-subtitle">Inicia sesión para ver a tus mascotas</p>
          {error && <div className="alert alert-error"><AlertTriangle size={16} /> {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Tu contraseña" required />
            </div>
            <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
              {loading ? <><Loader2 className="spinner" size={20} /> Ingresando...</> : <><LogIn size={20} /> Iniciar Sesión</>}
            </button>
          </form>
          <p className="auth-footer">
            ¿No tienes cuenta? <Link href="/registro">Regístrate gratis</Link>
          </p>
          <div className="form-hint" style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
            <Lightbulb size={14} style={{ color: 'var(--warning)' }} /> Prueba: maria.quispe@gmail.com / Test1234!
          </div>
        </div>
      </div>
    </>
  );
}
