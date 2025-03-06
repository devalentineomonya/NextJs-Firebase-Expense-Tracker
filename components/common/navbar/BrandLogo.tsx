import Logo from "@/public/logo.png";
import Image from "next/image";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const BrandLogo = () => (
  <NavigationMenuItem>
    <NavigationMenuLink
      className="col-span-2 font-grotesk font-medium text-2xl flex items-center gap-x-2"
      href="/"
    >
      <Image src={Logo} alt="Logo" className="w-12 sm:w-8" />
      <span className="max-sm:hidden">DeExpenser</span>
    </NavigationMenuLink>
  </NavigationMenuItem>
);

export default BrandLogo;
