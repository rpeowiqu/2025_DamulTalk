import UserSearchIcon from "@/components/icon/user-search-icon";
import UserSearchModal from "@/components/user/user-search-modal";
import useModal from "@/hooks/common/use-modal";

const UserSearchButton = () => {
  const { isOpen, openModal, closeModal } = useModal({
    modalKey: "user-search",
  });

  const handleClick = () => {
    openModal();
  };

  return (
    <>
      <button type="button" className="cursor-pointer" onClick={handleClick}>
        <UserSearchIcon />
      </button>

      <UserSearchModal
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (open) {
            openModal();
          } else {
            closeModal();
          }
        }}
      />
    </>
  );
};

export default UserSearchButton;
