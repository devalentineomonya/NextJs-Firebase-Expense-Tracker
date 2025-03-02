import { User } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Mail } from "lucide-react";

const ProfileDetails = ({
  user,
  loading,
}: {
  user: User | null | undefined;
  loading: boolean;
}) => (
  <div className="flex items-center gap-3 pb-5 border-b dark:border-darkborder mt-5 mb-3">
    {loading ? (
      <>
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </>
    ) : user ? (
      <>
        <Avatar className="w-14 h-14">
          <AvatarImage src={user.photoURL || "/profile.jpg"} />
          <AvatarFallback>
            {user.displayName?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h5 className="card-title text-sm mb-0.5 font-medium">
            {user.displayName || "Anonymous User"}
          </h5>
          <span className="font-normal flex items-center gap-x-1">
            <BadgeCheck className="w-4 h-4" />
            {user.emailVerified ? "Verified" : "Unverified"}
          </span>
          <p className="font-normal mb-0 mt-1 flex items-center">
            <Mail className="mr-1 w-4 h-4" />
            {user.email}
          </p>
        </div>
      </>
    ) : null}
  </div>
);

export default ProfileDetails;
