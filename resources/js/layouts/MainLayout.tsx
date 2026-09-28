import React, { PropsWithChildren } from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer/Footer';
import { cn } from "@/shared/lib/utils";
import { Toaster } from "sonner";
import FavoritesDrawer from '@/widgets/FavoritesDrawer';

interface MainLayoutProps extends PropsWithChildren {
  headerOverlaps?: boolean;
}

export default function MainLayout({ children, headerOverlaps = false }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-foreground selection:bg-brand-lime selection:text-brand-charcoal">
      {/* Шапка GreenDECKS */}
      <div className={cn(
        "w-full z-20 transition-colors duration-300",
        headerOverlaps ? "absolute top-0 left-0 bg-transparent" : "relative"
      )}>
        <Header />
      </div>

      {/* Светлая контентная область */}
      <main className="flex-1 w-full flex flex-col bg-slate-50">
        {children}
      </main>

      {/* Темный футер */}
      <Footer />

      <FavoritesDrawer />
      <Toaster position="top-right" richColors={false} />
    </div>
  );
}