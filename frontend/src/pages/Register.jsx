import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', password: '', telefono: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await register(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ya existe una cuenta con ese email');
      } else {
        setError('No se pudo completar el registro');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <label className="block mb-2 text-sm font-medium">Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border p-2 rounded mb-4" />

        <label className="block mb-2 text-sm font-medium">Apellido</label>
        <input name="apellido" value={form.apellido} onChange={handleChange} required className="w-full border p-2 rounded mb-4" />

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded mb-4" />

        <label className="block mb-2 text-sm font-medium">Teléfono (opcional)</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full border p-2 rounded mb-4" />

        <label className="block mb-2 text-sm font-medium">Contraseña</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border p-2 rounded mb-6" />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Registrarme
        </button>

        <p className="text-sm text-center mt-4">
          ¿Ya tenés cuenta? <Link to="/login" className="text-blue-600 hover:underline">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}