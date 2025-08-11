import type { Dispatch, SetStateAction } from "react";

interface SideBarOverlayProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SideBarOverlay = ({ setIsOpen }: SideBarOverlayProps) => {
  return (
    <div
      className="fixed inset-0 z-20 bg-black/60 xl:hidden"
      onClick={() => setIsOpen(false)}
    />
  );
};

export default SideBarOverlay;
