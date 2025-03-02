import { NavigationMenuList } from "@/components/ui/navigation-menu";
import { User } from "firebase/auth";
import LanguagePicker from "./LanguagePicker";
import ThemeToggler from "./ThemeToggler";
import NotificationsButton from "./NotificationsButton";
import GitHubLink from "./GitHubLink";
import UserProfilePopover from "./UserProfilePopover";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";

const NavbarActions = ({
  user,
  loading,
}: {
  user: User | null | undefined;
  loading: boolean;
}) => (
  <NavigationMenuItem className="col-span-2">
    <NavigationMenuList className="gap-x-1">
      <LanguagePicker />
      <ThemeToggler />
      <NotificationsButton />
      <UserProfilePopover user={user} loading={loading} />
      <GitHubLink />
    </NavigationMenuList>
  </NavigationMenuItem>
);

export default NavbarActions;
