import Image from "next/image";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0 w-10 h-10">
          <Image
            src="/download.jpeg"
            alt="Profile"
            width={40}  
            height={40}
            className="rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <Image
            src="/download.jpeg"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900 text-sm">John Doe</div>
            <div className="text-xs text-gray-500">johndoe@email.com</div>
            <div className="text-xs text-gray-400">Member since 2024</div>
          </div>
        </div>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
