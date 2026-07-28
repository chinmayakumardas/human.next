import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  onMobileMenuOpen: () => void;
};

export function Header({
  sidebarCollapsed,
  onSidebarToggle,
  onMobileMenuOpen,
}: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation"
        >
          <Menu />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={onSidebarToggle}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
        <div>
          <p className="text-sm font-medium">Your personal workspace</p>
          <p className="hidden text-xs text-muted-foreground sm:block">Make today count.</p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
