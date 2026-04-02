import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { fadeUpItem } from '../../lib/mobileMotion';

interface TeacherSignalCardProps {
  title: string;
  text: string;
  tone: string;
  icon: LucideIcon;
}

export function TeacherSignalCard({ title, text, tone, icon: Icon }: TeacherSignalCardProps) {
  return (
    <motion.div
      variants={fadeUpItem}
      className={cn(
        'relative overflow-hidden rounded-3xl bg-gradient-to-br p-4 text-white shadow-lg',
        tone,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_45%)]" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-xs leading-5 text-white/75">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}
