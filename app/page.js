import Link from 'next/link';
import { Cat, Dog, Camera, Syringe, Smartphone, Hospital, Zap, Lock, Rocket, Info, Building2 } from 'lucide-react';

export default function Home() {
  return (
    <>
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          <Cat size={24} strokeWidth={2} /> RescueVet
        </Link>
        <div className="navbar-links">
          <Link href="/login">Iniciar Sesión</Link>
          <Link href="/registro" className="btn btn-primary btn-sm">Crear Cuenta</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content fade-in">
          <div className="hero-icon" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', color: 'var(--text-primary)' }}>
            <Dog size={64} strokeWidth={1.5} />
            <Cat size={64} strokeWidth={1.5} />
          </div>
          <h1 className="hero-title">
            El <span>historial médico digital</span> de tu mascota
          </h1>
          <p className="hero-description">
            Digitaliza los carnets de vacunación, registra alergias y enfermedades, 
            y comparte toda la información de tu mascota con cualquier veterinario 
            mediante un simple código QR.
          </p>
          <div className="hero-buttons">
            <Link href="/registro" className="btn btn-primary btn-lg">
              <Rocket size={20} /> Comenzar Gratis
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              <Info size={20} /> Conocer Más
            </a>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ¿Por qué <span style={{ color: 'var(--accent)' }}>RescueVet</span>?
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Tu mascota merece un historial médico organizado y siempre accesible
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--accent)' }}><Camera size={40} strokeWidth={1.5} /></div>
              <h3 className="feature-title">Sube tus Carnets</h3>
              <p className="feature-desc">Toma una foto de los carnets físicos de vacunación y nosotros los guardamos de forma segura.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--success)' }}><Syringe size={40} strokeWidth={1.5} /></div>
              <h3 className="feature-title">Vacunas Estandarizadas</h3>
              <p className="feature-desc">Selecciona vacunas de un catálogo estándar peruano. Sin errores de tipeo ni datos desordenados.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--text-primary)' }}><Smartphone size={40} strokeWidth={1.5} /></div>
              <h3 className="feature-title">Código QR Único</h3>
              <p className="feature-desc">Cada mascota recibe un QR que cualquier veterinario puede escanear para ver su historial completo.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--warning)' }}><Hospital size={40} strokeWidth={1.5} /></div>
              <h3 className="feature-title">Independiente</h3>
              <p className="feature-desc">Regístrate sin importar si tu clínica está afiliada. Tu información es tuya, siempre.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--accent)' }}><Zap size={40} strokeWidth={1.5} /></div>
              <h3 className="feature-title">Rápido y Simple</h3>
              <p className="feature-desc">Registra a tu mascota en menos de 2 minutos con nuestro asistente de 3 pasos.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--danger)' }}><Lock size={40} strokeWidth={1.5} /></div>
              <h3 className="feature-title">Datos Seguros</h3>
              <p className="feature-desc">Tu información médica está protegida y solo tú decides quién puede verla.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'var(--bg-primary)' }}>
        <div className="container">
          <Building2 size={48} strokeWidth={1.5} style={{ margin: '0 auto 1rem', color: 'var(--text-primary)' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            ¿Eres una clínica veterinaria en Perú?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Ofrece a tus clientes el historial digital como herramienta de fidelización por solo <strong style={{ color: 'var(--accent)' }}>S/ 29 mensuales</strong>.
          </p>
          <Link href="/registro" className="btn btn-primary btn-lg">
            Solicitar Demo
          </Link>
        </div>
      </section>

      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-card)' }}>
        © 2026 RescueVet — Desarrollado en Perú
      </footer>
    </>
  );
}
