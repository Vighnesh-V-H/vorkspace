"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Combobox, type ComboboxOption } from "@/components/combo";
import { createTicketSchema, type CreateTicketFormValues } from "@/lib/zod/ticket";
import {
  useOrgMemberSearch,
  useCreateTicket,
  type OrgMember,
} from "@/lib/queries/client/ticket";

type FormValues = Omit<CreateTicketFormValues, "organizationId">;

function CreateTicketForm({
  orgId,
  onOpenChange,
}: {
  orgId: string;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createTicketSchema.omit({ organizationId: true })),
    defaultValues: {
      title: "",
      description: "",
      tag: "bug",
      assignedTo: "",
    },
  });

  const [memberQuery, setMemberQuery] = React.useState("");
  const [debouncedQuery] = useDebounce(memberQuery.trim(), 300);
  const [selectedMember, setSelectedMember] = React.useState<OrgMember | null>(null);

  const { data: members = [], isFetching } = useOrgMemberSearch(orgId, debouncedQuery);

  const memberOptions: ComboboxOption[] = members.map((m) => ({
    value: m.id,
    label: m.name,
    description: m.email,
  }));

  function handleMemberSelect(value: string) {
    setMemberQuery(value);
    const member = members.find((m) => m.id === value);
    if (member) {
      setSelectedMember(member);
      setValue("assignedTo", member.id, { shouldValidate: true });
      setMemberQuery(member.name);
    }
  }

  function handleMemberInputChange(value: string) {
    setMemberQuery(value);
    if (selectedMember && value !== selectedMember.name) {
      setSelectedMember(null);
      setValue("assignedTo", "", { shouldValidate: false });
    }
  }

  const createTicket = useCreateTicket(orgId);

  async function submit(values: FormValues) {
    try {
      await createTicket.mutateAsync(values);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" placeholder="e.g. Fix login page crash" {...register("title")} />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" placeholder="Describe the ticket…" rows={3} {...register("description")} />
          <FieldDescription>Optional details about the ticket.</FieldDescription>
          {errors.description && <FieldError>{errors.description.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Tag</FieldLabel>
          <Controller
            control={control}
            name="tag"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">🐛 Bug</SelectItem>
                  <SelectItem value="feature">✨ Feature</SelectItem>
                  <SelectItem value="improvement">💡 Improvement</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.tag && <FieldError>{errors.tag.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="assignedTo">Assign To</FieldLabel>
          <Combobox
            value={memberQuery}
            onChange={(val) => {
              const member = members.find((m) => m.id === val);
              if (member) {
                handleMemberSelect(val);
              } else {
                handleMemberInputChange(val);
              }
            }}
            options={memberOptions}
            isLoading={isFetching}
            placeholder="Search organization members…"
            emptyMessage="No members found."
            minChars={2}
          />
          {selectedMember && (
            <FieldDescription>
              Assigning to{" "}
              <span className="font-medium text-foreground">{selectedMember.name}</span>{" "}
              ({selectedMember.email})
            </FieldDescription>
          )}
          {errors.assignedTo && <FieldError>{errors.assignedTo.message}</FieldError>}
        </Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting || createTicket.isPending}>
          {isSubmitting || createTicket.isPending ? "Creating…" : "Create Ticket"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CreateTicketDialog({
  open,
  onOpenChange,
  orgId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Ticket</DialogTitle>
          <DialogDescription>
            Assign a new ticket to an organization member.
          </DialogDescription>
        </DialogHeader>
        <CreateTicketForm key={String(open)} orgId={orgId} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}