import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CategoryCard, CategoryCardSkeleton } from "@/components/hub/categories/CategoryCard";
import userEvent from "@testing-library/user-event";

// Définition locale du type attendu par le composant
interface Category {
  id: number;
  name: string;
  color: string;
  articleCount?: number;
}

// Mocks des dépendances UI
vi.mock("next/link", () => {
  interface LinkProps {
    href: string;
    target?: string;
    children: React.ReactNode;
  }
  const Link = ({ href, target, children }: LinkProps) => (
    <a href={href} target={target} data-testid="next-link">
      {children}
    </a>
  );
  return { default: Link };
});

vi.mock("lucide-react", () => {
  const Eye = () => <svg aria-label="eye-icon" />;
  return { Eye };
});

vi.mock("@/components/ui/card", () => {
  interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  const Card = ({ children, ...rest }: DivProps) => <div data-testid="card" {...rest}>{children}</div>;
  const CardHeader = ({ children, ...rest }: DivProps) => <div data-testid="card-header" {...rest}>{children}</div>;
  const CardContent = ({ children, ...rest }: DivProps) => <div data-testid="card-content" {...rest}>{children}</div>;
  const CardFooter = ({ children, ...rest }: DivProps) => <div data-testid="card-footer" {...rest}>{children}</div>;
  const CardTitle = ({ children, ...rest }: DivProps) => <h3 data-testid="card-title" {...rest}>{children}</h3>;
  return { Card, CardHeader, CardContent, CardFooter, CardTitle };
});

vi.mock("@/components/ui/skeleton", () => {
  const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
    <div data-testid="skeleton" {...props} />
  );
  return { Skeleton };
});

vi.mock("@/components/ui/badge", () => {
  interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  const Badge = ({ children, style, className }: BadgeProps) => (
    <div data-testid="badge" style={style} className={className}>
      {children}
    </div>
  );
  return { Badge };
});

vi.mock("@/components/ui/button", () => {
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: string;
    size?: string;
  }
  const Button = ({ children, ...rest }: ButtonProps) => (
    <button type="button" data-testid="button" {...rest}>{children}</button>
  );
  return { Button };
});

