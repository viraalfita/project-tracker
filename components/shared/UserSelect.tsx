"use client";

import { User } from "@/lib/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

interface UserSelectProps {
  users: User[];
  value: User | null;
  onChange: (user: User | null) => void;
  placeholder?: string;
  disabled?: boolean;
  allowUnassigned?: boolean;
}

export function UserSelect({
  users,
  value,
  onChange,
  placeholder = "Select user...",
  disabled = false,
  allowUnassigned = true,
}: UserSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          disabled={disabled}
          className="flex items-center justify-between w-full px-3 py-2 text-sm border border-border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {value ? (
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                style={{ backgroundColor: value.avatarColor }}
              >
                {value.initials}
              </div>
              <span className="truncate">{value.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="flex-shrink-0 w-4 h-4 text-muted-foreground ml-2" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="min-w-[240px] bg-white rounded-md shadow-lg border border-border z-50 p-1"
        >
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Unassigned option */}
          {allowUnassigned && (
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 rounded outline-none"
              onSelect={() => {
                onChange(null);
                setOpen(false);
                setSearch("");
              }}
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-xs text-slate-500">—</span>
              </div>
              <span className="text-muted-foreground">Unassigned</span>
              {value === null && (
                <Check className="w-4 h-4 ml-auto text-indigo-600" />
              )}
            </DropdownMenu.Item>
          )}

          {/* User options */}
          <div className="max-h-[200px] overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <DropdownMenu.Item
                  key={user.id}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 rounded outline-none"
                  onSelect={() => {
                    onChange(user);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{user.name}</p>
                  </div>
                  {value?.id === user.id && (
                    <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  )}
                </DropdownMenu.Item>
              ))
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
