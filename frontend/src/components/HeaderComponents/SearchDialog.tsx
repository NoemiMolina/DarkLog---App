import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch?: () => void;
  results: any[];
  onSelect: (item: any) => void;
  type: 'movie' | 'tv';
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  results,
  onSelect,
  type
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch?.()}
            placeholder={`Search for a ${type}...`}
            className="flex-1"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((item) => (
            <div key={item.id} className="cursor-pointer hover:scale-105 transition" onClick={() => onSelect(item)}>
              <img
                src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.png'}
                alt={type === 'movie' ? item.title : item.name}
                className="w-full object-cover rounded-lg"
              />
              <p className="text-sm mt-2 text-center">{type === 'movie' ? item.title : item.name}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;