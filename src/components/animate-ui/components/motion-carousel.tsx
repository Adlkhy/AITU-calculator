'use client';

import * as React from 'react';
import { motion, type Transition } from 'motion/react';
import { type EmblaOptionsType, type EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type PropType = {
  slides: React.ReactNode[];
  labels?: string[];
  options?: EmblaOptionsType;
};

type EmblaControls = {
  selectedIndex: number;
  scrollSnaps: number[];
  prevDisabled: boolean;
  nextDisabled: boolean;
  onDotClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

type DotButtonProps = {
  selected?: boolean;
  label: string;
  onClick: () => void;
};

const transition: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 24,
  mass: 1,
};

const useEmblaControls = (
  emblaApi: EmblaCarouselType | undefined,
): EmblaControls => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  const onDotClick = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateSelectionState = (api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  };

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    updateSelectionState(api);
  }, []);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    updateSelectionState(api);
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    emblaApi.on('reInit', onInit).on('select', onSelect);

    return () => {
      emblaApi.off('reInit', onInit).off('select', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  };
};

function MotionCarousel(props: PropType) {
  const { slides, labels, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi);

  return (
    <div className="w-full space-y-4 [--slide-spacing:1rem] [--slide-size:100%] sm:[--slide-size:80%] md:[--slide-size:60%] xl:[--slide-size:40%]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;

            return (
              <motion.div
                key={index}
                className="mr-[var(--slide-spacing)] basis-[var(--slide-size)] flex-none flex min-w-0"
              >
                <motion.div
                  className="size-full"
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.96,
                  }}
                  transition={transition}
                >
                  {slide}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <Button size="icon" variant="outline" onClick={onPrev} disabled={prevDisabled}>
          <ChevronLeft className="size-5" />
        </Button>

        <div className="flex flex-wrap justify-end items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              label={labels?.[index] ?? `Slide ${index + 1}`}
              selected={index === selectedIndex}
              onClick={() => onDotClick(index)}
            />
          ))}
        </div>

        <Button size="icon" variant="outline" onClick={onNext} disabled={nextDisabled}>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}

function DotButton({ selected = false, label, onClick }: DotButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={false}
      className="flex cursor-pointer select-none items-center justify-center rounded-full border-none bg-muted text-foreground text-xs sm:text-sm"
      animate={{
        width: selected ? 68 : 12,
        height: selected ? 28 : 12,
      }}
      transition={transition}
    >
      <motion.span
        layout
        initial={false}
        className="block whitespace-nowrap px-1 py-1"
        animate={{
          opacity: selected ? 1 : 0,
          scale: selected ? 1 : 0,
          filter: selected ? 'blur(0)' : 'blur(4px)',
        }}
        transition={transition}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}

export { MotionCarousel };