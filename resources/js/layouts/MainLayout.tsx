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
    <div className="flex flex-col min-h-screen bg-[#eceef1] font-sans text-stone-900 selection:bg-brand-gold selection:text-black">
      {/* Шапка OliverDeck */}
      <div className={cn(
        "w-full z-20 transition-colors duration-300",
        headerOverlaps ? "absolute top-0 left-0 bg-transparent" : "relative"
      )}>
        <Header />
      </div>

      {/* Контентная область */}
      <main className="flex-1 w-full flex flex-col bg-[#eceef1]">
        {children}
      </main>

      {/* Футер OliverDeck */}
      <Footer />

      <FavoritesDrawer />
      <Toaster position="top-right" richColors={false} />
    </div>
  );
}