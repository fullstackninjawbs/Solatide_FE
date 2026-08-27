import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * A reusable wrapper component that reveals its children with an animation
 * when they scroll into the viewport.
 * 
 * @param {ReactNode} children - Elements to animate
 * @param {number} delay - Animation delay in seconds
 * @param {'up'|'down'|'left'|'right'|'none'} direction - Direction the element slides from
 * @param {string} width - Wrapper width (default '100%')
 * @param {string} className - Optional tailwind classes for the wrapper
 */
const Reveal = ({ children, delay = 0, direction = 'up', width = '100%', className = '' }) => {
  const getVariants = () => {
    switch (direction) {
      case 'left':
        return { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };
      case 'right':
        return { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
      case 'down':
        return { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } };
      case 'none':
        return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
      case 'up':
      default:
        return { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <div style={{ width }} className={className}>
      <motion.div
        variants={getVariants()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, delay: delay, ease: [0.17, 0.55, 0.55, 1] }}
        style={{ width: '100%', height: '100%', willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;
