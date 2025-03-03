import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProfileDetails from "./ProfileDetails";
import ProfileLink from "./ProfileLink";
import UpgradeCard from "./UpgradeCard";
import SignOutButton from "./SignOutButton";
import { User } from "firebase/auth";

const ProfileContent = ({
  user,
  loading,
  setIsOpen,
}: {
  user: User | null | undefined;
  loading: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => (
  <Card className="shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
    <CardHeader className="pt-4 px-4 pb-0 m-0">
      <h3 className="text-lg font-semibold text-ld">User Profile</h3>
    </CardHeader>
    <CardContent className="flex-col">
      <ProfileDetails user={user} loading={loading} />
      <ProfileLink />
      <UpgradeCard />
      <SignOutButton setIsOpen={setIsOpen} />
    </CardContent>
  </Card>
);

export default ProfileContent;
