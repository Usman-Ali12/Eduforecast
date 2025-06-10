'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, AuthProvider } from '@/auth/authcontext';
import {
  LayoutDashboard,
  BarChart,
  UserCircle,
  Menu,
  X,
  UploadCloud,
  AreaChart,
  Settings,
  List,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import Image from 'next/image';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Predict', icon: BarChart, href: '/dashboard/predict-csv' },
    { name: 'Analytics', icon: AreaChart, href: '/dashboard/analytics' },
    { name: 'Upload CSV', icon: UploadCloud, href: '/dashboard/upload' },
    { name: 'Profile', icon: Settings, href: '/dashboard/profile' },
    { name: 'Dropout List', icon: List, href: '/dashboard/dropout-list' },
    { name: 'Log out', icon: LogOut, href: '/auth/login' },
  ];

  const displayName = user?.data?.displayName || user?.data?.name || 'No Name';
  const email = user?.data?.email || 'No email';
  const photoURL = user?.data?.photoURL || null;

  return (
    <div className="flex h-screen">
      <motion.div
        initial={{ width: 250 }}
        animate={{ width: collapsed ? 80 : 250 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-md bg-black/70 text-white shadow-lg border-r border-white/10 flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          {!collapsed && (
            <span className="text-3xl font-bold">
              <span className="text-white">Edu </span>
              <span className="text-blue-600 ">Forecast </span>
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {collapsed ? <Menu size={20} className="text-white" /> : <X size={20} className="text-white" />}
          </Button>
        </div>

        <nav className="flex-1">
          {sidebarItems.map(({ name, icon: Icon, href }) => (
            <Link href={href} key={name} className="group relative block">
              <div className="flex items-center gap-4 px-4 py-3 transition rounded-md hover:bg-blue-500 cursor-pointer">
                <Icon className="text-white" />
                {!collapsed && <span className="text-sm">{name}</span>}
                {collapsed && (
                  <span className="absolute left-full ml-2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {name}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 flex-1 hover:bg-blue-500 rounded-md p-1 transition cursor-pointer"
                >
                  {photoURL ? (
                    <Image
                      src={photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <UserCircle className="text-white w-8 h-8" />
                  )}
                  {!collapsed && (
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium truncate">{displayName}</span>
                      <span className="text-xs text-gray-300 truncate">{email}</span>
                    </div>
                  )}
                </Link>

                {!collapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => signOut()}
                    title="Sign Out"
                    className="text-red-400 hover:text-red-600"
                  >
                    <LogOut size={20} />
                  </Button>
                )}
              </div>

              {!collapsed && (
                <div className="text-sm text-gray-300">
                  Welcome, <span className="text-white font-semibold">{displayName}</span>
                </div>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-400">Not logged in</span>
          )}
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  );
}
