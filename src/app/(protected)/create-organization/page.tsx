"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/lib/zod/organization/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to Organizationorganization");
      }

      const data = await response.json();
   
      toast.success("Organization created successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create organization");
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Organization
          </h1>
          <p className="text-muted-foreground">
            Set up a new organization to start collaborating.
          </p>
        </div>

        <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel>Organization Name</FieldLabel>
                <Input placeholder="Acme Corp" {...form.register("name")} />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>

              <Field>
                <FieldLabel>Organization Email</FieldLabel>
                <Input
                  placeholder="hello@acmecorp.com"
                  type="email"
                  {...form.register("email")}
                />
                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              <FieldSet>
                <legend className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Address
                </legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 mt-4">
                  <div className="sm:col-span-2">
                    <Field>
                      <FieldLabel>City</FieldLabel>
                      <Input
                        placeholder="San Francisco"
                        {...form.register("city")}
                      />
                      <FieldError errors={[form.formState.errors.city]} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field>
                      <FieldLabel>State</FieldLabel>
                      <Input placeholder="CA" {...form.register("state")} />
                      <FieldError errors={[form.formState.errors.state]} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field>
                      <FieldLabel>Zip Code</FieldLabel>
                      <Input
                        placeholder="94105"
                        {...form.register("zipCode")}
                      />
                      <FieldError errors={[form.formState.errors.zipCode]} />
                    </Field>
                  </div>
                </div>
              </FieldSet>
            </FieldGroup>

            <div className="flex justify-end pt-4">
              <Button type="submit">Create Organization</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
