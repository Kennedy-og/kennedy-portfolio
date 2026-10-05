"use client";

import Image from "next/image";
import { useState } from "react";
import type { PortfolioData, Project } from "@/lib/portfolio-store";

type AdminDashboardProps = {
  initialData: PortfolioData;
};

const emptyProject: Project = {
  id: "",
  title: "",
  summary: "",
  description: "",
  category: "",
  status: "Draft",
  featured: false,
  published: true,
  date: new Date().toISOString().slice(0, 10),
  tools: [],
  githubUrl: "",
  liveUrl: "",
  problem: "",
  approach: "",
  outcome: "",
  image: "",
};

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const updateProfile = (field: keyof PortfolioData["profile"], value: string) => {
    setData((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value },
    }));
  };

  const updateContact = (field: keyof PortfolioData["contact"], value: string) => {
    setData((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }));
  };

  const updateSiteSetting = (field: keyof PortfolioData["siteSettings"], value: string | boolean) => {
    setData((current) => ({
      ...current,
      siteSettings: { ...current.siteSettings, [field]: value },
    }));
  };

  const updateSkillGroup = (index: number, category: string, items: string[]) => {
    setData((current) => {
      const next = [...current.skills];
      next[index] = { category, items };
      return { ...current, skills: next };
    });
  };

  const addSkillGroup = () => {
    setData((current) => ({
      ...current,
      skills: [...current.skills, { category: "New Skill Group", items: ["Item"] }],
    }));
  };

  const removeSkillGroup = (index: number) => {
    setData((current) => ({
      ...current,
      skills: current.skills.filter((_, skillIndex) => skillIndex !== index),
    }));
  };

  const updateProject = (index: number, field: keyof Project, value: string | boolean | string[]) => {
    setData((current) => {
      const next = [...current.projects];
      next[index] = { ...next[index], [field]: value };
      return { ...current, projects: next };
    });
  };

  const addProject = () => {
    setData((current) => ({
      ...current,
      projects: [...current.projects, { ...emptyProject, id: `project-${Date.now()}` }],
    }));
  };

  const deleteProject = (index: number) => {
    setData((current) => ({
      ...current,
      projects: current.projects.filter((_, projectIndex) => projectIndex !== index),
    }));
  };

  const moveProject = (index: number, direction: -1 | 1) => {
    setData((current) => {
      const next = [...current.projects];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, projects: next };
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, target: "profile" | "projects", projectIndex?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", target);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage({ type: "error", text: result.error || "Image upload failed." });
      return;
    }

    if (target === "profile") {
      updateProfile("photo", result.url);
    } else if (typeof projectIndex === "number") {
      updateProject(projectIndex, "image", result.url);
    }

    setMessage({ type: "success", text: "Image uploaded successfully." });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to save portfolio.");
      }

      setMessage({ type: "success", text: "Portfolio saved successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to save portfolio." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-page mx-auto max-w-6xl px-4 py-8 text-neutral-900 md:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white opacity-100">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white opacity-100">Portfolio settings</h1>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {message ? (
        <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      ) : null}

      <div className="space-y-8">
        <section className="glass-panel rounded-[2rem] p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">Profile</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-white">Name
              <input value={data.profile.name} onChange={(e) => updateProfile("name", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">Professional title
              <input value={data.profile.title} onChange={(e) => updateProfile("title", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white md:col-span-2">Short introduction
              <textarea value={data.profile.bio} onChange={(e) => updateProfile("bio", e.target.value)} className="admin-field mt-2 min-h-[90px] w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white md:col-span-2">About / bio
              <textarea value={data.profile.availability} onChange={(e) => updateProfile("availability", e.target.value)} className="admin-field mt-2 min-h-[120px] w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-[#17171a]">Profile image</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[#d8d0c7] bg-[#f6f3ef]">
                {data.profile.photo ? (
                  <Image src={data.profile.photo} alt="Profile" fill className="object-cover" />
                ) : null}
              </div>
              <input type="file" accept="image/*" onChange={(event) => handleImageUpload(event, "profile")} className="text-sm" />
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">Hero</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-white">Small label
              <input value={data.profile.title} onChange={(e) => updateProfile("title", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">Main headline
              <input value={data.profile.headline} onChange={(e) => updateProfile("headline", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white md:col-span-2">Hero description
              <textarea value={data.profile.bio || ""} onChange={(e) => updateProfile("bio", e.target.value)} className="admin-field mt-2 min-h-[90px] w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">Primary button text
              <input value={data.siteSettings.heroCtaPrimary} onChange={(e) => updateSiteSetting("heroCtaPrimary", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">Primary button link
              <input value={data.siteSettings.heroPrimaryLink || "#work"} onChange={(e) => updateSiteSetting("heroPrimaryLink", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">Secondary button text
              <input value={data.siteSettings.heroCtaSecondary} onChange={(e) => updateSiteSetting("heroCtaSecondary", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">Secondary button link
              <input value={data.siteSettings.heroSecondaryLink || "/contact"} onChange={(e) => updateSiteSetting("heroSecondaryLink", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">About</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-white md:col-span-2">About text
              <textarea value={data.profile.availability} onChange={(e) => updateProfile("availability", e.target.value)} className="admin-field mt-2 min-h-[110px] w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
          </div>

          <div className="mt-6 space-y-4">
            {data.skills.map((group, index) => (
              <div key={`${group.category}-${index}`} className="admin-subpanel rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <input value={group.category} onChange={(e) => updateSkillGroup(index, e.target.value, group.items)} className="admin-field w-full rounded-lg px-3 py-2 text-sm outline-none" />
                  <button type="button" onClick={() => removeSkillGroup(index)} className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">Remove</button>
                </div>
                <textarea value={group.items.join("\n")} onChange={(e) => updateSkillGroup(index, group.category, e.target.value.split(/\n|,/).map((item) => item.trim()).filter(Boolean))} className="admin-field mt-3 min-h-[90px] w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
              </div>
            ))}
            <button type="button" onClick={addSkillGroup} className="admin-secondary-button rounded-full px-4 py-2 text-sm font-medium">Add Skill Group</button>
          </div>
        </section>

        <section id="projects" className="glass-panel rounded-[2rem] p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Projects</h2>
            <button type="button" onClick={addProject} className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">+ Add New Project</button>
          </div>

          <div className="space-y-5">
            {data.projects.map((project, index) => (
              <div key={project.id || `project-${index}`} className="admin-subpanel rounded-[1.5rem] p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">Project {index + 1}</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => moveProject(index, -1)} className="admin-secondary-button rounded-full px-2.5 py-1.5 text-xs font-medium">↑</button>
                    <button type="button" onClick={() => moveProject(index, 1)} className="admin-secondary-button rounded-full px-2.5 py-1.5 text-xs font-medium">↓</button>
                    <button type="button" onClick={() => deleteProject(index)} className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700">Delete</button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-white">Title
                    <input value={project.title} onChange={(e) => updateProject(index, "title", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
                  </label>
                  <label className="text-sm font-medium text-white">Category
                    <input value={project.category} onChange={(e) => updateProject(index, "category", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
                  </label>
                  <label className="text-sm font-medium text-white md:col-span-2">Summary
                    <textarea value={project.summary} onChange={(e) => updateProject(index, "summary", e.target.value)} className="admin-field mt-2 min-h-[80px] w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
                  </label>
                  <label className="text-sm font-medium text-white md:col-span-2">Description
                    <textarea value={project.description} onChange={(e) => updateProject(index, "description", e.target.value)} className="admin-field mt-2 min-h-[110px] w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
                  </label>
                  <label className="text-sm font-medium text-white">Live URL
                    <input value={project.liveUrl || ""} onChange={(e) => updateProject(index, "liveUrl", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
                  </label>
                  <label className="text-sm font-medium text-white">GitHub URL
                    <input value={project.githubUrl || ""} onChange={(e) => updateProject(index, "githubUrl", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
                  </label>
                  <label className="text-sm font-medium text-white md:col-span-2">Technologies used
                    <input value={project.tools.join(", ")} onChange={(e) => updateProject(index, "tools", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
                  </label>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="relative h-20 w-28 overflow-hidden rounded-xl border border-[#d8d0c7] bg-[#f6f3ef]">
                    {project.image ? (
                      <Image src={project.image} alt={project.title || "Project"} fill className="object-cover" />
                    ) : null}
                  </div>
                  <input type="file" accept="image/*" onChange={(event) => handleImageUpload(event, "projects", index)} className="text-sm" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">Contact</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-white">Email
              <input value={data.contact.email} onChange={(e) => updateContact("email", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">Phone
              <input value={data.contact.phone} onChange={(e) => updateContact("phone", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">LinkedIn
              <input value={data.contact.linkedin || ""} onChange={(e) => updateContact("linkedin", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">GitHub
              <input value={data.contact.github || ""} onChange={(e) => updateContact("github", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-white">Site name
              <input value={data.siteSettings.siteName} onChange={(e) => updateSiteSetting("siteName", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="text-sm font-medium text-white">Footer text
              <input value={data.siteSettings.footerText} onChange={(e) => updateSiteSetting("footerText", e.target.value)} className="admin-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm outline-none" />
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}
