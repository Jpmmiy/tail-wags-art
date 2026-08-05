import React from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (placeId: string, lat: number, lng: number) => void;
  className?: string;
}

export function CityAutocomplete({ value, onChange, onSelect, className }: Props) {
  const [open, setOpen] = React.useState(false);
  
  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue: setInputValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"],
    },
    debounce: 300,
  });

  const handleSelect = async (description: string) => {
    setInputValue(description, false);
    onChange(description);
    clearSuggestions();
    setOpen(false);

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      if (onSelect) onSelect(results[0].place_id, lat, lng);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50 text-left",
            className
          )}
        >
          {value || inputValue || "Digite a cidade..."}
          <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-ink border-white/10" align="start">
        <Command className="bg-transparent">
          <CommandInput 
            placeholder="Buscar cidade..." 
            value={inputValue}
            onValueChange={setInputValue}
            disabled={!ready}
            className="text-bone"
          />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-stone">
              {status === "OK" ? "Nenhuma cidade encontrada." : "Buscando..."}
            </CommandEmpty>
            <CommandGroup>
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <CommandItem
                    key={place_id}
                    value={description}
                    onSelect={() => handleSelect(description)}
                    className="text-bone hover:bg-white/5 cursor-pointer flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4 opacity-50" />
                    {description}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === description ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
