import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import ItemCard from "./ItemCard";

interface ItemDialogProps {
  trigger: React.ReactNode;
  item: any;
  type: "movie" | "tv";
}

export default function ItemDialog({ trigger, item, type }: ItemDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="
          bg-[#2b2b2b] text-white border border-gray-700 rounded-lg w-[70%] max-h-[85vh] overflow-y-auto p-4 mt-10px sm:max-w-3xl sm:p-6 md:max-w-4xl xl:translate-y-[-350px]
        "
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
            {item.title || item.name}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="hidden" />

        <ItemCard item={item} type={type} />
      </DialogContent>
    </Dialog>
  );
}
