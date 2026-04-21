import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrganizationsBySession } from "@/lib/queries/organization";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const userOrganization = await getOrganizationsBySession(session.session);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your Organizations
          </h1>
          <p className="text-muted-foreground mt-1">
            Select an organization to manage or create a new one.
          </p>
        </div>
        <Link
          href="/create-organization"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Create Organization
        </Link>
      </div>

      {userOrganization.length === 0 ? (
        <div className="p-8 border rounded-xl bg-card text-center shadow-sm">
          <h3 className="text-lg font-medium mb-2">No organizations found</h3>
          <p className="text-muted-foreground mb-4">
            You are not a member of any organizations yet. Get started by
            creating one.
          </p>
          <Link
            href="/create-organization"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Create Organization
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userOrganization.map(({ organization }) => (
            <Link
              key={organization.id}
              href={`/organization/${organization.id}`}
              className="block p-6 border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-primary/50"
            >
              <h2 className="text-xl font-semibold mb-2">
                {organization.name}
              </h2>
              {organization.email && (
                <p className="text-sm text-muted-foreground mb-4">
                  {organization.email}
                </p>
              )}
              <div className="flex items-center text-sm font-medium text-primary">
                View Details
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
