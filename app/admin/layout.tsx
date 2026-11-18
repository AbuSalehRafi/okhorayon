'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/site-config';
import {
  BookOpen,
  Feather,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Quote,
  Sparkles,
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin', label: 'সবার তালিকা (All Entries)', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'প্রবন্ধ (Articles)', icon: FileText },
  { href: '/admin/poems', label: 'কবিতা (Poems)', icon: Feather },
  { href: '/admin/research', label: 'গবেষণা (Research)', icon: Sparkles },
  { href: '/admin/posters', label: 'পোস্টার (Posters)', icon: ImageIcon },
  { href: '/admin/books', label: 'বই (Books)', icon: BookOpen },
  { href: '/admin/quotes', label: 'দার্শনিক উক্তি (Quotes)', icon: Quote },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    const auth = localStorage.getItem('rafi_admin_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('rafi_admin_auth');
    document.cookie = 'rafi_admin_session=; path=/; max-age=0';
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="py-20 text-center font-mono text-xs text-paper-700 dark:text-ink-400">
        অক্ষরায়ণ অভয়ারণ্য যাচাই করা হচ্ছে...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Admin Subheader & Navigation Bar */}
      <div className="p-4 rounded-xl border border-paper-300 dark:border-ink-800 bg-paper-100/60 dark:bg-ink-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-semibold block">
            {siteConfig.nameTransliteration} &middot; Author Portal
          </span>
          <h2 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100">
            {siteConfig.name} অ্যাডমিন প্যানেল
          </h2>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {ADMIN_NAV.map((nav) => {
            const Icon = nav.icon;
            const isActive = pathname === nav.href;
            return (
              <Link
                key={nav.href}
                href={nav.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-accent text-white dark:text-ink-950 font-medium'
                    : 'bg-paper-200/70 dark:bg-ink-850 text-paper-700 dark:text-ink-300 hover:text-paper-900 dark:hover:text-ink-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{nav.label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="লগআউট"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Main Admin View */}
      <div className="pt-2">{children}</div>
    </div>
  );
}
