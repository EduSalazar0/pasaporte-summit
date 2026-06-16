'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Visita {
  company_id: string;
  empresas: {
    nombre: string;
  };
}

export default function Pasaporte() {
  const router = useRouter();
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      const cookies = document.cookie.split(';');
      const bannerCookie = cookies.find(c => c.trim().startsWith('student_banner_id='));

      if (!bannerCookie) {
        router.push('/registro');
        return;
      }

      const id_banner = bannerCookie.split('=')[1];

      const { data: studentData } = await supabase
        .from('estudiantes')
        .select('nombre')
        .eq('id_banner', id_banner)
        .single();

      if (studentData) {
        setNombreEstudiante(studentData.nombre.split(' ')[0]);
      }

      const { data: visitasData, error } = await supabase
        .from('visitas')
        .select(`
          company_id,
          empresas ( nombre )
        `)
        .eq('id_banner', id_banner);

      if (!error && visitasData) {
        setVisitas(visitasData as unknown as Visita[]);
      }
      setLoading(false);
    };

    fetchDatos();
  }, [router]);

  if (loading) return <div className="min-h-screen text-white flex justify-center items-center">Cargando tu pasaporte...</div>;

  return (
    <div className="min-h-screen p-6 text-white font-sans flex flex-col items-center">
      
      {/* Logos y Bienvenida */}
      <div className="w-full max-w-sm mt-8 mb-8 text-center flex flex-col items-center">
        
        {/* Logos lado a lado */}
        <div className="flex flex-row items-center justify-center w-full mb-6">
          <img src="/titulo.png" alt="Summit Empresarial" className="h-10 w-auto object-contain drop-shadow-md" />
          <div className="h-10 w-px bg-white/40 mx-5 rounded-full"></div>
          <img src="/logo.png" alt="UDLA" className="h-10 w-auto object-contain drop-shadow-md" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white drop-shadow-md">
          ¡Bienvenido, {nombreEstudiante}!
        </h1>
        
        {/* Frase en blanco, de mayor tamaño y sin punto final */}
        <p className="text-base font-bold uppercase tracking-widest text-white drop-shadow-md mt-1 px-4">
          Tu progreso de networking en la Feria:
        </p>
      </div>

      {/* Dashboard Pasaporte */}
      <div className="bg-black/30 backdrop-blur-xl w-full max-w-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Progreso del Summit</h2>
          <span className="bg-[#C10230] text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(193,2,48,0.5)]">
            {visitas.length} / 15
          </span>
        </div>
        
        <div className="p-5 flex-1">
          {visitas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <p className="text-gray-300 text-sm font-medium">Aún no hay registros.</p>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">Escanea los códigos QR ubicados en los stands para documentar tus interacciones.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {visitas.map((visita, index) => (
                <li key={index} className="flex items-center space-x-4 bg-black/40 p-3.5 rounded-xl border border-white/5 transition-all">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/30">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-100 tracking-wide text-sm">{visita.empresas.nombre}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}