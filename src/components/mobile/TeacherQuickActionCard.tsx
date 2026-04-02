import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { TeacherQuickAction } from '../../data/teacherMobile';
import { scaleInItem } from '../../lib/mobileMotion';
import { cn } from '../../lib/utils';

interface TeacherQuickActionCardProps {
  action: TeacherQuickAction;
}

export default function TeacherQuickActionCard({ action }: TeacherQuickActionCardProps) {
  const Icon = action.icon;

  return (
    <motion.div variants={scaleInItem}>
      <Link
        to={action.link}
        className={cn(
          'group relative block overflow-hidden rounded-[26px] bg-gradient-to-br p-4 text-white shadow-xl transition-transform active:scale-[0.98]',
          action.gradient,
          action.glow
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_42%)] opacity-80" />

        {action.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold tracking-wide backdrop-blur-sm">
            {action.badge}
          </span>
        )}

        <div className="relative flex items-start justify-between">
          <div className="rounded-2xl bg-white/15 p-2.5 backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
          <ArrowUpRight className="h-5 w-5 opacity-70 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>

        <div className="relative mt-8">
          <p className="text-base font-semibold leading-tight">{action.label}</p>
          <p className="mt-1 text-xs text-white/75">{action.desc}</p>
        </div>
      </Link>
    </motion.div>
  );
}
