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

export default function ItemDialog({ trigger, item, type, onClose }: ItemDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="
          bg-[#2b2b2b] text-white border border-gray-700 rounded-lg w-[70%] max-h-[85vh] overflow-y-auto p-4 mt-10px sm:max-w-3xl sm:p-6 md:max-w-4xl xl:translate-y-[-400px] xl:h-[850px]"
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
