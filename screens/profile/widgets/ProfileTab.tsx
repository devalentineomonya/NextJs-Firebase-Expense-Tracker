import { TabsContent } from "@/components/ui/tabs";
import ProfileImage from "../components/ProfileImage";
import ChangePassword from "../components/ChangePassword";
import PersonalDetails from "../components/PersonalDetails";

const ProfileTab = () => {
  return (
    <TabsContent value="account" className="flex flex-col gap-4" >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 ">
            <ProfileImage />
            <ChangePassword />
        </div>
        <PersonalDetails />
    </TabsContent>
  );
};

export default ProfileTab;
