import { TabsContent } from "@/components/ui/tabs";
import ProfileImage from "./ProfileImage";
const ProfileTab = () => {
  return (
    <TabsContent value="account">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileImage />
            <ProfileImage />
        </div>
    </TabsContent>
  );
};

export default ProfileTab;
