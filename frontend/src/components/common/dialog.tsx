import type { DialogProps as ShadcnDialogProps } from "@radix-ui/react-dialog";

import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface DialogProps extends ShadcnDialogProps {
  title?: string;
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
}

const Dialog = ({
  open,
  title,
  titleClassName,
  description,
  descriptionClassName,
  onOpenChange,
  children,
}: DialogProps) => {
  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:text-white">
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          <DialogDescription className={descriptionClassName}>
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </ShadcnDialog>
  );
};

export default Dialog;
