import {
  ArrowLeftIcon,
  ArrowsClockwiseIcon,
  ArticleIcon,
  DatabaseIcon,
  DetectiveIcon,
  FileAudioIcon,
  FileIcon,
  GearIcon,
  InfoIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { JSONContent } from "@tiptap/core";
import { type ReactNode, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { css, cva } from "@/styled/css";
import {
  AppFooter,
  AppHeader,
  ArchiveProgress,
  ArchiveRow,
  ArchiveTabs,
  ArchiveView,
  Avatar,
  AvatarPill,
  BigIconButton,
  Button,
  ButtonLink,
  Callout,
  Card,
  CardTool,
  CategoryItem,
  Checkbox,
  CheckCircle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FeaturesMenu,
  FeaturesMenuItem,
  FileDropZone,
  Logo,
  Option,
  PageTitle,
  Player,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RichTextEditor,
  Search,
  Select,
  SidePanel,
  Spinner,
  StatusBar,
  Stepper,
  Suggestion,
  Switch,
  Tag,
  TextField,
  Toast,
  ToolButton,
  Toolbar,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TranscriptBlock,
  TutorialDialog,
  TutorialGrid,
  WorkflowStepLayout,
} from "../index";

const meta = {
  title: "Overview/Showcase",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "app" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Locale = "es" | "en";
type DemoSpan = "small" | "compact" | "medium" | "wide" | "full";
type DemoAlign = "start" | "center" | "stretch";

const page = css({
  minH: "[100vh]",
  bg: "bg.primary",
  color: "text.default",
  fontFamily: "primary",
});

const pageInner = css({
  boxSizing: "border-box",
  w: "full",
  maxW: "[1600px]",
  mx: "auto",
  px: { base: "4", sm: "6", lg: "10" },
  py: { base: "6", md: "10" },
});

const hero = css({
  display: "flex",
  flexDir: "column",
  gap: "5",
  mb: { base: "10", lg: "16" },
});

const heroDescription = css({
  m: "0",
  maxW: "[720px]",
  color: "text.lighter",
  textStyle: "paragraph.sm.default",
});

const stickyNav = css({
  position: "sticky",
  top: "0",
  zIndex: "20",
  display: "flex",
  flexDir: { base: "column", md: "row" },
  alignItems: { base: "flex-start", md: "center" },
  gap: "3",
  mx: { base: "-4", sm: "-6", lg: "-10" },
  mb: "5",
  px: { base: "4", sm: "6", lg: "10" },
  py: "3",
  bg: "bg.primary",
  borderBottom: "primary",
});

const stickyBrand = css({
  display: "inline-flex",
  flexShrink: "0",
});

const sectionNav = css({
  display: "flex",
  flexWrap: "nowrap",
  flex: "1 1 auto",
  w: "full",
  minW: "[0px]",
  gap: "2",
  overflowX: "auto",
  overflowY: "hidden",
  pb: "1",
});

const sectionNavLink = css({
  display: "inline-flex",
  alignItems: "center",
  minH: "8",
  px: "3",
  border: "primary",
  rounded: "full",
  bg: "bg.secondary",
  color: "text.default",
  textStyle: "label.sm.default",
  textDecoration: "none",
  transitionProperty: "[border-color, background-color]",
  transitionDuration: "fast",
  flexShrink: "0",
  "&:hover": {
    border: "primary-alt",
    bg: "bg.primary-alternative",
  },
  "&:focus-visible": {
    outline: "primary-alt",
    outlineWidth: "[2px]",
  },
});

const sectionStyle = css({
  display: "flex",
  flexDir: "column",
  gap: "5",
  mb: { base: "10", lg: "14" },
  scrollMarginTop: { base: "[132px]", md: "[84px]" },
});

const sectionHeader = css({
  display: "flex",
  flexDir: "column",
  gap: "1",
  pb: "3",
  borderBottom: "primary",
});

const sectionTitle = css({
  m: "0",
  textStyle: "subtitle.md.strong",
});

const sectionDescription = css({
  m: "0",
  color: "text.lighter",
  textStyle: "subtitle.sm.default",
});

const demoGrid = css({
  display: "grid",
  gridTemplateColumns: {
    base: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
    xl: "repeat(12, minmax(0, 1fr))",
  },
  gap: { base: "4", md: "5" },
  alignItems: "stretch",
  minW: "[0px]",
});

const demoCardRecipe = cva({
  base: {
    display: "flex",
    flexDir: "column",
    gap: "4",
    minW: "[0px]",
    p: { base: "4", md: "5" },
    bg: "bg.secondary",
    border: "primary",
    rounded: "md",
    overflow: "hidden",
  },
  variants: {
    span: {
      small: {
        gridColumn: { md: "span 1", xl: "span 2" },
      },
      compact: {
        gridColumn: { md: "span 1", xl: "span 3" },
      },
      medium: {
        gridColumn: { md: "span 1", xl: "span 4" },
      },
      wide: {
        gridColumn: { md: "1 / -1", xl: "span 6" },
      },
      full: {
        gridColumn: "1 / -1",
      },
    },
  },
  defaultVariants: {
    span: "compact",
  },
});

const demoCardHeader = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "2",
  minH: "6",
});

const demoCardTitle = css({
  m: "0",
  color: "text.lighter",
  textStyle: "label.sm.default",
  fontWeight: "600",
});

const demoContentRecipe = cva({
  base: {
    display: "flex",
    gap: "3",
    minW: "[0px]",
    maxW: "full",
  },
  variants: {
    align: {
      start: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
      },
      center: {
        alignItems: "center",
        justifyContent: "center",
      },
      stretch: {
        alignItems: "stretch",
        justifyContent: "stretch",
      },
    },
    scroll: {
      true: {
        overflowX: "auto",
        overflowY: "hidden",
        pb: "2",
      },
      false: {
        overflow: "visible",
      },
    },
  },
  defaultVariants: {
    align: "start",
    scroll: false,
  },
});

const wrap = css({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "3",
  minW: "[0px]",
  maxW: "full",
});

const archiveViewMatrix = css({
  display: "flex",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "3",
  minW: "[0px]",
  maxW: "full",
});

