import { useEffect, useState } from "react";

interface UseModalOptions {
  modalKey: string;
  onOpen?: () => void;
  onClose?: () => void;
}

const useModal = ({ modalKey, onOpen, onClose }: UseModalOptions) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handlePopstate = () => {
      setIsOpen(false);
    };

    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      history.pushState({ modalKey }, "", window.location.pathname);
      onOpen?.();
    } else if (history.state.modalKey === modalKey) {
      history.back();
      onClose?.();
    }
  }, [isOpen]);

  return { isOpen, setIsOpen };
};

export default useModal;
