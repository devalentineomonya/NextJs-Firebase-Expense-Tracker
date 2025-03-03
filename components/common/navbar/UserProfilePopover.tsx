"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import UserAvatar from "./UserAvatar";
import { User } from "firebase/auth";
import ProfileContent from "./ProfileContent";
import { useState } from "react";

const UserProfilePopover = ({
  user,
  loading,
}: {
  user: User | null | undefined;
  loading: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <UserAvatar user={user} loading={loading} />
    </PopoverTrigger>
    <PopoverContent align="end" className="w-96 bg-white dark:bg-gray-800 p-0">
      <ProfileContent setIsOpen={setIsOpen} user={user} loading={loading} />
      </PopoverContent>
    </Popover>
  );
};

export default UserProfilePopover;
