import Link from "next/link";

import Image from "next/image";

export const Logo = () => (
  <div className="mx-auto mb-6">
    <Link href="/" className="flex items-center justify-center">
      <Image
        alt="logo"
        width={130}
        height={26}
        src="/logo.png"
        priority
        className="block dark:hidden rtl:scale-x-[-1]"
      />
      <Image
        alt="logo"
        width={130}
        height={26}
        src="/logo.png"
        priority
        className="hidden dark:block rtl:scale-x-[-1]"
      />
    </Link>
  </div>
);
