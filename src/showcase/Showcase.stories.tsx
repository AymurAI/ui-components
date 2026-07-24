import type { Meta, StoryObj } from "@storybook/react";
import { ArrowsClockwise, Plus, Trash } from "phosphor-react";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  AppHeader,
  ArchiveProgress,
  ArchiveTabs,
  ArchiveView,
  BigIconButton,
  Button,
  ButtonLink,
  Callout,
  Card,
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
  Logo,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  Search,
  Select,
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
} from "../index";

/**
 * A single "kitchen-sink" page that renders every @aymurai/ui component grouped
 * by category — the gallery/overview page UI libraries ship as a showroom.
 */
const meta = {
  title: "Overview/Showcase",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "app" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "#625C68",
          margin: "0 0 16px",
          paddingBottom: 8,
          borderBottom: "1px solid #E0DDE2",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "flex-start",
        }}
      >
        {children}
      </div>
    </section>
  );
}

function Tile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontFamily: "Archivo", fontSize: 11, color: "#625C68" }}>
        {label}
      </span>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ShowcasePage() {
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("a");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("ano");
  const [step] = useState(1);

  return (
    <TooltipProvider>
      <Toaster position="bottom-right" />
      <div
        style={{
          fontFamily: "Archivo, sans-serif",
          color: "#110041",
          background: "#F6F5F7",
          minHeight: "100vh",
          padding: 40,
        }}
      >
        <header style={{ marginBottom: 40 }}>
          <Logo variant="logo" />
          <p style={{ color: "#625C68", marginTop: 12, maxWidth: 560 }}>
            @aymurai/ui — every component from the Figma UI Library, in one
            page.
          </p>
        </header>

        <Section title="Brand">
          <Tile label="Logo">
            <Logo variant="logo" />
          </Tile>
          <Tile label="Logo + Feature">
            <Logo variant="logo-feature" featureName="Anonimizador" />
          </Tile>
          <Tile label="Iso">
            <Logo variant="iso" />
          </Tile>
        </Section>

        <Section title="Buttons">
          <Tile label="Primary">
            <Button variant="primary">Anonimizar</Button>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" isLoading>
              Loading
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </Tile>
          <Tile label="Secondary / Tertiary">
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
          </Tile>
          <Tile label="Button link">
            <ButtonLink href="#" type="Default">
              Ver más
            </ButtonLink>
            <ButtonLink href="#" type="Alternative">
              Alternative
            </ButtonLink>
          </Tile>
          <Tile label="Big icon button">
            <BigIconButton variant="primary" aria-label="add">
              <Plus />
            </BigIconButton>
            <BigIconButton variant="secondary" aria-label="refresh">
              <ArrowsClockwise />
            </BigIconButton>
            <BigIconButton variant="tertiary" aria-label="delete">
              <Trash />
            </BigIconButton>
          </Tile>
          <Tile label="Tool buttons">
            <ToolButton action="reemplazar" />
            <ToolButton action="reemplazar-todo" />
            <ToolButton action="eliminar" />
            <ToolButton action="eliminar-todo" />
          </Tile>
        </Section>

        <Section title="Inputs">
          <Tile label="Text field">
            <div style={{ width: 220 }}>
              <TextField
                label="Nombre"
                placeholder="Escribí un nombre"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </Tile>
          <Tile label="With suggestion / error">
            <div style={{ width: 220, display: "grid", gap: 12 }}>
              <TextField label="Sugerencia" value="" suggestion="Juan Pérez" />
              <TextField label="Error" value="x" error="Campo inválido" />
            </div>
          </Tile>
          <Tile label="Search">
            <div style={{ width: 240 }}>
              <Search
                value={search}
                suggestion="nimizador"
                placeholder="Buscar…"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </Tile>
          <Tile label="Select">
            <div style={{ width: 220 }}>
              <Select
                label="Tipo"
                placeholder="Elegí una opción"
                options={[
                  { id: "1", text: "Persona" },
                  { id: "2", text: "CUIJ" },
                  { id: "3", text: "Expediente" },
                ]}
              />
            </div>
          </Tile>
          <Tile label="Checkbox">
            <Checkbox checked={checked} onChange={setChecked}>
              Acepto
            </Checkbox>
            <Checkbox checked={false} disabled>
              Disabled
            </Checkbox>
          </Tile>
          <Tile label="Radio">
            <Radio
              name="g"
              value="a"
              checked={radio === "a"}
              onChange={() => setRadio("a")}
            >
              Opción A
            </Radio>
            <Radio
              name="g"
              value="b"
              checked={radio === "b"}
              onChange={() => setRadio("b")}
            >
              Opción B
            </Radio>
          </Tile>
          <Tile label="Switch">
            <Switch defaultChecked />
            <Switch />
          </Tile>
          <Tile label="Suggestion / Tags">
            <Suggestion>Juan Pérez</Suggestion>
            <Tag variant="Persona" />
            <Tag variant="CUIJ" />
            <Tag variant="Fecha" />
          </Tile>
        </Section>

        <Section title="Feedback & status">
          <div style={{ display: "grid", gap: 12, width: 360 }}>
            <Callout variant="info" message="Información para el usuario." />
            <Callout variant="success" message="Documento anonimizado." />
            <Callout variant="warning" message="Revisá antes de continuar." />
            <Callout variant="error" message="Ocurrió un error." />
          </div>
          <Tile label="Tooltip / Spinner / Check">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm">
                  Hover me
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div style={{ padding: "6px 10px" }}>Tooltip</div>
              </TooltipContent>
            </Tooltip>
            <Spinner />
            <CheckCircle />
          </Tile>
          <Tile label="Toast">
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                toast.custom((t) => (
                  <Toast t={t} variant="success" message="¡Guardado!" />
                ))
              }
            >
              Lanzar toast
            </Button>
          </Tile>
          <div style={{ width: "100%" }}>
            <Stepper
              current={step}
              steps={[
                { label: "Cargar" },
                { label: "Anonimizar" },
                { label: "Revisar" },
                { label: "Exportar" },
              ]}
            />
          </div>
        </Section>

        <Section title="Surfaces & overlays">
          <Card size="sm">
            <strong>Card</strong>
            <p style={{ color: "#625C68", margin: "6px 0 0" }}>
              Contenedor con borde y sombra.
            </p>
          </Card>
          <Tile label="Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="primary" size="sm">
                  Abrir dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar</DialogTitle>
                </DialogHeader>
                <DialogDescription>¿Querés continuar?</DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary" size="sm">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="primary" size="sm">
                      Aceptar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Tile>
          <Tile label="Popover">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="sm">
                  Abrir popover
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div style={{ padding: 16 }}>Contenido del popover</div>
              </PopoverContent>
            </Popover>
          </Tile>
        </Section>

        <Section title="Chrome">
          <div style={{ width: "100%", display: "grid", gap: 16 }}>
            <AppHeader
              featureName="Voz a Texto"
              steps={["Selección", "Transcripción", "Validación", "Fin"]}
              current={1}
            />
            <Toolbar context="anonimizador" />
            <StatusBar variant="tabs" tabTitle="AymurAI" />
          </div>
        </Section>

        <Section title="Archives">
          <div style={{ width: 420, display: "grid", gap: 16 }}>
            <ArchiveProgress
              fileName="demanda.docx"
              status="default"
              progress={50}
            />
            <ArchiveProgress
              fileName="acta.docx"
              status="completed"
              progress={100}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <ArchiveTabs status="selected" label="documento-1.docx" />
              <ArchiveTabs status="unselected" label="documento-2.docx" />
            </div>
            <ArchiveView type="document-ok" fileName="resolución.docx" />
          </div>
        </Section>
      </div>
    </TooltipProvider>
  );
}

export const Showcase: Story = {
  render: () => <ShowcasePage />,
};
