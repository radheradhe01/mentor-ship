import React from 'react';
import { jobOpportunities } from "@/data/jobs";
import { JobOpportunityCard } from "./JobOpportunityCard";

export const JobOpportunityList = () => {
  // TODO: Add filtering/sorting/pagination later
  const recentJobs = [...jobOpportunities].sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Recent Job Opportunities</h2>
      {recentJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentJobs.map((job) => (
            <JobOpportunityCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No job opportunities found</h3>
          <p className="text-muted-foreground">
            Check back later for new openings.
          </p>
        </div>
      )}
    </div>
  );
}; 