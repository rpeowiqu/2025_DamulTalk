import Dialog, { type DialogProps } from "@/components/common/dialog";
import SearchBar from "@/components/common/search-bar";

const UserSearchModal = ({ open, onOpenChange, ...props }: DialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="유저 찾기"
      titleClassName="text-damul-main-300 border-b border-damul-main-500 pb-4"
      {...props}>
      <SearchBar onSearch={(keyword) => console.log(keyword)} />
    </Dialog>
  );
};

export default UserSearchModal;
