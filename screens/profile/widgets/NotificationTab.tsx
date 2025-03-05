import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import Notification from "../components/Notification";

const NotificationTab = () => {
  return (
    <TabsContent value="notifications" className="px-0 lg:px-3">
      <div className="flex justify-center items-center shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] ">
        <Notification />
      </div>
    </TabsContent>
  );
};

export default NotificationTab;
