import { PlusIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { css, cx } from "@/styled/css";
import type { AvatarColor } from "../avatar";
import { AvatarPill } from "../avatar-pill";
import { Button } from "../button";

/**
 * PersonMenu — lista flotante de personas/roles para elegir, con una acción
 * al pie. AymurAI UI Library nodo 40002701:44844 ("single select").
 *
 * Es sólo la superficie: no monta un Popover ni maneja apertura o anclaje.
 * El consumidor la posiciona — SidePanel la ancla con Popover al botón
 * "Nuevo"; el SpeakerPicker de desktop-app la mete en su barra flotante.
 *
 * Cada fila va envuelta en un <button> porque AvatarPill renderiza un <span>
 * y no es focusable: en un menú eso dejaría las opciones fuera del alcance
 * del teclado.
 */
export type PersonMenuOption = {
  /** Identidad estable del consumidor; se usa como React key cuando está. */
  id?: string;
  /** Iniciales del avatar, p. ej. "FI" */
  initials: string;
  /** Nombre mostrado, p. ej. "Fiscal" */
  name: string;
  color?: AvatarColor;
};

export type PersonMenuProps = {
  /** Filas del menú, en orden de renderizado. Puede venir vacío. */
  options: PersonMenuOption[];
  /** Recibe el índice en `options` de la fila elegida. */
  onSelectOption: (index: number) => void;
  /** Índice marcado como seleccionado. */
  selectedIndex?: number;
  /** Texto de la acción al pie; omitir para no renderizarla. */
  footerLabel?: string;
  onFooterAction?: () => void;
  /**
   * Contenido bajo las filas en lugar del botón, cuando el consumidor
   * necesita otra cosa (p. ej. un input de nombre libre). Gana sobre
   * `footerLabel`/`onFooterAction`.
   */
  footerSlot?: ReactNode;
  /** Etiqueta accesible del contenedor. */
  "aria-label"?: string;
  className?: string;
};

const surface = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "1", // 4px
  p: "2", // 8px
  bg: "bg.secondary",
  rounded: "md", // 8px
  // Figma usa el estilo `shadow` (0 0 10px rgba(0,0,0,.1)); `menu` es el
  // token de superficie flotante que ya existe y la diferencia no se ve.
  boxShadow: "menu",
});

const optionButton = css({
  display: "block",
  width: "full",
  textAlign: "left",
  borderWidth: "0",
  bg: "[transparent]",
  p: "0",
  cursor: "pointer",
  rounded: "xl", // 24px — el foco sigue la forma de la pill
  "&:focus-visible": {
    outline: "primary-alt",
    outlineWidth: "[2px]",
    outlineOffset: "[2px]",
  },
});

// Button no tiene un tamaño de 40px (sm=32, md=48) y centra su contenido;
// Figma pide 40px de alto y contenido a la izquierda.
const footerButton = css({
  w: "full",
  h: "10", // 40px
  justifyContent: "flex-start",
});

export function PersonMenu({
  options,
  onSelectOption,
  selectedIndex,
  footerLabel,
  onFooterAction,
  footerSlot,
  className,
  "aria-label": ariaLabel = "Personas",
}: PersonMenuProps) {
  const footer =
    footerSlot ??
    (footerLabel ? (
      <Button
        variant="tertiary"
        size="sm"
        onClick={onFooterAction}
        className={footerButton}
      >
        <PlusIcon size={16} />
        {footerLabel}
      </Button>
    ) : null);

  if (options.length === 0 && !footer) return null;

  return (
    <div className={cx(surface, className)} role="group" aria-label={ariaLabel}>
      {options.map((option, index) => (
        <button
          key={option.id ?? `${option.initials}-${option.name}-${index}`}
          type="button"
          className={optionButton}
          aria-label={option.name}
          aria-current={index === selectedIndex ? "true" : undefined}
          onClick={() => onSelectOption(index)}
        >
          <AvatarPill
            initials={option.initials}
            name={option.name}
            color={option.color}
            state={index === selectedIndex ? "selected" : "default"}
          />
        </button>
      ))}
      {footer}
    </div>
  );
}

export default PersonMenu;
