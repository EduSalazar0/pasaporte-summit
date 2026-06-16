'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

function ScanHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get('companyId');

  useEffect(() => {
    const processScan = async () => {
      if (!companyId) {
        router.push('/');
        return;
      }

      const cookies = document.cookie.split(';');
      const bannerCookie = cookies.find(c => c.trim().startsWith('student_banner_id='));
      
      if (bannerCookie) {
        const id_banner = bannerCookie.split('=')[1];
        
        const { error } = await supabase
          .from('visitas')
          .insert([{ id_banner, company_id: companyId }]);

        if (error && error.code !== '23505') { 
          console.error('Error registrando visita:', error);
        }

        router.push('/pasaporte');
      } else {
        router.push(`/registro?redirectCompany=${companyId}`);
      }
    };

    processScan();
  }, [companyId, router]);

  return (
    <div className="min-h-screen bg-summit-dark flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-summit-red mb-4"></div>
      <div className="text-white text-xl animate-pulse">Registrando visita...</div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-summit-dark flex items-center justify-center text-white">Cargando...</div>}>
      <ScanHandler />
    </Suspense>
  );
}