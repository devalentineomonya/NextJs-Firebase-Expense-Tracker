import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const GitHubLink = () => (
  <Link
    href="https://github.com/devalentineomonya"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button
      size="icon"
      variant="secondary"
      className="bg-gray-800 dark:bg-white text-white hover:bg-gray-500 dark:text-gray-600 dark:hover:bg-gray-100"
    >
      <GitHubLogoIcon className="w-5 h-5" />
    </Button>
  </Link>
);

export default GitHubLink;