const stack = css({
  display: "flex",
  flexDir: "column",
  gap: "3",
  minW: "[0px]",
  w: "full",
});

const twoColumnGrid = css({
  display: "grid",
  gridTemplateColumns: { base: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
  gap: "4",
  w: "full",
  minW: "[0px]",
});

const threeColumnGrid = css({
  display: "grid",
  gridTemplateColumns: {
    base: "1fr",
    md: "repeat(2, minmax(0, 1fr))",
    xl: "repeat(3, minmax(0, 1fr))",
  },
  gap: "4",
  w: "full",
  minW: "[0px]",
});

const control = css({
  w: "full",
  maxW: "[360px]",
  minW: "[0px]",
});

const wideControl = css({
  w: "full",
  maxW: "[520px]",
  minW: "[0px]",
});

const fullWidth = css({
  w: "full",
  minW: "[0px]",
});

const headerDemoWidth = css({
  w: "full",
  minW: "[1200px]",
});

const subtleSurface = css({
  boxSizing: "border-box",
  w: "full",
  minW: "[0px]",
  p: "4",
  rounded: "sm",
  bg: "bg.primary",
});

const builtBy = css({
  display: "flex",
  flexDir: "column",
  gap: "1",
});

const builtByLabel = css({
  color: "text.lighter",
  textStyle: "label.sm.default",
});

const builtByName = css({
  textStyle: "subtitle.md.strong",
});

const transcriptDemo = css({
  w: "full",
  maxW: "[875px]",
});

const archiveRowWidth = css({
  w: "[366px]",
  maxW: "full",
});

const largeArchiveComposition = css({
  display: "flex",
  flexDir: "column",
  alignItems: "center",
  gap: "6",
  w: "[367px]",
  flexShrink: "0",
});

const sidePanelMatrix = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "4",
  w: "max-content",
});

const sidePanelColumn = css({
  display: "flex",
  flexDir: "column",
  gap: "2",
  flexShrink: "0",
});

const matrixLabel = css({
  color: "text.lighter",
  textStyle: "label.sm.default",
});

const workflowFrame = css({
  w: "full",
  minW: "[1200px]",
  border: "primary",
  rounded: "sm",
  overflow: "hidden",
});

const cardCopy = css({
  m: "0",
  color: "text.lighter",
  textStyle: "subtitle.sm.default",
});

const sectionLinks = [
  ["identidad-navegacion", "Identidad y navegación"],
  ["acciones", "Acciones"],
  ["formularios", "Formularios y selección"],
  ["clasificacion", "Identidad y clasificación"],
  ["feedback", "Feedback y overlays"],
  ["superficies", "Superficies y carga"],
  ["archivos", "Archivos"],
  ["audio-edicion", "Audio y edición"],
  ["workflow", "Workflow"],
  ["chrome", "Chrome"],
] as const;

