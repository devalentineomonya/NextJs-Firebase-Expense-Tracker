import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  useSignInWithGoogle,
  useSignInWithGithub,
} from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";

const SocialButton = ({
  provider,
  iconSrc,
  loading,
  onClick,
}: {
  provider: string;
  iconSrc: string;
  loading: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      disabled={loading}
      variant="outline"
      className="w-full flex gap-2 items-center py-6 px-4 border border-ld"
      onClick={onClick}
    >
      {loading ? (
        <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <Image alt={provider} width={18} height={18} src={iconSrc} priority />
      )}
      {provider}
    </Button>
  );
};

export const SocialLoginSection = () => {
  const [signInWithGoogle, , googleLoading] = useSignInWithGoogle(auth);
  const [signInWithGitHub, , githubLoading] = useSignInWithGithub(auth);

  return (
    <div className="flex gap-4 my-6">
      <SocialButton
        provider="Google"
        iconSrc="/google.svg"
        loading={googleLoading}
        onClick={() => signInWithGoogle()}
      />
      <SocialButton
        provider="GitHub"
        iconSrc="/github.svg"
        loading={githubLoading}
        onClick={() => signInWithGitHub()}
      />
    </div>
  );
};
