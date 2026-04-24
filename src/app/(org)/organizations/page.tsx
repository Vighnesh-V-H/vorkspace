"use client";

import Link from "next/link";
import { useOrganizationsQuery } from "@/lib/queries/client/organization";
import Loader from "@/components/ui/loader";

export default function Organizations() {
  const {
    data: organizations = [],
    isLoading,
    error,
  } = useOrganizationsQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-5xl">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-destructive">Error: {error.message}</p>
        </div>
      </div>
    );
  }

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

      {organizations.length === 0 ? (
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
          {organizations.map((org) => (
            <Link
              key={org.id}
              href={`/organization/${org.id}`}
              className="block p-6 border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-primary/50"
            >
              <h2 className="text-xl font-semibold mb-2">{org.name}</h2>
              {org.email && (
                <p className="text-sm text-muted-foreground mb-4">
                  {org.email}
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
