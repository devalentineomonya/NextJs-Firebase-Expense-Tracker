import { Button } from "@/components/ui/button";
import { BellDot } from "lucide-react";

const NotificationsButton = () => (
  <Button
    className="dark:bg-gray-800 bg-white dark:text-white dark:hover:bg-gray-700 text-gray-600 hover:bg-gray-100"
    size="icon"
    variant="ghost"
  >
    <BellDot className="w-5 h-5" />
  </Button>
);

export default NotificationsButton;