const englishCopy: Record<string, string> = {
  "@aymurai/ui — todos los componentes de la biblioteca de Figma, en una sola página.":
    "@aymurai/ui — every component from the Figma UI Library, in one page.",
  "Secciones del Showcase": "Showcase sections",
  "Identidad y navegación": "Identity and navigation",
  Acciones: "Actions",
  "Formularios y selección": "Forms and selection",
  "Identidad y clasificación": "Identity and classification",
  "Feedback y overlays": "Feedback and overlays",
  "Superficies y carga": "Surfaces and uploads",
  Archivos: "Files",
  "Audio y edición": "Audio and editing",
  Workflow: "Workflow",
  Chrome: "Chrome",
  "Marca, navegación global y estructura compartida entre productos.":
    "Brand, global navigation, and structure shared across products.",
  "Botones principales, enlaces y controles icónicos.":
    "Primary buttons, links, and icon controls.",
  "Entradas, sugerencias y controles de selección con estado real.":
    "Inputs, suggestions, and selection controls with real state.",
  "Representación visual de personas, entidades y categorías.":
    "Visual representation of people, entities, and categories.",
  "Estados, mensajes y superficies que aparecen sobre el contenido.":
    "States, messages, and surfaces displayed over content.",
  "Contenedores, accesos a herramientas y selección de archivos.":
    "Containers, tool entry points, and file selection.",
  "Carga, progreso, selección, preview y presentación horizontal.":
    "Upload, progress, selection, preview, and horizontal presentation.",
  "Herramientas de búsqueda, reproducción, transcripción y edición documental.":
    "Search, playback, transcription, and document editing tools.",
  "Composición de workflow": "Workflow composition",
  "Primitivas de página reunidas en un flujo real de selección de archivo.":
    "Page primitives combined in a real file-selection workflow.",
  "Representación del marco de navegador utilizado en las referencias visuales.":
    "Browser chrome used in the visual references.",
  "Variantes de Logo": "Logo variants",
  "AppHeader · wordmark de inicio": "AppHeader · home wordmark",
  "AppHeader · slots, nombre largo y stepper centrado":
    "AppHeader · slots, long name, and centered stepper",
  "Secondary y tertiary": "Secondary and tertiary",
  "TextField · controlado": "TextField · controlled",
  "TextField · typed y suggestion": "TextField · typed and suggestion",
  "TextField · error": "TextField · error",
  "Select · autogestionado": "Select · uncontrolled",
  "Select · valor y clear": "Select · value and clear",
  "Callout · estados": "Callout · states",
  "Callout · compact": "Callout · compact",
  "Tooltip, Spinner y Check": "Tooltip, Spinner, and Check",
  "Dialog · tamaños": "Dialog · sizes",
  "FileDropZone · estados": "FileDropZone · states",
  "ArchiveProgress · estados vigentes": "ArchiveProgress · current states",
  "ArchiveView · tipos": "ArchiveView · types",
  "Preview grande + ArchiveRow": "Large preview + ArchiveRow",
  "Toolbar · tres contextos": "Toolbar · three contexts",
  "SidePanel · sm, md y lg": "SidePanel · sm, md, and lg",
  "RichTextEditor · editable y read-only":
    "RichTextEditor · editable and read-only",
  "Plataforma hecha por": "Platform built by",
  "Eliminar archivo": "Delete file",
  Cerrar: "Close",
  Confirmar: "Confirm",
  "Esta demo usa la variante de tamaño “{size}” y permanece acotada al viewport.":
    "This demo uses the “{size}” size variant and remains constrained to the viewport.",
  "Resumen de Documento": "Document Summary",
  Selección: "Selection",
  Procesamiento: "Processing",
  Revisión: "Review",
  Finalización: "Completion",
  "Ir al inicio del Showcase": "Go to the start of the Showcase",
  "Set de Datos": "Datasets",
  Anonimizador: "Anonymizer",
  "Voz a Texto": "Speech to Text",
  Configuración: "Settings",
  "¿Cómo funciona?": "How does it work?",
  "Paso 1": "Step 1",
  "Paso 2": "Step 2",
  "Paso 3": "Step 3",
  "Paso 4": "Step 4",
  "Seleccioná un archivo": "Select a file",
  "Elegí el documento que querés procesar desde tu equipo.":
    "Choose the document you want to process from your device.",
  "Revisá la vista previa": "Review the preview",
  "Confirmá que el contenido se haya cargado correctamente.":
    "Confirm that the content loaded correctly.",
  "Procesá el documento": "Process the document",
  "AymurAI analiza el archivo y prepara los resultados.":
    "AymurAI analyzes the file and prepares the results.",
  "Descargá el resultado": "Download the result",
  "Guardá el archivo final en tu equipo.":
    "Save the final file to your device.",
  Resumen: "Summary",
  Cargar: "Upload",
  Procesar: "Process",
  Revisar: "Review",
  Exportar: "Export",
  Volver: "Back",
  Continuar: "Continue",
  Anonimizar: "Anonymize",
  Pequeño: "Small",
  Cargando: "Loading",
  Deshabilitado: "Disabled",
  Secundario: "Secondary",
  Terciario: "Tertiary",
  "Ver más": "Learn more",
  Alternativo: "Alternative",
  Agregar: "Add",
  Actualizar: "Refresh",
  Eliminar: "Delete",
  Nombre: "Name",
  "Escribí un nombre": "Enter a name",
  Sugerencia: "Suggestion",
  "Campo con error": "Field with error",
  "Campo inválido": "Invalid field",
  "Buscar…": "Search…",
  Tipo: "Type",
  "Elegí una opción": "Choose an option",
  "Tipo seleccionado": "Selected type",
  Acepto: "I agree",
  "Opción A": "Option A",
  "Opción B": "Option B",
  Activado: "On",
  Desactivado: "Off",
  "Aplicar sugerencia": "Apply suggestion",
  Personas: "People",
  Fechas: "Dates",
  "Categoría deshabilitada": "Disabled category",
  Persona: "Person",
  Expediente: "Case file",
  "Persona 1": "Person 1",
  Jueza: "Judge",
  Fiscal: "Prosecutor",
  Defensor: "Defense Attorney",
  "Información para el usuario.": "Information for the user.",
  "Documento anonimizado.": "Document anonymized.",
  "Revisá antes de continuar.": "Review before continuing.",
  "Ocurrió un error.": "An error occurred.",
  "Transcribiendo audio…": "Transcribing audio…",
  "Pasá el cursor": "Hover over me",
  "Abrir sm": "Open sm",
  "Abrir md": "Open md",
  "Abrir lg": "Open lg",
  "Abrir full": "Open full",
  Confirmación: "Confirmation",
  Formulario: "Form",
  Tutorial: "Tutorial",
  "Pantalla compleja": "Complex screen",
  "Abrir popover": "Open popover",
  "Contenido contextual del popover.": "Contextual popover content.",
  "Abrir tutorial": "Open tutorial",
  "¡Guardado!": "Saved!",
  "Lanzar toast": "Launch toast",
  "Card estándar": "Standard card",
  "Contenedor con borde y padding.": "Container with border and padding.",
  "Card interactiva": "Interactive card",
  "Acepta atributos HTML públicos.": "Accepts public HTML attributes.",
  "Resumen de documentos": "Document summaries",
  "Resumen automático de documentos": "Automatic document summaries",
  Próximamente: "Coming soon",
  "Herramienta todavía no disponible": "Tool not available yet",
  "Seleccioná o arrastrá el archivo para\ntranscribir":
    "Select or drag the file here\nto transcribe",
  "Formatos válidos: .mp3, .wav, .m4a": "Supported formats: .mp3, .wav, .m4a",
  "Soltá el archivo para cargarlo": "Drop the file to upload it",
  "El estado dragging puede controlarse externamente":
    "The dragging state can be controlled externally",
  "Carga no disponible": "Upload unavailable",
  "La superficie también contempla disabled":
    "The surface also supports a disabled state",
  "Seleccionable.doc": "Selectable.doc",
  "Cargando.doc": "Loading.doc",
  "Correcto.doc": "Successful.doc",
  "Fallido.doc": "Failed.doc",
  "11 pág. · 21,5 MB": "11 pages · 21.5 MB",
  Reproducir: "Play",
  "Modo edición": "Edit mode",
  "Editor de resumen": "Summary editor",
  "Vista previa del resumen": "Summary preview",
  "1. Selección de archivo": "1. File selection",
  "Revisá y validá la información extraída del documento":
    "Review and validate the information extracted from the document",
  Extracción: "Extraction",
  Validación: "Validation",
  "Seleccionar archivo": "Select file",
  "Seleccioná o arrastrá el documento para anonimizar":
    "Select or drag the document here to anonymize it",
  "Formatos válidos: .docx, .pdf": "Supported formats: .docx, .pdf",
  Finalizar: "Finish",
};

function translate(locale: Locale, value: string) {
  return locale === "en" ? (englishCopy[value] ?? value) : value;
}

function getSelectOptions(locale: Locale) {
  const t = (value: string) => translate(locale, value);
  return [
    { id: "persona", text: t("Persona") },
    { id: "cuij", text: "CUIJ" },
    { id: "expediente", text: t("Expediente") },
  ];
}

function getPeople(locale: Locale) {
  const t = (value: string) => translate(locale, value);
  return [
    { initials: "AB", name: t("Persona 1"), color: "violet" as const },
    { initials: "JU", name: t("Jueza"), color: "red" as const },
    { initials: "FI", name: t("Fiscal"), color: "yellow" as const },
    { initials: "DE", name: t("Defensor"), color: "pink" as const },
  ];
}

