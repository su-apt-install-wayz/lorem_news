import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React, { type PropsWithChildren, type ReactNode } from "react";
import { CreateCategoryDialog } from "@/components/hub/categories/CreateCategoryDialog";
import { toast } from "sonner";

vi.mock("sonner", () => {
  return {
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

vi.mock("@/components/ui/tooltip", () => {
  const Passthrough: React.FC<PropsWithChildren> = ({ children }) => <>{children}</>;
  const TooltipContent: React.FC<{ children: ReactNode }> = ({ children }) => <div>{children}</div>;

  return {
    TooltipProvider: Passthrough,
    Tooltip: Passthrough,
    TooltipTrigger: Passthrough,
    TooltipContent,
  };
});

const flush = () => new Promise((r) => setTimeout(r));

describe("CreateCategoryDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithTrigger(ui: React.ReactNode) {
    return render(
      // Le composant attend des children, utilisés comme trigger
      <>
        {ui}
      </>
    );
  }

  it("ouvre le dialog quand on clique sur le trigger", () => {
    const createCategory = vi.fn().mockResolvedValue({ success: true });

    renderWithTrigger(
      <CreateCategoryDialog createCategory={createCategory}>
        <button>Ouvrir</button>
      </CreateCategoryDialog>
    );

    // Le dialog pas ouvert au début
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // trigger
    fireEvent.click(screen.getByRole("button", { name: "Ouvrir" }));

    // Le dialog s'ouvre
    const dialog = screen.getByRole("dialog", { name: "Nouvelle catégorie" });
    expect(dialog).toBeInTheDocument();

    expect(screen.getByText("Ajouter une nouvelle catégorie à la liste.")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
    expect(screen.getByLabelText("Couleur")).toBeInTheDocument();
  });

  it("affiche une erreur si on soumet sans nom", async () => {
    const createCategory = vi.fn().mockResolvedValue({ success: true });

    renderWithTrigger(
      <CreateCategoryDialog createCategory={createCategory}>
        <button>Ouvrir</button>
      </CreateCategoryDialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir" }));

    // Clique sur le bouton "Créer"
    const createBtn = screen.getByRole("button", { name: "Créer" });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Le nom est requis.");
    });

    // createCategory ne doit pas être appelé
    expect(createCategory).not.toHaveBeenCalled();
  });

  it("appelle createCategory avec le nom et la couleur par défaut, puis ferme le dialog en succès", async () => {
    const createCategory = vi.fn().mockResolvedValue({ success: true });

    renderWithTrigger(
      <CreateCategoryDialog createCategory={createCategory}>
        <button>Ouvrir</button>
      </CreateCategoryDialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir" }));

    // Remplit le nom
    const nameInput = screen.getByLabelText("Nom") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "MaCat" } });
    expect(nameInput.value).toBe("MaCat");

    // Clique sur 'Créer'
    const createBtn = screen.getByRole("button", { name: "Créer" });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith({ name: "MaCat", color: "#000000" });
    });

    await flush();

    // Toast succès + fermeture
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Catégorie créée.");
      expect(screen.queryByRole("dialog", { name: "Nouvelle catégorie" })).not.toBeInTheDocument();
    });
  });

  it("affiche le toast d'erreur sans fermer le dialog en cas d'échec", async () => {
    const createCategory = vi.fn().mockResolvedValue({ success: false, message: "Oups" });

    renderWithTrigger(
      <CreateCategoryDialog createCategory={createCategory}>
        <button>Ouvrir</button>
      </CreateCategoryDialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir" }));

    const nameInput = screen.getByLabelText("Nom") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "ErreurCat" } });

    const createBtn = screen.getByRole("button", { name: "Créer" });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith({ name: "ErreurCat", color: "#000000" });
    });

    // L’erreur doit être toastée
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Oups");
      expect(screen.getByRole("dialog", { name: "Nouvelle catégorie" })).toBeInTheDocument();
    });
  });

  it("le bouton Annuler ferme le dialog sans appeler createCategory", async () => {
    const createCategory = vi.fn().mockResolvedValue({ success: true });

    renderWithTrigger(
      <CreateCategoryDialog createCategory={createCategory}>
        <button>Ouvrir</button>
      </CreateCategoryDialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir" }));
    const cancelBtn = screen.getByRole("button", { name: "Annuler" });
    fireEvent.click(cancelBtn);

    // Le dialog se ferme
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    // Pas d'appel API
    expect(createCategory).not.toHaveBeenCalled();
  });
});