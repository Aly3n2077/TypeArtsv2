import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  children: React.ReactNode;
}

interface PaginationItemProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface PaginationButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const PaginationPrevButton = ({
  onClick,
  disabled,
  children,
}: PaginationButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="gap-1 h-9 w-9 rounded-md"
      onClick={onClick}
      disabled={disabled}
    >
      {children || <ChevronLeft className="h-4 w-4" />}
    </Button>
  );
};

const PaginationNextButton = ({
  onClick,
  disabled,
  children,
}: PaginationButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 rounded-md"
      onClick={onClick}
      disabled={disabled}
    >
      {children || <ChevronRight className="h-4 w-4" />}
    </Button>
  );
};

const PaginationItem = ({ children, isActive, onClick }: PaginationItemProps) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      className={cn(
        "h-9 w-9 rounded-md",
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const PaginationList = ({ children }: PaginationProps) => {
  return <div className="flex items-center gap-1">{children}</div>;
};

const Pagination = ({ children }: PaginationProps) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

Pagination.Item = PaginationItem;
Pagination.List = PaginationList;
Pagination.PrevButton = PaginationPrevButton;
Pagination.NextButton = PaginationNextButton;

export { Pagination };