function getRichTextDocument(locale: Locale): JSONContent {
  if (locale === "en") {
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "This case is before Criminal, " },
            {
              type: "text",
              text: "Misdemeanor and Offences Court",
              marks: [{ type: "bold" }],
            },
            { type: "text", text: " No. 10." },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Urgent protection measures were ordered.",
              marks: [
                {
                  type: "highlight",
                  attrs: { color: "category.yellow-light" },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "El presente caso tramita ante el Juzgado en lo Penal, ",
          },
          {
            type: "text",
            text: "Contravencional y de Faltas",
            marks: [{ type: "bold" }],
          },
          { type: "text", text: " N.º 10." },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Se dispusieron medidas de protección urgentes.",
            marks: [
              { type: "highlight", attrs: { color: "category.yellow-light" } },
            ],
          },
        ],
      },
    ],
  };
}

function tutorialPlaceholder(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="130">
    <rect width="200" height="130" fill="#E5E8FF" />
    <text x="50%" y="50%" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="#3F479D">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getTutorialSteps(locale: Locale) {
  const t = (value: string) => translate(locale, value);
  return [
    {
      image: tutorialPlaceholder(t("Paso 1")),
      imageAlt: t("Seleccioná un archivo"),
      title: t("Seleccioná un archivo"),
      description: t("Elegí el documento que querés procesar desde tu equipo."),
    },
    {
      image: tutorialPlaceholder(t("Paso 2")),
      imageAlt: t("Revisá la vista previa"),
      title: t("Revisá la vista previa"),
      description: t(
        "Confirmá que el contenido se haya cargado correctamente.",
      ),
    },
    {
      image: tutorialPlaceholder(t("Paso 3")),
      imageAlt: t("Procesá el documento"),
      title: t("Procesá el documento"),
      description: t("AymurAI analiza el archivo y prepara los resultados."),
    },
    {
      image: tutorialPlaceholder(t("Paso 4")),
      imageAlt: t("Descargá el resultado"),
      title: t("Descargá el resultado"),
      description: t("Guardá el archivo final en tu equipo."),
    },
  ];
}

function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={sectionStyle}>
      <div className={sectionHeader}>
        <h2 className={sectionTitle}>{title}</h2>
        <p className={sectionDescription}>{description}</p>
      </div>
      <div className={demoGrid}>{children}</div>
    </section>
  );
}

function DemoCard({
  title,
  span = "compact",
  align = "start",
  scroll = false,
  children,
}: {
  title: string;
  span?: DemoSpan;
  align?: DemoAlign;
  scroll?: boolean;
  children: ReactNode;
}) {
  return (
    <article className={demoCardRecipe({ span })}>
      <div className={demoCardHeader}>
        <h3 className={demoCardTitle}>{title}</h3>
      </div>
      <div className={demoContentRecipe({ align, scroll })}>{children}</div>
    </article>
  );
}

function BuiltByPlaceholder({ locale }: { locale: Locale }) {
  return (
    <div className={builtBy}>
      <span className={builtByLabel}>
        {translate(locale, "Plataforma hecha por")}
      </span>
      <span className={builtByName}>datagénero</span>
    </div>
  );
}

function TrashButton({ locale }: { locale: Locale }) {
  return (
    <Button
      variant="tertiary"
      size="icon-sm"
      aria-label={translate(locale, "Eliminar archivo")}
    >
      <TrashIcon size={24} />
    </Button>
  );
}

