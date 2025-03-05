import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";

const ProfileBanner = () => {
  const [user, loading] = useAuthState(auth);
  return (
    <div className="shadow-[rgba(145,158,171,0.3)_0px_0px_2px_0px,rgba(145,158,171,0.02)_0px_12px_24px_-4px] pb-3">
      {/* Banner */}
      <div className="w-full flex items-center justify-between bg-green-400 rounded-t-md relative h-80">
        <Image
          priority
          fill
          src="/profileBanner.png"
          alt="profile-banner"
          className="object-cover absolute rounded-t-md"
        />
        {/* Centered Avatar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 w-[110px] h-[110px] bg-gradient-to-b from-[#50b2fc] to-[#f44c66] rounded-full flex justify-center items-center p-2">
          {loading ? (
            <div className="w-[102px] h-[102px] bg-gray-200 dark:bg-gray-800 rounded-full flex justify-center items-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : user ? (
            <Avatar className="w-[102px] h-[102px] shrink-0 overflow-hidden rounded-full">
              <AvatarImage src={user?.photoURL || "/profile.jpg"} />
              <AvatarFallback>
                {user?.displayName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="w-[102px] h-[102px]">
              <AvatarImage src="/profile.jpg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center justify-center relative z-40 mt-16 text-center">
        {loading ? (
          <>
            <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />
            <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">
              {user?.displayName || "User"}
            </h1>
            <p className="text-sm text-gray-500">
              {user?.email || "No email provided"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileBanner;
