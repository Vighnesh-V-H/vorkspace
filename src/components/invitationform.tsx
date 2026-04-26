"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Combobox, ComboboxOption } from "./combo";
import { inviteMemberSchema } from "@/lib/zod/organization/invititation";
import { SearchUser } from "@/lib/types/user/user";

type FormValues = z.infer<typeof inviteMemberSchema>;

export function InviteMemberDialog({
  open,
  onOpenChange,
  organizationId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}) {
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", role: "member" },
  });

  const email = watch("email");
  const [debounced] = useDebounce(email.trim(), 300);

  const { data = [], isFetching } = useQuery<SearchUser[]>({
    queryKey: ["invite-users", debounced],
    queryFn: async ({ signal }) => {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(debounced)}`,
        { signal },
      );
      if (!res.ok) throw new Error("Failed to search users");
      return res.json();
    },
    enabled: debounced.length >= 2,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const emailOptions: ComboboxOption[] = data.map((user) => ({
    value: user.email,
    label: user.email,
    description: user.name ?? undefined,
  }));

  async function submit(values: FormValues) {
    try {
      const res = await fetch(`/api/organization/${organizationId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to send invite");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Send an invitation to a new organization member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Combobox
                    value={field.value}
                    onChange={field.onChange}
                    options={emailOptions}
                    isLoading={isFetching}
                    placeholder="user@example.com"
                    emptyMessage="No existing users found."
                    minChars={2}
                    allowFreeInput // user can type any email, not just suggestions
                  />
                )}
              />

              <FieldDescription>
                Search existing users or enter any email.
              </FieldDescription>

              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Role</FieldLabel>

              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.role && <FieldError>{errors.role.message}</FieldError>}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
