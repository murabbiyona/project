import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

type CardProps = HTMLMotionProps<"div"> & Omit<HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<"div">>;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn('glass-panel rounded-2xl p-6', className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export { Card };
