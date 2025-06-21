import { Link } from "react-router-dom";

import SettingIcon from "@/components/icon/setting-icon";

const SettingButton = () => {
  return (
    <Link to={"/setting"} className="cursor-pointer">
      <SettingIcon className="size-6 text-neutral-500" />
    </Link>
  );
};

export default SettingButton;
