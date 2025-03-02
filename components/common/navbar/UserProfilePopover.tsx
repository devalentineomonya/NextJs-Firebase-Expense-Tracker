import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import UserAvatar from "./UserAvatar";
import { User } from "firebase/auth";
import ProfileContent from "./ProfileContent";

const UserProfilePopover = ({
  user,
  loading,
}: {
  user: User | null | undefined;
  loading: boolean;
}) => (
  <Popover>
    <PopoverTrigger>
      <UserAvatar user={user} loading={loading} />
    </PopoverTrigger>
    <PopoverContent align="end" className="w-96 bg-white dark:bg-gray-800 p-0">
      <ProfileContent user={user} loading={loading} />
    </PopoverContent>
  </Popover>
);

export default UserProfilePopover;
