import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Item = {
  /** porcentaje horizontal relativo al contenedor [0..100] */
  left?: number;
  /** porcentaje vertical relativo al contenedor [0..100] */
  top?: number;
  /** ancho en px del icono (responsive via clamp dentro del componente) */
  size?: number;
  /** rotación en grados */
  rotate?: number;
  /** opacidad base 0..1 */
  opacity?: number;
  /** factor de parallax (positivo baja más rápido; negativo al revés) */
  parallax?: number;
};

type Preset =
  | "hero"
  | "logistica"
  | "cadena"
  | "cobertura"
  | "contacto";

const PRESETS: Record<Preset, Item[]> = {
  hero: [
    { left: 78, top: 18, size: 260, rotate: -12, opacity: 0.08, parallax: 0.4 },
    { left: 92, top: 62, size: 180, rotate: 18, opacity: 0.06, parallax: 0.7 },
    { left: 60, top: 80, size: 220, rotate: 6, opacity: 0.05, parallax: 0.5 },
  ],
  logistica: [
    { left: 8, top: 15, size: 200, rotate: -8, opacity: 0.05, parallax: 0.5 },
    { left: 28, top: 70, size: 280, rotate: 12, opacity: 0.05, parallax: 0.8 },
  ],
  cadena: [
    { left: 85, top: 25, size: 220, rotate: 14, opacity: 0.06, parallax: 0.6 },
    { left: 65, top: 78, size: 260, rotate: -6, opacity: 0.05, parallax: 0.9 },
  ],
  cobertura: [
    { left: 12, top: 30, size: 240, rotate: 8, opacity: 0.05, parallax: 0.5 },
    { left: 40, top: 82, size: 180, rotate: -10, opacity: 0.05, parallax: 0.7 },
    { left: 86, top: 60, size: 220, rotate: 16, opacity: 0.05, parallax: 0.6 },
  ],
  contacto: [
    { left: 80, top: 18, size: 260, rotate: -14, opacity: 0.06, parallax: 0.5 },
    { left: 12, top: 72, size: 220, rotate: 10, opacity: 0.05, parallax: 0.8 },
  ],
};

type Props = {
  preset: Preset;
  /** ruta del icono; por defecto /icono.png */
  src?: string;
  /** z-index (por defecto, 0 para ir detrás del contenido de la sección) */
  zIndex?: number;
};

const BrandWatermarks: React.FC<Props> = ({ preset, src = "/icono.png", zIndex = 0 }) => {
  const { scrollY } = useScroll();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ zIndex }}
    >
      {PRESETS[preset].map((it, i) => {
        const y = useTransform(scrollY, [0, 1200], [0, (it.parallax ?? 0.6) * 60]);
        return (
          <motion.img
            key={i}
            src={src}
            alt=""
            style={{
              position: "absolute",
              left: `${it.left ?? 50}%`,
              top: `${it.top ?? 50}%`,
              // centrado relativo
              translateX: "-50%",
              translateY: "-50%",
              width: `clamp(${(it.size ?? 220) * 0.7}px, 12vw, ${(it.size ?? 220)}px)`,
              rotate: it.rotate ?? 0,
              opacity: it.opacity ?? 0.06,
              y,
              // suaviza integración sobre el gradiente del hero
              mixBlendMode: "soft-light",
              filter: "blur(0.2px) drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
            } as any}
            className="select-none"
          />
        );
      })}
    </div>
  );
};

export default BrandWatermarks;