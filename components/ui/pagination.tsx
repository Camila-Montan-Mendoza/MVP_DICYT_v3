import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-0 flex w-full items-center justify-between", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationInfo = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
PaginationInfo.displayName = "PaginationInfo";

const PaginationControls = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex items-center gap-2", className)} {...props} />
);
PaginationControls.displayName = "PaginationControls";

interface PaginationPreviousProps extends React.ComponentProps<typeof Button> {}

const PaginationPrevious = React.forwardRef<HTMLButtonElement, PaginationPreviousProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      aria-label="Página anterior"
      className={cn(className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  )
);
PaginationPrevious.displayName = "PaginationPrevious";

interface PaginationNextProps extends React.ComponentProps<typeof Button> {}

const PaginationNext = React.forwardRef<HTMLButtonElement, PaginationNextProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      aria-label="Página siguiente"
      className={cn(className)}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  )
);
PaginationNext.displayName = "PaginationNext";

export { Pagination, PaginationInfo, PaginationControls, PaginationPrevious, PaginationNext };