import type { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface CarouselProps {
  children?: ReactNode;
}

const Carousel = ({ children }: CarouselProps) => {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      {children}
    </div>
  );
};

export default Carousel;
