"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { recordsUrl } from "../lib/records";
import type { Candidate, CandidateWritePayload } from "../types/records";

type CandidateFormValues = Omit<
  CandidateWritePayload,
  "linkedin_url" | "cv_url" | "experience_years"
> & {
  linkedin_url: string;
  cv_url: string;
  experience_years: string;
};

type CandidateFormProps = {
  candidate?: Candidate;
};

function initialValues(candidate?: Candidate): CandidateFormValues {
  return {
    full_name: candidate?.full_name ?? "",
    email: candidate?.email ?? "",
    phone: candidate?.phone ?? "",
    position: candidate?.position ?? "",
    linkedin_url: candidate?.linkedin_url ?? "",
    cv_url: candidate?.cv_url ?? "",
    experience_years:
      candidate == null ? "" : String(candidate.experience_years),
  };
}

export default function CandidateForm({ candidate }: CandidateFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(() => initialValues(candidate));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedCandidate, setSavedCandidate] = useState<Candidate | null>(null);
  const isEditing = candidate !== undefined;

  function updateField(field: keyof CandidateFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
    setSavedCandidate(null);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const requiredValues = [
      values.full_name,
      values.email,
      values.phone,
      values.position,
      values.experience_years,
    ];

    if (requiredValues.some((value) => value.trim() === "")) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    const experienceYears = Number(values.experience_years);
    if (!Number.isFinite(experienceYears) || experienceYears < 0) {
      setError("Los años de experiencia deben ser un número igual o mayor que cero.");
      return;
    }

    const payload: CandidateWritePayload = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      position: values.position.trim(),
      linkedin_url: values.linkedin_url.trim() || null,
      cv_url: values.cv_url.trim() || null,
      experience_years: experienceYears,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        recordsUrl(isEditing ? `/${encodeURIComponent(candidate.id)}` : ""),
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("No se pudo guardar la candidatura.");
      }

      const result = (await response.json()) as Candidate;
      if (!result.id) {
        throw new Error("El servicio devolvió una candidatura inválida.");
      }

      setSavedCandidate(result);
      router.refresh();
    } catch {
      setError(
        isEditing
          ? "No se pudieron guardar los cambios. Inténtalo de nuevo."
          : "No se pudo registrar la candidatura. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="candidate-form" onSubmit={submitForm}>
      <div className="form-grid">
        <label className="form-field form-field-wide">
          <span>Nombre completo <span aria-hidden="true">*</span></span>
          <input
            autoComplete="name"
            required
            value={values.full_name}
            onChange={(event) => updateField("full_name", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Email <span aria-hidden="true">*</span></span>
          <input
            autoComplete="email"
            type="email"
            required
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Teléfono <span aria-hidden="true">*</span></span>
          <input
            autoComplete="tel"
            type="tel"
            required
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>

        <label className="form-field form-field-wide">
          <span>Puesto <span aria-hidden="true">*</span></span>
          <input
            required
            value={values.position}
            onChange={(event) => updateField("position", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Años de experiencia <span aria-hidden="true">*</span></span>
          <input
            type="number"
            min="0"
            step="any"
            required
            value={values.experience_years}
            onChange={(event) => updateField("experience_years", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>LinkedIn</span>
          <input
            type="url"
            pattern="https://.*"
            placeholder="https://linkedin.com/in/..."
            value={values.linkedin_url}
            onChange={(event) => updateField("linkedin_url", event.target.value)}
          />
        </label>

        <label className="form-field form-field-wide">
          <span>Enlace al CV</span>
          <input
            type="url"
            pattern="https://.*"
            placeholder="https://..."
            value={values.cv_url}
            onChange={(event) => updateField("cv_url", event.target.value)}
          />
        </label>
      </div>

      <p className="form-required-note">* Campos obligatorios</p>

      {(error || savedCandidate) && (
        <div className={`form-feedback${error ? " form-feedback-error" : ""}`} role={error ? "alert" : "status"}>
          {error || (
            <>
              {isEditing ? "Cambios guardados." : "Candidatura registrada."}{" "}
              <Link href={`/candidates/${savedCandidate?.id}`}>
                Ver candidatura
              </Link>
            </>
          )}
        </div>
      )}

      <div className="form-actions">
        <Link
          className="form-cancel"
          href={candidate ? `/candidates/${candidate.id}` : "/"}
        >
          Cancelar
        </Link>
        <button className="form-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Registrar candidatura"}
        </button>
      </div>
    </form>
  );
}