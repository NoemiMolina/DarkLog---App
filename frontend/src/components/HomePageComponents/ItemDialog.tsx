import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ItemCard from "./ItemCard";

interface ItemDialogProps {
  trigger: React.ReactNode;
  item: any;
  type: "movie" | "tvshow";
  onClose?: () => void;
}

export default function ItemDialog({ trigger, item, type }: ItemDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="
          bg-black/40 backdrop-blur-md text-white border border-gray-700 rounded-lg w-screen h-screen sm:w-[70%] sm:h-auto sm:max-h-[85vh] sm:rounded-lg overflow-y-auto p-4 mt-10px sm:mt-0 sm:p-6 md:max-w-4xl 2xl:translate-y-[-400px] 2xl:h-[850px]"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
            {item.title || item.name}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="hidden" />

        <ItemCard item={item} type={type} onClose={() => setOpen(false)}  />
      </DialogContent>
    </Dialog>
  );
}
