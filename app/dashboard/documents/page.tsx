"use client";

import React, { useEffect, useState } from 'react'
import FilesPage from './data-table'
import { Separator } from '@/components/ui/separator'
import { UploadModal } from '@/components/upload-modal'
import { InviteModal } from '@/components/invite-modal'
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const Documentspage = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  /** Check logged in user sessions */
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/");
        return;
      }

      setCheckingAuth(false);
    };

    checkSession();
  }, [router]);

  /** ⏳ Block render until auth check completes */
  if (checkingAuth) {
    return (    
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
    )
  }
  
  return (
    <div>
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">All Files</h2>
          <p className="text-[16px] text-gray-500">View and manage files uploaded which will display here with easy search, filter, and bulk action options.</p>
        </div>
      
        <div className="flex flex-row xs:flex-row gap-2">
          <InviteModal />
          <UploadModal />
        </div>
      </div>

      <Separator className='mb-6 mt-3.5'/>

        <h2 className='text-lg font-semibold'>All files</h2>
        <FilesPage />
    </div>
  )
}

export default Documentspage