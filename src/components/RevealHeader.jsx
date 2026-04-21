import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Shared header for every Post-Watch Reveal page.
 * - Pre-header "POST-WATCH REVEAL" micro-label in Electric Purple @ 70%.
 * - Left nav: "‹ GUIDE" → /guide.
 * - Right nav: configurable label + href (defaults to "HOME ›" → /).
 *
 * The individual reveal step (taco rating, more-like-this, hot-take prompt,
 * hot-take input) renders below this header and owns its own page title.
 */
const RevealHeader = ({
  rightLabel = 'Home',
  rightHref = '/',
  onRightClick = null,
} = {}) => {
  const rightClasses =
    'group flex items-center gap-1 text-brand-muted hover:text-totes-turquoise transition-colors text-[10px] font-kumbh font-bold tracking-[0.2em] uppercase';
  const rightInner = (
    <>
      <span>{rightLabel}</span>
      <ChevronRight
        size={16}
        strokeWidth={1.5}
        className="transition-transform group-hover:translate-x-1"
      />
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <a
          href="/guide"
          className="group flex items-center gap-2 text-brand-muted hover:text-totes-turquoise transition-colors w-fit"
        >
          <ChevronLeft
            size={16}
            strokeWidth={1.5}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="text-[10px] font-kumbh font-bold tracking-[0.2em] uppercase">
            Guide
          </span>
        </a>

        {onRightClick ? (
          <button type="button" onClick={onRightClick} className={rightClasses}>
            {rightInner}
          </button>
        ) : (
          <a href={rightHref} className={rightClasses}>
            {rightInner}
          </a>
        )}
      </div>

      <span className="text-[10px] font-kumbh font-bold tracking-[0.3em] uppercase text-electric-purple/70">
        Post-Watch Reveal
      </span>
    </div>
  );
};

export default RevealHeader;
