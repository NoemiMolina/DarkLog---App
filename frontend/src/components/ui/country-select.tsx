import React, { useState } from "react";
import { countries } from "../../data/countries";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  placeholder = "Search for a country...",
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCountry = countries.find(
    (c) => c.name.toLowerCase() === value.toLowerCase()
  );

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          value={search || value}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full"
        />
        {selectedCountry && !search && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
            {selectedCountry.flag}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 border border-white/20 rounded-md bg-black/85 backdrop-blur-md overflow-hidden">
          <ScrollArea className="h-64">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-gray-400 text-sm">
                No countries found
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {filtered.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      onChange(country.name);
                      setSearch("");
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-white/10 transition text-sm text-white"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
