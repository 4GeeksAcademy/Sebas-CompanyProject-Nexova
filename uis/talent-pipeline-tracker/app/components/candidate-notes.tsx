"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  type CandidateNotesResponse,
  type CandidateNote,
  type CandidateNoteCreatePayload,
  formatDate,
  recordsUrl,
} from "../lib/records";

async function fetchCandidateNotes(candidateId: string) {
  const response = await fetch(
    recordsUrl(`/${encodeURIComponent(candidateId)}/notes`),
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar las notas.");
  }

  const result = (await response.json()) as CandidateNotesResponse;

  if (!Array.isArray(result.data)) {
    throw new Error("La respuesta de notas no es válida.");
  }

  return result.data;
}

export default function CandidateNotes({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadNotes() {
      try {
        const loadedNotes = await fetchCandidateNotes(candidateId);
        if (isActive) {
          setNotes(loadedNotes);
        }
      } catch {
        if (isActive) {
          setError("No se pudieron cargar las notas. Inténtalo de nuevo.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadNotes();

    return () => {
      isActive = false;
    };
  }, [candidateId]);

  async function addNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const noteContent = content.trim();

    if (!noteContent) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload: CandidateNoteCreatePayload = { content: noteContent };
      const response = await fetch(
        recordsUrl(`/${encodeURIComponent(candidateId)}/notes`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("No se pudo añadir la nota.");
      }

      setContent("");
      setNotes(await fetchCandidateNotes(candidateId));
      setSuccess("Nota añadida.");
      router.refresh();
    } catch {
      setError("No se pudo añadir la nota. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteNote(noteId: string) {
    setDeletingNoteId(noteId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        recordsUrl(
          `/${encodeURIComponent(candidateId)}/notes/${encodeURIComponent(noteId)}`,
        ),
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("No se pudo eliminar la nota.");
      }

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId),
      );
      setSuccess("Nota eliminada.");
      router.refresh();
    } catch {
      setError("No se pudo eliminar la nota. Inténtalo de nuevo.");
    } finally {
      setDeletingNoteId(null);
    }
  }

  return (
    <section className="detail-section notes-section" aria-labelledby="notes-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Seguimiento interno</p>
          <h2 id="notes-heading">Notas</h2>
        </div>
        <span className="notes-count">
          {notes.length} {notes.length === 1 ? "nota" : "notas"}
        </span>
      </div>

      <form className="note-form" onSubmit={addNote}>
        <label htmlFor="candidate-note">Añadir una nota</label>
        <textarea
          id="candidate-note"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escribe una observación para el equipo de selección"
          rows={3}
        />
        <div className="note-form-footer">
          <span>Solo visible para el equipo de selección</span>
          <button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Guardando..." : "Añadir nota"}
          </button>
        </div>
      </form>

      {error && <p className="notes-error" role="alert">{error}</p>}
      {success && <p className="notes-success" role="status">{success}</p>}

      {isLoading ? (
        <p className="notes-empty" role="status">Cargando notas...</p>
      ) : notes.length > 0 ? (
        <ul className="notes-list">
          {notes.map((note) => (
            <li className="note-item" key={note.id}>
              <div className="note-content">
                <p>{note.content}</p>
                <time dateTime={note.created_at}>{formatDate(note.created_at)}</time>
              </div>
              <button
                className="delete-note"
                type="button"
                disabled={deletingNoteId !== null}
                onClick={() => void deleteNote(note.id)}
                aria-label="Eliminar nota"
              >
                {deletingNoteId === note.id ? "Eliminando..." : "Eliminar"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="notes-empty">Todavía no hay notas para esta candidatura.</p>
      )}
    </section>
  );
}