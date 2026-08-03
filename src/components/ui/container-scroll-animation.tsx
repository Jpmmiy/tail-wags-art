"use client";

import React, { useRef } from "react";
import {
  useScroll,
  useTransform,
  motion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * O quadro entra inclinado e vai se endireitando conforme a seção sobe.
 * A rotação em X é o efeito: dá a sensação de uma tela sendo levantada.
 *
 * `semMoldura` remove o painel de vidro em volta — usado quando o
 * conteúdo já tem a própria carcaça (o celular, por exemplo).
 */
export const ContainerScroll = ({
  titleComponent,
  children,
  semMoldura = false,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
  semMoldura?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0.8, 0.95] : [1.04, 1],
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[52rem] items-center justify-center p-2 md:h-[68rem] md:p-16"
    >
      <div className="relative w-full py-10 md:py-28" style={{ perspective: "1200px" }}>
        <motion.div
          style={{ translateY: translate }}
          className="mx-auto max-w-3xl text-center"
        >
          {titleComponent}
        </motion.div>

        <Quadro rotate={rotate} scale={scale} semMoldura={semMoldura}>
          {children}
        </Quadro>
      </div>
    </div>
  );
};

function Quadro({
  rotate,
  scale,
  semMoldura,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  semMoldura: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow: semMoldura
          ? undefined
          : "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      /* mt positivo: com margem negativa o quadro subia por cima do
         seletor de tela que vive no título. */
      className={cn(
        "mx-auto mt-12 h-[24rem] w-full md:mt-16 md:h-[38rem]",
        semMoldura
          ? "flex max-w-md items-center justify-center"
          : "glass-deep max-w-5xl rounded-[2rem] p-2 md:p-3",
      )}
    >
      {semMoldura ? (
        children
      ) : (
        <div className="size-full overflow-hidden rounded-[1.5rem] bg-ink-sunk">
          {children}
        </div>
      )}
    </motion.div>
  );
}
