"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import Loader from "@/components/ui/loader";
import {
  useOrganizationByIdQuery,
  useOrganizationMembersQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} from "@/lib/queries/client/organization";
import { OrganizationNameForm } from "@/components/oragnization-name-from";
import { OrganizationMember } from "@/db/schema";

export default function OrganizationSettingsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: org, isLoading, error } = useOrganizationByIdQuery(id);
  const { data: members, isLoading: isMembersLoading } =
    useOrganizationMembersQuery(id);

  const deleteMutation = useDeleteOrganizationMutation();

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this organization? This action cannot be undone.",
      )
    )
      return;
    try {
      await deleteMutation.mutateAsync(id);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="container mx-auto py-10 px-4 text-center text-red-500">
        Error loading organization settings.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Organization Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your organization details, members, and danger zones.
        </p>
      </div>

      <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">General</h2>
        <OrganizationNameForm org={org} />
      </div>

      <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Members</h2>
        {isMembersLoading ? (
          <div className="flex py-4">
            <Loader />
          </div>
        ) : members && members.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((member: any) => (
                  <tr key={member.id} className="bg-card">
                    <td className="px-4 py-3 font-medium">
                      {member.name || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {member.email}
                    </td>
                    <td className="px-4 py-3 capitalize">{member.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground">No members found.</p>
        )}
      </div>

      <div className="p-6 border border-red-200 rounded-xl bg-red-50/10 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
        <p className="text-sm text-muted-foreground max-w-xl">
          Permanently delete this organization and all of its data. This action
          is irreversible.
        </p>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete Organization"}
        </Button>
      </div>
    </div>
  );
}
