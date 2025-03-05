import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const InputField = ({
  label,
  id,
  type,
  ...props
}: {
  label: string;
  id: string;
  type: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="mb-4">
    <Label
      htmlFor={id}
      className="text-sm font-semibold text-gray-900 dark:text-white"
    >
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      required
      className="w-full h-10 border border-gray-300 bg-gray-50 text-gray-900 p-2.5 text-sm rounded-md
                 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
      {...props}
    />
  </div>
);
