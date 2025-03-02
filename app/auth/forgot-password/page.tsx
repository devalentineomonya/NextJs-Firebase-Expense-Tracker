import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InputField } from "@/screens/auth/components/InputField";
import { Logo } from "@/screens/auth/components/Logo";
const FormSection = () => (
  <form className="mt-6">
    <InputField label="Email" id="email" type="email" />

    <Button   className="w-full bg-primary dark:bg-slate-950 dark:hover:bg-slate-900 text-white rounded-md py-2 hover:bg-primary-dark">
      Forgot Password
    </Button>
  </form>
);

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-[#5d87ff20] dark:bg-darkprimary flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#202936] shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px]   rounded-md p-6">
        <Logo />
        <p className="text-darklink text-sm text-center my-4">
          Please enter the email address associated with your account and We
          will email you a link to reset your password.
        </p>
        <FormSection />
        <Link
          type="button"
          className="group relative flex items-stretch justify-center p-0.5 text-center font-medium hover:bg-[#5d88ff46] bg-[#5d87ff20]
           text-primary  dark:hover:bg-primary  rounded-md w-full mt-3"
          href="/auth/login"
        >
          <span className="flex items-center gap-2 transition-all duration-150 justify-center rounded-md px-4 py-2 text-sm">
            Back to Login
          </span>
        </Link>
      </div>
    </div>
  );
}
