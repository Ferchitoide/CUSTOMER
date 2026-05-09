'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cat, Dog, User, Plus, Syringe, AlertTriangle, Smartphone, PawPrint } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) { router.push('/login'); return; }
        const userData = await userRes.json();
        setUser(userData.user);

        const petsRes = await fetch('/api/pets');
        const petsData = await petsRes.json();
        setPets(petsData.pets || []);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const getSpeciesIcon = (s, size = 48) => {
    if (s === 'perro') return <Dog size={size} strokeWidth={1.5} color="var(--accent)" />;
    if (s === 'gato') return <Cat size={size} strokeWidth={1.5} color="var(--accent)" />;
    return <PawPrint size={size} strokeWidth={1.5} color="var(--accent)" />;
  };

  const getAge = (birthDate) => {
    if (!birthDate) return 'Edad desconocida';
    const now = new Date();
    const birth = new Date(birthDate);
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    if (years > 0) return `${years} año${years > 1 ? 's' : ''}`;
    return `${Math.max(1, months)} mes${months > 1 ? 'es' : ''}`;
  };

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Cargando tus mascotas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <Link href="/dashboard" className="navbar-brand">
          <Cat size={24} strokeWidth={2} /> RescueVet
        </Link>
        <div className="navbar-links">
          <span className="navbar-user"><User size={16} /> {user?.fullName?.split(' ')[0]}</span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">Salir</button>
        </div>
      </nav>

      <div className="container fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Mis Mascotas</h1>
            <p className="page-subtitle">Gestiona el historial médico de tus compañeros</p>
          </div>
          <Link href="/mascotas/nueva" className="btn btn-primary">
            <Plus size={18} /> Nueva Mascota
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <PawPrint size={64} strokeWidth={1.5} />
            </div>
            <p className="empty-state-text">Aún no has registrado ninguna mascota</p>
            <Link href="/mascotas/nueva" className="btn btn-primary btn-lg">
              <Plus size={20} /> Registrar mi primera mascota
            </Link>
          </div>
        ) : (
          <div className="grid-2">
            {pets.map((pet) => (
              <Link href={`/mascotas/${pet.id}`} key={pet.id} className="pet-card">
                <div className="pet-card-image">
                  {getSpeciesIcon(pet.species)}
                </div>
                <div className="pet-card-body">
                  <div className="pet-card-name">{pet.name}</div>
                  <div className="pet-card-breed">
                    {pet.breed || pet.species} • {getAge(pet.birthDate)}
                    {pet.weightKg && ` • ${pet.weightKg} kg`}
                  </div>
                  <div className="pet-card-tags">
                    <span className="tag tag-species">{pet.species}</span>
                    <span className="tag tag-vaccine"><Syringe size={14} /> {pet._count?.vaccinations || 0} vacunas</span>
                    {pet.conditions?.length > 0 && (
                      <span className="tag tag-warning"><AlertTriangle size={14} /> {pet.conditions.length} condición(es)</span>
                    )}
                    {pet.qrCode && (
                      <span className="tag" style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--accent)' }}>
                        <Smartphone size={14} /> QR: {pet.qrCode.shortCode}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
