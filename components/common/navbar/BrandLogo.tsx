import Logo from "@/public/logo.png";
import Image from "next/image";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";

const BrandLogo = () => (
  <NavigationMenuItem className="col-span-2 font-grotesk font-medium text-2xl flex items-center gap-x-2">
    <Image src={Logo} alt="Logo" className="w-12 sm:w-8" />
    <span className="max-sm:hidden">DeExpenser</span>
  </NavigationMenuItem>
);

export default BrandLogo;
