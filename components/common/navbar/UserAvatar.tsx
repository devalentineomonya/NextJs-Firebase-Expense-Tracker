import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "firebase/auth";
const UserAvatar = ({
  user,
  loading,
}: {
  user: User | null | undefined;
  loading: boolean;
}) => {
  if (loading) return <Skeleton className="h-9 w-9 rounded-md" />;

  return (
    <Avatar className="w-9 h-9 cursor-pointer rounded-md">
      <AvatarImage
        className="rounded-md"
        src={user?.photoURL || "/profile.jpg"}
      />
      <AvatarFallback className="rounded-md">
        {user?.displayName?.charAt(0).toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
