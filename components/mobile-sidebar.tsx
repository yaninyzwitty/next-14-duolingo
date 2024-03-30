import {Sheet, SheetContent, SheetTrigger} from "./ui/sheet";
import {Sidebar} from "./sidebar";
import {Menu} from "lucide-react";
type Props = {};

export function MobileSidebar({}: Props) {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      {/* @ts-ignore */}
      <SheetContent className="p-0 z-[100] " side={"left"}>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
