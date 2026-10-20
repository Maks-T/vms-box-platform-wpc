import React, { ReactNode } from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { Badge } from '@/shared/ui/badge';
import {cn} from "@shared/lib/utils";

interface PageHeroProps {
  badge?: string;
  title: ReactNode;
  description?: string;
  className?: string;
}

export function PageHero({
                           badge,
                           title,
                           description,
                           className
                         }: PageHeroProps) {
  return (
    <SectionLayout
      containerVariant="content"
      noPadding={true}
      className={cn("pt-6 pb-2", className)}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/70 w-full">
        <div className="flex flex-col gap-1.5">
          {badge && (
            <Badge
              variant="secondary"
              className="w-fit text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5"
            >
              {badge}
            </Badge>
          )}

          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
            {title}
          </h1>
        </div>

        {description && (
          <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </SectionLayout>
  );
}