vi.mock("@/components/ui/tooltip", () => {
  interface Props { children: React.ReactNode }
  const TooltipProvider = ({ children }: Props) => <div data-testid="tooltip-provider">{children}</div>;
  const Tooltip = ({ children }: Props) => <div data-testid="tooltip">{children}</div>;
  const TooltipTrigger = ({ children }: Props) => <div data-testid="tooltip-trigger">{children}</div>;
  const TooltipContent = ({ children }: Props) => <div data-testid="tooltip-content">{children}</div>;
  return { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
});

vi.mock("@/components/hub/SelectableLabelCheckbox", () => {
  interface Props {
    labelUnchecked: string;
    labelChecked: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
  }
  const SelectableLabelCheckbox = ({ labelUnchecked, labelChecked, checked, disabled, onChange }: Props) => (
    <label>
      <input
        type="checkbox"
        role="checkbox"
        aria-label={checked ? labelChecked : labelUnchecked}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <span data-testid="slc-label">{checked ? labelChecked : labelUnchecked}</span>
    </label>
  );
  return { SelectableLabelCheckbox };
});

//Mock: remplace EditCategoryDialog pour tester le passage des données des callbacks
vi.mock("@/components/hub/categories/EditCategoryDialog", () => {
  interface Props {
    category: Category;
    updateCategory: (id: number, payload: { name: string; color: string }) => Promise<{ success: boolean; message?: string }>;
    onOptimisticUpdate: (category: Category) => void;
  }
  const EditCategoryDialog = ({ category, updateCategory, onOptimisticUpdate }: Props) => {
    return (
      <div data-testid="edit-category-dialog">
        <button
          type="button"
          aria-label="open-edit"
          onClick={async () => {
            await updateCategory(category.id, { name: category.name, color: category.color ?? "" });
            onOptimisticUpdate(category);
          }}
        >
          Ouvrir l’édition
        </button>
      </div>
    );
  };
  return { EditCategoryDialog };
});

describe("CategoryCard", () => {
  const baseCategory: Category = { id: 10, name: "Actualités & Économie", color: "#000000" };

  it("appelle onToggle avec l’id et l’état quand la checkbox change", () => {
    const onToggle = vi.fn();
    const updateCategory = vi.fn().mockResolvedValue({ success: true });
    const onOptimisticUpdate = vi.fn();

    render(
      <CategoryCard
        category={baseCategory}
        selected={false}
        onToggle={onToggle}
        updateCategory={updateCategory}
        onOptimisticUpdate={onOptimisticUpdate}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();

    // Passe de false -> true
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(baseCategory.id, true);
  });

  it("affiche le titre avec le nom de la catégorie", () => {
    render(
      <CategoryCard
        category={baseCategory}
        selected={false}
        onToggle={vi.fn()}
        updateCategory={vi.fn().mockResolvedValue({ success: true })}
        onOptimisticUpdate={vi.fn()}
      />
    );
    const title = screen.getByTestId("card-title");
    expect(title).toHaveTextContent("Actualités & Économie");
  });

  it("texte du compteur d’articles", () => {
    const updateCategory = vi.fn().mockResolvedValue({ success: true });

    const { rerender } = render(
      <CategoryCard
        category={{ id: 4, name: "Zero", articleCount: 0, color: "#FFFFFF"  }}
        selected={false}
        onToggle={vi.fn()}
        updateCategory={updateCategory}
        onOptimisticUpdate={vi.fn()}
      />
    );
    expect(screen.getByText("Aucun article associé")).toBeInTheDocument();

    rerender(
      <CategoryCard
        category={{ id: 5, name: "Un", articleCount: 1, color: "#FFFFFF"  }}
        selected={false}
        onToggle={vi.fn()}
        updateCategory={updateCategory}
        onOptimisticUpdate={vi.fn()}
      />
    );
    expect(screen.getByText("1 article associé")).toBeInTheDocument();

    rerender(
      <CategoryCard
        category={{ id: 6, name: "Plusieurs", articleCount: 3, color: "#FFFFFF"  }}
        selected={false}
        onToggle={vi.fn()}
        updateCategory={updateCategory}
        onOptimisticUpdate={vi.fn()}
      />
    );
    expect(screen.getByText("3 articles associés")).toBeInTheDocument();
  });

  it("rend EditCategoryDialog et relaye updateCategory + onOptimisticUpdate", async () => {
    const updateCategory = vi.fn().mockResolvedValue({ success: true });
    const onOptimisticUpdate = vi.fn();

    render(
      <CategoryCard
        category={{ id: 7, name: "Editable", color: "#112233" }}
        selected={false}
        onToggle={vi.fn()}
        updateCategory={updateCategory}
        onOptimisticUpdate={onOptimisticUpdate}
      />
    );

    expect(screen.getByTestId("edit-category-dialog")).toBeInTheDocument();

    // Clique sur le bouton du mock
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "open-edit" }));

    // Les callbacks ont bien été relayés avec les bons arguments
    expect(updateCategory).toHaveBeenCalledTimes(1);
    expect(updateCategory).toHaveBeenCalledWith(7, { name: "Editable", color: "#112233" });

    expect(onOptimisticUpdate).toHaveBeenCalledTimes(1);
    expect(onOptimisticUpdate).toHaveBeenCalledWith({ id: 7, name: "Editable", color: "#112233" });
  });
});

describe("CategoryCardSkeleton", () => {
  it("rend plusieurs skeletons et la structure de carte", () => {
    render(<CategoryCardSkeleton />);

    expect(screen.getByTestId("card")).toBeInTheDocument();

    // Le composant réel en affiche plusieurs; on vérifie qu’il y en a au moins 5
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThanOrEqual(5);
  });
});