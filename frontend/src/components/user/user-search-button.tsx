import { useState } from "react";

import UserSearchIcon from "@/components/icon/user-search-icon";
import UserSearchModal from "@/components/user/user-search-modal";
import useModal from "@/hooks/common/use-modal";

const UserSearchButton = () => {
  const [keyword, setKeyword] = useState("");
  const { isOpen, openModal, closeModal } = useModal({
    modalKey: "user-search",
    onOpen: () => setKeyword(""),
  });

  const handleClick = () => {
    openModal();
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openModal();
    } else {
      closeModal();
    }
  };

  return (
    <>
      <button type="button" className="cursor-pointer" onClick={handleClick}>
        <UserSearchIcon />
      </button>

      <UserSearchModal
        open={isOpen}
        onOpenChange={handleOpenChange}
        keyword={keyword}
        setKeyword={setKeyword}
      />
    </>
  );
};

export default UserSearchButton;
