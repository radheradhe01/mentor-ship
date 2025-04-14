import React from 'react';
import { JobOpportunity } from "@/data/jobs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Briefcase, CalendarDays } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface JobOpportunityCardProps {
  job: JobOpportunity;
}

export const JobOpportunityCard = ({ job }: JobOpportunityCardProps) => {
  const postedAgo = formatDistanceToNow(job.postedDate, { addSuffix: true });
  const deadlineFormatted = job.deadlineDate.toLocaleDateString();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
            <CardDescription className="text-sm">{job.company}</CardDescription>
          </div>
          <Badge variant="secondary">{job.employmentType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{job.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-muted-foreground pt-4 border-t">
         <div className="flex items-center mb-2 w-full justify-between">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1.5" />
              <span>Posted {postedAgo}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-3 w-3 mr-1.5" />
              <span>Apply by {deadlineFormatted}</span>
            </div>
         </div>
         <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => window.open(job.url, '_blank')}>View Details</Button>
      </CardFooter>
    </Card>
  );
}; 