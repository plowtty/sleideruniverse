import { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  triggerOnce?: boolean;
  className?: string;
}

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  triggerOnce = false,
  className = '',
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal({ triggerOnce });

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    
    switch (direction) {
      case 'up':
        return 'translate(0, 80px)';
      case 'down':
        return 'translate(0, -80px)';
      case 'left':
        return 'translate(80px, 0)';
      case 'right':
        return 'translate(-80px, 0)';
      case 'fade':
        return 'translate(0, 0)';
      default:
        return 'translate(0, 80px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};
