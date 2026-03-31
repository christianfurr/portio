"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Role {
  role: string;
  description: string;
}

interface Show {
  title: string;
  role: string;
}

interface Equipment {
  name: string;
  category: string;
}

interface Software {
  name: string;
  proficiency: string;
}

interface StageCrewForm {
  heading: string;
  bio: string;
  roles: Role[];
  shows: Show[];
  equipment: Equipment[];
  software: Software[];
}

const emptyForm: StageCrewForm = {
  heading: "",
  bio: "",
  roles: [],
  shows: [],
  equipment: [],
  software: [],
};

export default function StageCrewPage() {
  const stageCrew = useQuery(api.stageCrew.get);
  const upsertStageCrew = useMutation(api.stageCrew.upsert);

  const [form, setForm] = useState<StageCrewForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (stageCrew) {
      setForm({
        heading: stageCrew.heading,
        bio: stageCrew.bio,
        roles: stageCrew.roles,
        shows: stageCrew.shows,
        equipment: stageCrew.equipment,
        software: stageCrew.software,
      });
    }
  }, [stageCrew]);

  const markChanged = () => {
    setHasChanges(true);
    setSavedMessage(false);
  };

  const handleChange = (field: "heading" | "bio", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    markChanged();
  };

  // --- Roles ---
  const addRole = () => {
    setForm((prev) => ({
      ...prev,
      roles: [...prev.roles, { role: "", description: "" }],
    }));
    markChanged();
  };
  const updateRole = (index: number, field: keyof Role, value: string) => {
    setForm((prev) => {
      const roles = [...prev.roles];
      roles[index] = { ...roles[index], [field]: value };
      return { ...prev, roles };
    });
    markChanged();
  };
  const removeRole = (index: number) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index),
    }));
    markChanged();
  };

  // --- Shows ---
  const addShow = () => {
    setForm((prev) => ({
      ...prev,
      shows: [...prev.shows, { title: "", role: "" }],
    }));
    markChanged();
  };
  const updateShow = (index: number, field: keyof Show, value: string) => {
    setForm((prev) => {
      const shows = [...prev.shows];
      shows[index] = { ...shows[index], [field]: value };
      return { ...prev, shows };
    });
    markChanged();
  };
  const removeShow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      shows: prev.shows.filter((_, i) => i !== index),
    }));
    markChanged();
  };

  // --- Equipment ---
  const addEquipment = () => {
    setForm((prev) => ({
      ...prev,
      equipment: [...prev.equipment, { name: "", category: "" }],
    }));
    markChanged();
  };
  const updateEquipment = (index: number, field: keyof Equipment, value: string) => {
    setForm((prev) => {
      const equipment = [...prev.equipment];
      equipment[index] = { ...equipment[index], [field]: value };
      return { ...prev, equipment };
    });
    markChanged();
  };
  const removeEquipment = (index: number) => {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index),
    }));
    markChanged();
  };

  // --- Software ---
  const addSoftware = () => {
    setForm((prev) => ({
      ...prev,
      software: [...prev.software, { name: "", proficiency: "familiar" }],
    }));
    markChanged();
  };
  const updateSoftware = (index: number, field: keyof Software, value: string) => {
    setForm((prev) => {
      const software = [...prev.software];
      software[index] = { ...software[index], [field]: value };
      return { ...prev, software };
    });
    markChanged();
  };
  const removeSoftware = (index: number) => {
    setForm((prev) => ({
      ...prev,
      software: prev.software.filter((_, i) => i !== index),
    }));
    markChanged();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await upsertStageCrew(form);
      setHasChanges(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (stageCrew === undefined) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Stage Crew</h2>
        <p className="mt-4 text-foreground-muted">Loading...</p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const smallInputClass =
    "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Stage Crew</h2>
          <p className="mt-2 text-foreground-muted">
            Edit your stage crew experience, show history, and equipment.
          </p>
        </div>
        {savedMessage && (
          <span className="text-sm text-green-500">Changes saved!</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
        {/* Heading & Bio */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Section Heading
          </label>
          <input
            type="text"
            value={form.heading}
            onChange={(e) => handleChange("heading", e.target.value)}
            placeholder="Stage Crew"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Bio
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={3}
            placeholder="Describe your stage crew experience..."
            className={inputClass}
          />
        </div>

        {/* Roles */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Roles</h3>
            <button
              type="button"
              onClick={addRole}
              className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
            >
              + Add Role
            </button>
          </div>
          <div className="space-y-3">
            {form.roles.map((role, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={role.role}
                  onChange={(e) => updateRole(i, "role", e.target.value)}
                  placeholder="Role title"
                  className={smallInputClass}
                />
                <input
                  type="text"
                  value={role.description}
                  onChange={(e) => updateRole(i, "description", e.target.value)}
                  placeholder="Description"
                  className={smallInputClass}
                />
                <button
                  type="button"
                  onClick={() => removeRole(i)}
                  className="shrink-0 rounded-lg px-2 text-foreground-muted hover:text-red-500"
                  aria-label="Remove role"
                >
                  ✕
                </button>
              </div>
            ))}
            {form.roles.length === 0 && (
              <p className="text-sm text-foreground-muted">No roles added yet.</p>
            )}
          </div>
        </div>

        {/* Shows */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Show History</h3>
            <button
              type="button"
              onClick={addShow}
              className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
            >
              + Add Show
            </button>
          </div>
          <div className="space-y-3">
            {form.shows.map((show, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={show.title}
                  onChange={(e) => updateShow(i, "title", e.target.value)}
                  placeholder="Show title"
                  className={smallInputClass}
                />
                <input
                  type="text"
                  value={show.role}
                  onChange={(e) => updateShow(i, "role", e.target.value)}
                  placeholder="Your role (e.g. Sound)"
                  className={smallInputClass}
                />
                <button
                  type="button"
                  onClick={() => removeShow(i)}
                  className="shrink-0 rounded-lg px-2 text-foreground-muted hover:text-red-500"
                  aria-label="Remove show"
                >
                  ✕
                </button>
              </div>
            ))}
            {form.shows.length === 0 && (
              <p className="text-sm text-foreground-muted">No shows added yet.</p>
            )}
          </div>
        </div>

        {/* Equipment */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Equipment</h3>
            <button
              type="button"
              onClick={addEquipment}
              className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
            >
              + Add Equipment
            </button>
          </div>
          <div className="space-y-3">
            {form.equipment.map((eq, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={eq.name}
                  onChange={(e) => updateEquipment(i, "name", e.target.value)}
                  placeholder="Equipment name"
                  className={smallInputClass}
                />
                <input
                  type="text"
                  value={eq.category}
                  onChange={(e) => updateEquipment(i, "category", e.target.value)}
                  placeholder="Category (e.g. Mixing Console)"
                  className={smallInputClass}
                />
                <button
                  type="button"
                  onClick={() => removeEquipment(i)}
                  className="shrink-0 rounded-lg px-2 text-foreground-muted hover:text-red-500"
                  aria-label="Remove equipment"
                >
                  ✕
                </button>
              </div>
            ))}
            {form.equipment.length === 0 && (
              <p className="text-sm text-foreground-muted">No equipment added yet.</p>
            )}
          </div>
        </div>

        {/* Software */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Software</h3>
            <button
              type="button"
              onClick={addSoftware}
              className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
            >
              + Add Software
            </button>
          </div>
          <div className="space-y-3">
            {form.software.map((sw, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={sw.name}
                  onChange={(e) => updateSoftware(i, "name", e.target.value)}
                  placeholder="Software name"
                  className={smallInputClass}
                />
                <select
                  value={sw.proficiency}
                  onChange={(e) => updateSoftware(i, "proficiency", e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="pro">Pro</option>
                  <option value="familiar">Familiar</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSoftware(i)}
                  className="shrink-0 rounded-lg px-2 text-foreground-muted hover:text-red-500"
                  aria-label="Remove software"
                >
                  ✕
                </button>
              </div>
            ))}
            {form.software.length === 0 && (
              <p className="text-sm text-foreground-muted">No software added yet.</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 border-t border-border pt-6">
          <button
            type="submit"
            disabled={isSubmitting || !hasChanges}
            className="rounded-lg bg-accent px-6 py-2 font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          {hasChanges && (
            <span className="text-sm text-foreground-muted">
              You have unsaved changes
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
