import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface UseModalOptions {
  modalKey: string;
  onOpen?: () => void;
  onClose?: () => void;
}

const useModal = ({ modalKey, onOpen, onClose }: UseModalOptions) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const modals = searchParams.getAll("modal");
    setIsOpen(modals.includes(modalKey));
  }, [searchParams]);

  useEffect(() => {
    if (isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpen]);

  const openModal = () => {
    const modals = searchParams.getAll("modal");
    if (!modals.includes(modalKey)) {
      const newParams = new URLSearchParams(searchParams);
      newParams.append("modal", modalKey);
      setSearchParams(newParams);
    }
  };

  const closeModal = () => {
    const modals = searchParams.getAll("modal");
    if (!modals.includes(modalKey)) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("modal");

    const remaining = modals.filter((item) => item !== modalKey);
    if (remaining.length > 0) {
      remaining.forEach((item) => newParams.append("modal", item));
    }

    setSearchParams(newParams);
  };

  return { isOpen, openModal, closeModal };
};

export default useModal;