function DialogSizeDemo({
  size,
  trigger,
  title,
  locale,
}: {
  size: "sm" | "md" | "lg" | "full";
  trigger: string;
  title: string;
  locale: Locale;
}) {
  const t = (value: string) => translate(locale, value);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent size={size}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {t(
            "Esta demo usa la variante de tamaño “{size}” y permanece acotada al viewport.",
          ).replace("{size}", size)}
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" size="sm">
              {t("Cerrar")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size="sm">{t("Confirmar")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HeaderComposition({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value);
  const tutorialSteps = getTutorialSteps(locale);
  return (
    <Dialog>
      <Popover>
        <AppHeader
          featureName={t("Resumen de Documento")}
          steps={[
            t("Selección"),
            t("Procesamiento"),
            t("Revisión"),
            t("Finalización"),
          ]}
          current={1}
          slots={{
            logo: (defaultMark) => (
              <a
                href="#identidad-navegacion"
                aria-label={t("Ir al inicio del Showcase")}
                className={css({ display: "inline-flex" })}
              >
                {defaultMark}
              </a>
            ),
            help: (defaultHelp) => (
              <DialogTrigger asChild>{defaultHelp}</DialogTrigger>
            ),
            apps: (defaultApps) => (
              <PopoverTrigger asChild>{defaultApps}</PopoverTrigger>
            ),
          }}
        />
        <PopoverContent
          style={{
            background: "transparent",
            borderRadius: 0,
            boxShadow: "none",
          }}
        >
          <FeaturesMenu>
            <FeaturesMenuItem
              icon={<DatabaseIcon size={24} />}
              label={t("Set de Datos")}
            />
            <FeaturesMenuItem
              icon={<DetectiveIcon size={24} />}
              label={t("Anonimizador")}
            />
            <FeaturesMenuItem
              icon={<FileAudioIcon size={24} />}
              label={t("Voz a Texto")}
            />
            <FeaturesMenuItem
              icon={<ArticleIcon size={24} />}
              label={t("Resumen")}
            />
            <FeaturesMenuItem
              icon={<GearIcon size={24} />}
              label={t("Configuración")}
              fullWidth
            />
          </FeaturesMenu>
        </PopoverContent>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>{t("¿Cómo funciona?")}</DialogTitle>
            <DialogClose asChild>
              <Button variant="tertiary" size="sm">
                {t("Cerrar")}
              </Button>
            </DialogClose>
          </DialogHeader>
          <TutorialGrid steps={tutorialSteps} />
        </DialogContent>
      </Popover>
    </Dialog>
  );
}

function ShowcasePage({ locale }: { locale: Locale }) {
  const t = (value: string) => translate(locale, value);
  const selectOptions = getSelectOptions(locale);
  const people = getPeople(locale);
  const tutorialSteps = getTutorialSteps(locale);
  const transcriptSample =
    locale === "en"
      ? "We are gathered here regarding case number 78274. The prosecution is conducting the investigation in preparation for the oral and public trial."
      : "Estamos aquí reunidos en relación a un caso que tiene el número 78274. La fiscalía está trabajando la investigación para preparar el juicio oral y público.";
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("a");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("ano");
  const [archiveSelected, setArchiveSelected] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(0);
  const [timestamp, setTimestamp] = useState("01:15");
  const [richTextDocument, setRichTextDocument] = useState(
    getRichTextDocument(locale),
  );
  const [richTextTitle, setRichTextTitle] = useState(
    locale === "en" ? "Summary 04/10/2025" : "Resumen 10/04/2025",
  );

  return (
    <TooltipProvider>
      <Toaster position="bottom-right" />
      <div className={page}>
        <div className={pageInner}>
          <div className={stickyNav}>
            <div className={stickyBrand}>
              <Logo variant="logo" />
            </div>
            <nav
              className={sectionNav}
              aria-label={t("Secciones del Showcase")}
            >
              {sectionLinks.map(([id, label]) => (
                <a key={id} href={`#${id}`} className={sectionNavLink}>
                  {t(label)}
                </a>
              ))}
            </nav>
          </div>
          <header className={hero}>
            <p className={heroDescription}>
              {t(
                "@aymurai/ui — todos los componentes de la biblioteca de Figma, en una sola página.",
              )}
            </p>
          </header>

          <ShowcaseSection
            id="identidad-navegacion"
            title={t("Identidad y navegación")}
            description={t(
              "Marca, navegación global y estructura compartida entre productos.",
            )}
          >
            <DemoCard title={t("Variantes de Logo")}>
              <div className={stack}>
                <Logo variant="logo" />
                <Logo variant="logo-feature" featureName={t("Anonimizador")} />
                <Logo variant="iso" />
              </div>
            </DemoCard>

            <DemoCard title="FeaturesMenu" align="center">
              <FeaturesMenu>
                <FeaturesMenuItem
                  icon={<DatabaseIcon size={24} />}
                  label={t("Set de Datos")}
                />
                <FeaturesMenuItem
                  icon={<DetectiveIcon size={24} />}
                  label={t("Anonimizador")}
                />
                <FeaturesMenuItem
                  icon={<FileAudioIcon size={24} />}
                  label={t("Voz a Texto")}
                />
                <FeaturesMenuItem
                  icon={<ArticleIcon size={24} />}
                  label={t("Resumen")}
                />
                <FeaturesMenuItem
                  icon={<GearIcon size={24} />}
                  label="Configuración"
                  fullWidth
                />
              </FeaturesMenu>
            </DemoCard>

            <DemoCard title="Stepper" span="wide" scroll>
              <div className={fullWidth}>
                <Stepper
                  current={1}
                  steps={[
                    { label: t("Cargar") },
                    { label: t("Procesar") },
                    { label: t("Revisar") },
                    { label: t("Exportar") },
                  ]}
                />
              </div>
            </DemoCard>

            <DemoCard
              title={t("AppHeader · wordmark de inicio")}
              span="full"
              scroll
            >
              <div className={headerDemoWidth}>
                <AppHeader logoVariant="logo" />
              </div>
            </DemoCard>

            <DemoCard
              title={t("AppHeader · slots, nombre largo y stepper centrado")}
              span="full"
              scroll
            >
              <div className={headerDemoWidth}>
                <HeaderComposition locale={locale} />
              </div>
            </DemoCard>

            <DemoCard title="AppFooter" span="full" scroll>
              <div className={fullWidth}>
                <AppFooter
                  leading={<BuiltByPlaceholder locale={locale} />}
                  actions={
                    <>
                      <Button variant="secondary">{t("Volver")}</Button>
                      <Button>{t("Continuar")}</Button>
                    </>
                  }
                />
              </div>
            </DemoCard>
          </ShowcaseSection>

          <ShowcaseSection
            id="acciones"
            title={t("Acciones")}
            description={t(
              "Botones principales, enlaces y controles icónicos.",
            )}
          >
            <DemoCard title="Button">
              <div className={wrap}>
                <Button>{t("Anonimizar")}</Button>
                <Button size="sm">{t("Pequeño")}</Button>
                <Button isLoading>{t("Cargando")}</Button>
                <Button disabled>{t("Deshabilitado")}</Button>
              </div>
            </DemoCard>

            <DemoCard title={t("Secondary y tertiary")}>
              <div className={wrap}>
                <Button variant="secondary">{t("Secundario")}</Button>
                <Button variant="tertiary">{t("Terciario")}</Button>
              </div>
            </DemoCard>

            <DemoCard title="ButtonLink">
              <div className={wrap}>
                <ButtonLink href="#acciones" type="Default">
                  {t("Ver más")}
                </ButtonLink>
                <ButtonLink href="#acciones" type="Alternative">
                  {t("Alternativo")}
                </ButtonLink>
              </div>
            </DemoCard>

            <DemoCard title="BigIconButton">
              <div className={wrap}>
                <BigIconButton variant="primary" aria-label={t("Agregar")}>
                  <PlusIcon />
                </BigIconButton>
                <BigIconButton variant="secondary" aria-label={t("Actualizar")}>
                  <ArrowsClockwiseIcon />
                </BigIconButton>
                <BigIconButton variant="tertiary" aria-label={t("Eliminar")}>
                  <TrashIcon />
                </BigIconButton>
              </div>
            </DemoCard>

            <DemoCard title="ToolButton" span="full">
              <div className={wrap}>
                <ToolButton action="reemplazar" />
                <ToolButton action="reemplazar-todo" />
                <ToolButton action="eliminar" />
                <ToolButton action="eliminar-todo" />
                <ToolButton action="agregar-etiqueta" />
                <ToolButton action="agregar-todas" />
              </div>
            </DemoCard>
          </ShowcaseSection>

          <ShowcaseSection
            id="formularios"
            title={t("Formularios y selección")}
            description={t(
              "Entradas, sugerencias y controles de selección con estado real.",
            )}
          >
            <DemoCard title={t("TextField · controlado")}>
              <div className={control}>
                <TextField
                  label={t("Nombre")}
                  placeholder={t("Escribí un nombre")}
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>
            </DemoCard>

            <DemoCard title={t("TextField · typed y suggestion")}>
              <div className={stack}>
                <TextField
                  label="Typed"
                  value={locale === "en" ? "John Doe" : "Juan Pérez"}
                  readOnly
                />
                <TextField
                  label={t("Sugerencia")}
                  value=""
                  suggestion={locale === "en" ? "John Doe" : "Juan Pérez"}
                  readOnly
                />
              </div>
            </DemoCard>

            <DemoCard title={t("TextField · error")}>
              <div className={control}>
                <TextField
                  label={t("Campo con error")}
                  value="x"
                  error={t("Campo inválido")}
                  readOnly
                />
              </div>
            </DemoCard>

            <DemoCard title="Search">
              <div className={wideControl}>
                <Search
                  value={search}
                  suggestion={locale === "en" ? "nymizer" : "nimizador"}
                  placeholder={t("Buscar…")}
                  onChange={(event) => setSearch(event.target.value)}
                  onClear={() => setSearch("")}
                />
              </div>
            </DemoCard>

            <DemoCard title={t("Select · autogestionado")}>
              <div className={control}>
                <Select
                  label={t("Tipo")}
                  placeholder={t("Elegí una opción")}
                  options={selectOptions}
                />
              </div>
            </DemoCard>

            <DemoCard title={t("Select · valor y clear")}>
              <div className={control}>
                <Select
                  label={t("Tipo seleccionado")}
                  value="persona"
                  options={selectOptions}
                />
              </div>
            </DemoCard>

            <DemoCard title="Checkbox">
              <div className={wrap}>
                <Checkbox checked={checked} onChange={setChecked}>
                  {t("Acepto")}
                </Checkbox>
                <Checkbox checked={false} disabled>
                  {t("Deshabilitado")}
                </Checkbox>
              </div>
            </DemoCard>

            <DemoCard title="Radio">
              <div className={wrap}>
                <Radio
                  name="showcase-radio"
                  value="a"
                  checked={radio === "a"}
                  onChange={() => setRadio("a")}
                >
                  {t("Opción A")}
                </Radio>
                <Radio
                  name="showcase-radio"
                  value="b"
                  checked={radio === "b"}
                  onChange={() => setRadio("b")}
                >
                  {t("Opción B")}
                </Radio>
              </div>
            </DemoCard>

            <DemoCard title="Switch">
              <div className={wrap}>
                <Switch defaultChecked aria-label={t("Activado")} />
                <Switch aria-label={t("Desactivado")} />
                <Switch disabled aria-label={t("Deshabilitado")} />
              </div>
            </DemoCard>

            <DemoCard title="Suggestion">
              <div className={wrap}>
                <Suggestion>
                  {locale === "en" ? "John Doe" : "Juan Pérez"}
                </Suggestion>
                <Suggestion clickable>{t("Aplicar sugerencia")}</Suggestion>
              </div>
            </DemoCard>

            <DemoCard title="CategoryItem" span="wide">
              <div className={stack}>
                <CategoryItem label={t("Personas")} defaultChecked />
                <CategoryItem label={t("Fechas")} />
                <CategoryItem label={t("Categoría deshabilitada")} disabled />
              </div>
            </DemoCard>

            <DemoCard title="Option" span="full">
              <div className={stack}>
                <Option label={t("Persona 1")} selected />
                <Option label={t("Jueza")} />
                <Option label={t("Fiscal")} />
              </div>
            </DemoCard>
          </ShowcaseSection>

          <ShowcaseSection
            id="clasificacion"
            title={t("Identidad y clasificación")}
            description={t(
              "Representación visual de personas, entidades y categorías.",
            )}
          >
            <DemoCard title="Avatar" span="wide">
              <div className={wrap}>
                <Avatar initials="AB" color="violet" size="sm" />
                <Avatar initials="JU" color="red" size="md" />
                <Avatar initials="FI" color="yellow-light" size="md" />
                <Avatar initials="DE" color="green" size="sm" />
              </div>
            </DemoCard>

            <DemoCard title="AvatarPill" span="wide">
              <div className={wrap}>
                <AvatarPill
                  initials="AB"
                  name={t("Persona 1")}
                  color="violet"
                />
                <AvatarPill
                  initials="JU"
                  name={t("Jueza")}
                  color="red"
                  state="selected"
                />
                <AvatarPill
                  initials="FI"
                  name={t("Fiscal")}
                  color="yellow"
                  onRename={() => {}}
                />
              </div>
            </DemoCard>

            <DemoCard title="Tag" span="full">
              <div className={wrap}>
                <Tag variant="Persona" />
                <Tag variant="CUIJ" />
                <Tag variant="Fecha" />
                <Tag variant="Num_Expediente" />
              </div>
            </DemoCard>
          </ShowcaseSection>

          <ShowcaseSection
            id="feedback"
            title={t("Feedback y overlays")}
            description={t(
              "Estados, mensajes y superficies que aparecen sobre el contenido.",
            )}
          >
            <DemoCard title={t("Callout · estados")} span="wide">
              <div className={stack}>
                <Callout
                  variant="info"
                  message={t("Información para el usuario.")}
                />
                <Callout
                  variant="success"
                  message={t("Documento anonimizado.")}
                />
                <Callout
                  variant="warning"
                  message={t("Revisá antes de continuar.")}
                />
                <Callout variant="error" message={t("Ocurrió un error.")} />
              </div>
            </DemoCard>

            <DemoCard title={t("Callout · compact")}>
              <div className={fullWidth}>
                <Callout
                  size="compact"
                  variant="info"
                  icon={InfoIcon}
                  noBorder
                  message={t("Transcribiendo audio…")}
                />
              </div>
            </DemoCard>

            <DemoCard title={t("Tooltip, Spinner y Check")}>
              <div className={wrap}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" size="sm">
                      {t("Pasá el cursor")}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className={css({ px: "3", py: "2" })}>Tooltip</div>
                  </TooltipContent>
                </Tooltip>
                <Spinner />
                <CheckCircle />
              </div>
            </DemoCard>

            <DemoCard title={t("Dialog · tamaños")} span="wide">
              <div className={wrap}>
                <DialogSizeDemo
                  size="sm"
                  trigger={t("Abrir sm")}
                  title={t("Confirmación")}
                  locale={locale}
                />
                <DialogSizeDemo
                  size="md"
                  trigger={t("Abrir md")}
                  title={t("Formulario")}
                  locale={locale}
                />
                <DialogSizeDemo
                  size="lg"
                  trigger={t("Abrir lg")}
                  title={t("Tutorial")}
                  locale={locale}
                />
                <DialogSizeDemo
                  size="full"
                  trigger={t("Abrir full")}
                  title={t("Pantalla compleja")}
                  locale={locale}
                />
              </div>
            </DemoCard>

            <DemoCard title="Popover" span="small">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="sm">
                    {t("Abrir popover")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className={css({ p: "4" })}>
                    {t("Contenido contextual del popover.")}
                  </div>
                </PopoverContent>
              </Popover>
            </DemoCard>

            <DemoCard title="TutorialDialog" span="small">
              <TutorialDialog
                title={t("¿Cómo funciona?")}
                steps={tutorialSteps}
                trigger={
                  <Button variant="secondary" size="sm">
                    {t("Abrir tutorial")}
                  </Button>
                }
              />
            </DemoCard>

            <DemoCard title="Toast" span="small">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  toast.custom((instance) => (
                    <Toast
                      t={instance}
                      variant="success"
                      message={t("¡Guardado!")}
                    />
                  ))
                }
              >
                {t("Lanzar toast")}
              </Button>
            </DemoCard>
          </ShowcaseSection>

          <ShowcaseSection
            id="superficies"
            title={t("Superficies y carga")}
            description={t(
              "Contenedores, accesos a herramientas y selección de archivos.",
            )}
          >
            <DemoCard title="Card" span="wide">
              <div className={stack}>
                <Card>
                  <strong>{t("Card estándar")}</strong>
                  <p className={cardCopy}>
                    {t("Contenedor con borde y padding.")}
                  </p>
                </Card>
                <Card size="sm" clickable>
                  <strong>{t("Card interactiva")}</strong>
                  <p className={cardCopy}>
                    {t("Acepta atributos HTML públicos.")}
                  </p>
                </Card>
              </div>
            </DemoCard>

            <DemoCard title="CardTool" span="wide">
              <div className={twoColumnGrid}>
                <CardTool
                  icon={<ArticleIcon />}
                  title={t("Resumen de documentos")}
                  description={t("Resumen automático de documentos")}
                  interactive
                />
                <CardTool
                  icon={<ArticleIcon />}
                  title={t("Próximamente")}
                  description={t("Herramienta todavía no disponible")}
                  disabled
                />
              </div>
            </DemoCard>

            <DemoCard title={t("FileDropZone · estados")} span="full">
              <div className={threeColumnGrid}>
                <FileDropZone
                  icon={<FileAudioIcon size={42} />}
                  title={t(
                    "Seleccioná o arrastrá el archivo para\ntranscribir",
                  )}
                  description={t("Formatos válidos: .mp3, .wav, .m4a")}
                />
                <FileDropZone
                  icon={<FileAudioIcon size={42} />}
                  title={t("Soltá el archivo para cargarlo")}
                  description={t(
                    "El estado dragging puede controlarse externamente",
                  )}
                  dragging
                />
                <FileDropZone
                  icon={<FileAudioIcon size={42} />}
                  title={t("Carga no disponible")}
                  description={t("La superficie también contempla disabled")}
                  disabled
                />
              </div>
            </DemoCard>

            <DemoCard title="TutorialGrid" span="full" scroll>
              <div className={fullWidth}>
                <TutorialGrid steps={tutorialSteps} />
              </div>
            </DemoCard>
          </ShowcaseSection>

          <ShowcaseSection
            id="archivos"
            title={t("Archivos")}
            description={t(
              "Carga, progreso, selección, preview y presentación horizontal.",
            )}
          >
            <DemoCard
              title={t("ArchiveProgress · estados vigentes")}
              span="full"
              scroll
            >
              <div className={stack}>
                <ArchiveProgress
                  fileName="demanda.docx"
                  status="default"
                  progress={50}
                />
                <ArchiveProgress
                  fileName="acta.docx"
                  status="stopped"
                  progress={20}
                />
                <ArchiveProgress
                  fileName="resolución.docx"
                  status="error"
                  progress={0}
                />
                <ArchiveProgress
                  fileName="sentencia.docx"
                  status="completed"
                  progress={100}
                />
              </div>
            </DemoCard>

            <DemoCard title="ArchiveTabs" span="wide">
              <div className={wrap}>
                <ArchiveTabs status="selected" label="documento-1.docx" />
                <ArchiveTabs status="completed" label="documento-2.docx" />
                <ArchiveTabs status="unselected" label="documento-3.docx" />
              </div>
            </DemoCard>

            <DemoCard title="ArchiveRow" span="wide">
              <div className={stack}>
                <div className={archiveRowWidth}>
                  <ArchiveRow
                    icon={<FileIcon size={24} />}
                    title="demanda-con-un-nombre-largo.docx"
                    description={t("11 pág. · 21,5 MB")}
                    trailingAction={<TrashButton locale={locale} />}
                  />
                </div>
                <div className={archiveRowWidth}>
                  <ArchiveRow
                    variant="outlined"
                    title="audiencia.wav"
                    description="11 seg. · 344 KB"
                    leadingAction={
                      <Button
                        variant="tertiary"
                        size="icon-sm"
                        aria-label={t("Reproducir")}
                      >
                        <PlayIcon size={24} />
                      </Button>
                    }
                    trailingAction={<TrashButton locale={locale} />}
                  />
                </div>
              </div>
            </DemoCard>

            <DemoCard title={t("ArchiveView · tipos")} span="full">
              <div className={archiveViewMatrix}>
                <ArchiveView
                  type="preview"
                  fileName={t("Seleccionable.doc")}
                  selected={archiveSelected}
                  onSelect={setArchiveSelected}
                />
                <ArchiveView
                  type="preview-loading"
                  fileName={t("Cargando.doc")}
                />
                <ArchiveView type="preview-error" fileName={t("Error.doc")} />
                <ArchiveView type="document-ok" fileName={t("Correcto.doc")} />
                <ArchiveView
                  type="document-error"
                  fileName={t("Fallido.doc")}
                />
              </div>
            </DemoCard>

            <DemoCard
              title={t("Preview grande + ArchiveRow")}
              span="full"
              scroll
            >
              <div className={largeArchiveComposition}>
                <ArchiveView type="preview" size="lg" selectable={false} />
                <ArchiveRow
                  icon={<FileIcon size={24} />}
                  title="documento-para-procesar.docx"
                  description={t("11 pág. · 21,5 MB")}
                  trailingAction={<TrashButton locale={locale} />}
                />
              </div>
            </DemoCard>
          </ShowcaseSection>

          <ShowcaseSection
            id="audio-edicion"
            title={t("Audio y edición")}
            description={t(
              "Herramientas de búsqueda, reproducción, transcripción y edición documental.",
            )}
          >
            <DemoCard title={t("Toolbar · tres contextos")} span="full" scroll>
              <div className={stack}>
                <Toolbar
                  context="anonimizador"
                  toolButtons={[
                    "reemplazar",
                    "reemplazar-todo",
                    "eliminar",
                    "eliminar-todo",
                  ]}
                />
                <Toolbar context="set-de-datos" />
                <Toolbar
                  context="search-switch"
                  searchValue="caso"
                  searchResultCount="1 de 2"
                  rightSlot={
                    <div className={wrap}>
                      <Switch aria-label={t("Modo edición")} />
                      <span>{t("Modo edición")}</span>
                    </div>
                  }
                />
              </div>
            </DemoCard>

            <DemoCard title="Player" span="full" scroll>
              <div className={fullWidth}>
                <Player
                  src=""
                  durationMs={8 * 60 * 1000 + 12 * 1000}
                  rightSlot={<Button>{t("Finalizar")}</Button>}
                />
              </div>
            </DemoCard>

            <DemoCard title="TranscriptBlock" span="full">
              <div className={transcriptDemo}>
                <TranscriptBlock
                  initials="AB"
                  name={t("Jueza")}
                  time="00:42"
                  text={transcriptSample}
                  color="warning"
                  highlight="caso"
                />
              </div>
            </DemoCard>

            <DemoCard title={t("SidePanel · sm, md y lg")} span="full" scroll>
              <div className={sidePanelMatrix}>
                {(["sm", "md", "lg"] as const).map((size) => (
                  <div key={size} className={sidePanelColumn}>
                    <span className={matrixLabel}>size=&quot;{size}&quot;</span>
                    <SidePanel
                      size={size}
                      turn={{
                        initials: "AB",
                        name: t("Persona 1"),
                        time: "01:15",
                        color: "violet",
                      }}
                      people={people}
                      selectedIndex={selectedPerson}
                      onSelectPerson={setSelectedPerson}
                      timestamp={timestamp}
                      onTimestampChange={setTimestamp}
                    />
                  </div>
                ))}
              </div>
            </DemoCard>

            <DemoCard
              title={t("RichTextEditor · editable y read-only")}
              span="full"
            >
              <div className={twoColumnGrid}>
                <div className={subtleSurface}>
                  <RichTextEditor
                    document={richTextDocument}
                    onChange={setRichTextDocument}
                    title={richTextTitle}
                    onTitleChange={setRichTextTitle}
                    aria-label={t("Editor de resumen")}
                  />
                </div>
                <div className={subtleSurface}>
                  <RichTextEditor
                    document={richTextDocument}
                    title={`${richTextTitle} · vista previa`}
                    readOnly
                    aria-label={t("Vista previa del resumen")}
                  />
                </div>
              </div>
            </DemoCard>
          </ShowcaseSection>

          <ShowcaseSection
            id="workflow"
            title={t("Composición de workflow")}
            description={t(
              "Primitivas de página reunidas en un flujo real de selección de archivo.",
            )}
          >
            <DemoCard title="PageTitle" span="full">
              <div className={stack}>
                <PageTitle>{t("1. Selección de archivo")}</PageTitle>
                <PageTitle>
                  {t("Revisá y validá la información extraída del documento")}
                </PageTitle>
              </div>
            </DemoCard>

            <DemoCard title="WorkflowStepLayout" span="full" scroll>
              <div className={workflowFrame}>
                <WorkflowStepLayout
                  header={
                    <AppHeader
                      featureName={t("Anonimizador")}
                      steps={[
                        t("Selección"),
                        t("Extracción"),
                        t("Validación"),
                        t("Finalización"),
                      ]}
                      current={0}
                    />
                  }
                  title={t("1. Selección de archivo")}
                  leading={
                    <Button
                      variant="tertiary"
                      size="icon-sm"
                      aria-label={t("Volver")}
                    >
                      <ArrowLeftIcon size={32} />
                    </Button>
                  }
                  footer={
                    <AppFooter
                      leading={<BuiltByPlaceholder locale={locale} />}
                      actions={<Button>{t("Seleccionar archivo")}</Button>}
                    />
                  }
                >
                  <FileDropZone
                    icon={<FileIcon size={42} />}
                    title={t(
                      "Seleccioná o arrastrá el documento para anonimizar",
                    )}
                    description={t("Formatos válidos: .docx, .pdf")}
                  />
                </WorkflowStepLayout>
              </div>
            </DemoCard>
          </ShowcaseSection>

          <ShowcaseSection
            id="chrome"
            title={t("Chrome")}
            description={t(
              "Representación del marco de navegador utilizado en las referencias visuales.",
            )}
          >
            <DemoCard title="StatusBar" span="full" scroll>
              <div className={fullWidth}>
                <StatusBar
                  variant="full"
                  tabTitle={`${t("Anonimizador")} · AymurAI`}
                  url="app.aymurai.com/anonimizador"
                />
              </div>
            </DemoCard>
          </ShowcaseSection>
        </div>
      </div>
    </TooltipProvider>
  );
}

export const Showcase: Story = {
  render: () => <ShowcasePage locale="es" />,
};

export const ShowcaseEn: Story = {
  name: "Showcase (EN)",
  render: () => <ShowcasePage locale="en" />,
};
