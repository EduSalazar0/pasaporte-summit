'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectCompany = searchParams.get('redirectCompany');

  const [formData, setFormData] = useState({
    id_banner: '',
    nombre: '',
    correo: '',
    carrera: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: studentError } = await supabase
        .from('estudiantes')
        .upsert([formData]);

      if (studentError) throw studentError;

      document.cookie = `student_banner_id=${formData.id_banner}; path=/; max-age=${60 * 60 * 24 * 2}`;

      if (redirectCompany) {
        await supabase
          .from('visitas')
          .insert([{ 
            id_banner: formData.id_banner, 
            company_id: redirectCompany 
          }]);
      }

      router.push('/pasaporte');
      
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un error al registrar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 text-white font-sans">
      
      {/* Contenedor Superior: Logos ajustados con nuevas proporciones */}
      <div className="w-full max-w-sm flex flex-col items-center mt-10 mb-6">
        <div className="flex flex-row items-center justify-center w-full mb-6">
          <img src="/titulo.png" alt="Summit Empresarial" className="h-14 w-auto object-contain drop-shadow-md" />
          <div className="h-16 w-px bg-white/40 mx-4 rounded-full"></div>
          <img src="/logo.png" alt="ASE UDLA" className="h-20 w-auto object-contain drop-shadow-md scale-110 origin-left" />
        </div>
        
        {/* Estructura tipográfica uniforme con efecto Glow */}
        <div className="text-center px-2">
          <p className="text-base font-bold tracking-widest text-white uppercase drop-shadow-md mb-1">
            Conecta. Descubre. <span className="text-[#ff4d4d] drop-shadow-[0_0_12px_rgba(255,77,77,1)]">Crece.</span>
          </p>
          <p className="text-base font-medium text-gray-200 tracking-wide">
            Tu experiencia en el Summit inicia aquí
          </p>
        </div>
      </div>

      {/* Contenedor Central: Formulario Glassmorphism */}
      <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 w-full max-w-sm mb-auto">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ID Banner</label>
            <input 
              required 
              type="text" 
              name="id_banner" 
              onChange={handleChange} 
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-[#C10230] focus:ring-1 focus:ring-[#C10230] transition-all text-white placeholder-gray-600 text-sm" 
              placeholder="Ej: A00123456" 
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
            <input 
              required 
              type="text" 
              name="nombre" 
              onChange={handleChange} 
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-[#C10230] focus:ring-1 focus:ring-[#C10230] transition-all text-white placeholder-gray-600 text-sm" 
              placeholder="Tu nombre y apellido" 
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Correo Institucional</label>
            <input 
              required 
              type="email" 
              name="correo" 
              onChange={handleChange} 
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-[#C10230] focus:ring-1 focus:ring-[#C10230] transition-all text-white placeholder-gray-600 text-sm" 
              placeholder="correo@udla.edu.ec" 
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Carrera</label>
            <input 
              required 
              type="text" 
              name="carrera" 
              onChange={handleChange} 
              className="w-full p-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-[#C10230] focus:ring-1 focus:ring-[#C10230] transition-all text-white placeholder-gray-600 text-sm" 
              placeholder="Ej: Ingeniería de Software" 
            />
          </div>
          
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full mt-4 bg-[#C10230] text-white py-3.5 rounded-xl font-bold tracking-wide hover:bg-red-800 active:scale-[0.98] disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(193,2,48,0.4)]"
          >
            {loading ? 'Procesando...' : 'Obtener Pasaporte'}
          </button>
        </form>
      </div>

      {/* Pie de página */}
      <div className="mt-8 text-center text-xs text-gray-500 pb-4">
        <p>Summit Empresarial 2026</p>
        <p>Universidad de Las Américas | Asociación de Estudiantes</p>
      </div>

    </div>
  );
}

export default function Registro() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>}>
      <RegistroForm />
    </Suspense>
  );
}

