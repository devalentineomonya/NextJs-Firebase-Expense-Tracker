"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleUser, BellRing } from "lucide-react";
import ProfileTab from "../widgets/ProfileTab";
import NotificationTab from "../widgets/NotificationTab";
import ProfileBanner from "./ProfileBanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import useProfileComplete from "@/lib/zustand/use-profile-complete";

const TAB_OVERRIDE_CLASS =
  "flex items-center gap-2 pb-2 text-sm rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600";

const ProfileTabs = () => {
  const { isProfileComplete } = useProfileComplete();
  return (
    <section className="relative">
      {isProfileComplete ? (
        <Alert variant="destructive" className="mb-3">
          <TriangleAlert className="h-6 w-6 mr-2" />
          <AlertTitle>Complete your profile</AlertTitle>
          <AlertDescription>
            Please complete your profile to continue.
          </AlertDescription>
     </Alert>
      ) : null}
      <div>
        <ProfileBanner />
        <Tabs defaultValue="account" className="w-full">
          <div className="bg-[#5d87ff20] w-full py-2 mt-3 rounded-b-md">
            <div className="flex items-center justify-end px-4">
              <TabsList className="ring-0 ring-offset-0 shadow-none border-none bg-transparent">
                <TabsTrigger value="account" className={TAB_OVERRIDE_CLASS}>
                  <CircleUser className="w-6 h-6 sm:w-4 sm:h-4" />
                  <span className="hidden sm:block">Account</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className={TAB_OVERRIDE_CLASS}
                >
                  <BellRing className="w-6 h-6 sm:w-4 sm:h-4" />
                  <span className="hidden sm:block">Notifications</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          <div className="lg:px-0 px-3">
            <ProfileTab />
            <NotificationTab />
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default ProfileTabs;
