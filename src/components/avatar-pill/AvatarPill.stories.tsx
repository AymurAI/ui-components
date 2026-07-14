import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AvatarPill } from "./AvatarPill";

const meta = {
  title: "Components/AvatarPill",
  component: AvatarPill,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40002313:53080",
    },
  },
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["default", "selected", "typing"],
    },
    color: {
      control: "inline-radio",
      options: ["primary", "secondary", "warning", "success"],
    },
  },
} satisfies Meta<typeof AvatarPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initials: "AB", name: "Name Surname", state: "default" },
};

export const Selected: Story = {
  args: { initials: "AB", name: "Name Surname", state: "selected" },
};

/**
 * Hover reveals a rename pencil when `onRename` is passed — hover manually in
 * the canvas to see it (no pseudo-state addon installed in this Storybook).
 */
export const Hover: Story = {
  args: {
    initials: "AB",
    name: "Name Surname",
    state: "default",
    onRename: () => {},
  },
};

/** Typing = edit focus, triggered manually by selecting the person from the pill. */
export const Typing: Story = {
  args: {
    initials: "AB",
    name: "Name Surname",
    state: "typing",
    editValue: "Name Surname",
  },
};

/** Enter commits the controlled value; Escape restores the previous name. */
export const Editing: Story = {
  render: () => {
    const [name, setName] = useState("Name Surname");
    const [draft, setDraft] = useState(name);
    const [editing, setEditing] = useState(false);

    return (
      <AvatarPill
        initials="AB"
        name={name}
        state={editing ? "typing" : "default"}
        onRename={() => {
          setDraft(name);
          setEditing(true);
        }}
        editValue={draft}
        onEditValueChange={setDraft}
        onEditCommit={(value) => {
          const nextName = value.trim();
          if (nextName) setName(nextName);
          setEditing(false);
        }}
        onEditCancel={() => {
          setDraft(name);
          setEditing(false);
        }}
        renameInputLabel="Editar nombre de la persona"
      />
    );
  },
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <AvatarPill initials="AB" name="Persona 1" color="primary" />
      <AvatarPill initials="AB" name="Persona 2" color="success" />
      <AvatarPill initials="JU" name="Jueza" color="warning" />
      <AvatarPill
        initials="DE"
        name="Defensor"
        color="secondary"
        state="selected"
      />
      <AvatarPill
        initials="DE"
        name="Defensor"
        color="secondary"
        state="typing"
      />
      <AvatarPill
        initials="AB"
        name="Con lápiz al hover"
        color="primary"
        onRename={() => {}}
      />
    </div>
  ),
};
