'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Revisamos si el estudiante ya tiene una sesión activa
    const cookies = document.cookie.split(';');
    const bannerCookie = cookies.find(c => c.trim().startsWith('student_banner_id='));

    if (bannerCookie) {
      // Si ya está registrado, lo enviamos a su pasaporte
      router.push('/pasaporte');
    } else {
      // Si es un usuario nuevo, lo enviamos al formulario
      router.push('/registro');
    }
  }, [router]);

  return (
    // Una pantalla de carga con los colores del Summit mientras hace la redirección
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C10230]"></div>
    </div>
  );
}