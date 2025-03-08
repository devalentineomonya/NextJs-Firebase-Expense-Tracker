import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Send } from "lucide-react";
const ExportButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Send className="w-4 h-4" />
        Export AS
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>PDF</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>CSV</DropdownMenuItem>
        <DropdownMenuItem>Excel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
