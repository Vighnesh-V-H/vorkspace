"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;

  options?: ComboboxOption[];
  isLoading?: boolean;

  placeholder?: string;
  emptyMessage?: string;

  minChars?: number;

  disabled?: boolean;
  className?: string;

  allowFreeInput?: boolean;
}

export function Combobox({
  value,
  onChange,
  options = [],
  isLoading = false,
  placeholder = "Type to search…",
  emptyMessage = "No results found.",
  minChars = 2,
  disabled = false,
  className,
}: ComboboxProps) {
  const showList = value.trim().length >= minChars;
  const showEmpty = showList && !isLoading && options.length === 0;
  const showOptions = showList && !isLoading && options.length > 0;

  function handleSelect(selectedValue: string) {
    onChange(selectedValue);
  }

  return (
    <Command
      shouldFilter={false}
      className={cn("overflow-visible rounded-md border", className)}
    >
      <CommandInput
        placeholder={placeholder}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        autoFocus
        className="h-9"
      />

      {showList && (
        <CommandList className="max-h-56 border-t">
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching…
            </div>
          )}

          {showEmpty && <CommandEmpty>{emptyMessage}</CommandEmpty>}

          {showOptions && (
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-start gap-2"
                >
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
}
