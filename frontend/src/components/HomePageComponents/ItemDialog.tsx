import { useNavigate } from "react-router-dom";

interface ItemDialogProps {
  trigger: React.ReactNode;
  item: any;
  type: "movie" | "tvshow";
}

export default function ItemDialog({ trigger, item, type }: ItemDialogProps) {
  const navigate = useNavigate();
  const itemId = item.tmdb_id || item.id;

  const handleClick = () => {
    navigate(`/item/${itemId}/${type}`);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {trigger}
    </div>
  );
}
