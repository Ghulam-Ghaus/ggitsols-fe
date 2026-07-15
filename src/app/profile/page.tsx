'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfileRedirectPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!token || !user) {
        router.replace('/login');
      } else {
        if (user.role?.name === 'STUDENT') {
          router.replace('/profile/academic');
        } else if (user.role?.name === 'ADMIN') {
          router.replace('/admin/settings');
        } else {
          router.replace('/');
        }
      }
    }
  }, [loading, token, user, router]);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm">Redirecting to portal...</p>
    </div>
  );
}
