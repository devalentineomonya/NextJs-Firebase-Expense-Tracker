import Link from "next/link";
import { UserRound } from "lucide-react";

const ProfileLink = () => (
  <Link
    href="/profile"
    className="cursor-pointer text-sm text-ld hover:text-primary focus:bg-hover focus:outline-none  py-2 flex justify-between items-center bg-hover group/link w-full"
  >
    <div className="flex items-center w-full">
      <div className="h-11 w-11 flex-shrink-0 rounded-md flex justify-center items-center bg-[#5d87ff20]">
        <UserRound className="w-5 h-5" />
      </div>
      <div className="ps-4 flex justify-between w-full">
        <div className="w-3/4">
          <h5 className="mb-1 text-sm group-hover/link:text-primary">
            My Profile
          </h5>
          <div className="text-xs text-darklink">Account settings</div>
        </div>
      </div>
    </div>
  </Link>
);

export default ProfileLink;
