import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUpdateOrganizationMutation } from "@/lib/queries/client/organization";
import { Organization } from "@/db/schema";

export function OrganizationNameForm({ org }: { org: Organization }) {
  const [name, setName] = useState(org.name || "");
  const updateMutation = useUpdateOrganizationMutation();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await updateMutation.mutateAsync({ id: org.id, name });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Organization Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Organization Name"
        />
      </div>
      <Button
        type="submit"
        disabled={
          updateMutation.isPending || name.trim() === "" || name === org.name
        }
      >
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
