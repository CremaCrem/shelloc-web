import React from 'react';
import { Layers, Droplet, Clock, CheckCircle2, History } from 'lucide-react';
import { Typography } from '../components/core/Typography';
import { Card } from '../components/core/Card';
import { Badge } from '../components/core/Badge';
import { useTreatments } from '../hooks/useTreatments';

export function Treatments() {
  const { data: treatments, isLoading, isError } = useTreatments();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col h-full overflow-y-auto">
      {/* Screen Title Bar */}
      <div className="flex items-center mb-6">
        <div className="p-2.5 rounded-xl bg-brand-muted border border-brand/30 mr-3">
          <History size={24} color="#00F2FE" />
        </div>
        <div>
          <Typography variant="h2" color="ink" className="font-bold text-2xl">
            Treatment Log
          </Typography>
          <Typography variant="caption" color="inkMuted" className="text-sm">
            HISTORICAL REMEDIATION EVENTS
          </Typography>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 content-start">
        {isLoading && (
          <div className="col-span-full flex items-center justify-center py-20">
            <Typography variant="body" color="inkMuted">Loading treatments...</Typography>
          </div>
        )}

        {isError && (
          <div className="col-span-full flex items-center justify-center py-20">
            <Typography variant="body" color="danger">Failed to load treatments.</Typography>
          </div>
        )}

        {!isLoading && !isError && treatments?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <Layers size={48} color="#1A253A" className="mb-4" />
            <Typography variant="body" color="inkMuted">No treatments recorded yet.</Typography>
          </div>
        )}

        {treatments?.map((treatment) => (
          <Card key={treatment.id} className="p-5 bg-surface-elevated border-surface-border flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <CheckCircle2 size={20} color="#10B981" className="mr-2" />
                <Typography variant="label" color="ink" className="font-bold">
                  Target Remediated
                </Typography>
              </div>
              <Badge
                label={treatment.outcome === 'success' ? 'SUCCESS' : treatment.outcome?.toUpperCase() || 'COMPLETED'}
                status={treatment.outcome === 'success' ? 'leaf' : 'neutral'}
                size="sm"
                showDot={false}
              />
            </div>

            <div className="h-px bg-surface-border w-full mb-4" />

            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock size={16} color="#94A3B8" className="mr-2" />
                  <Typography variant="caption" color="inkMuted">Time</Typography>
                </div>
                <Typography variant="label" color="ink" className="font-mono text-sm">
                  {formatDate(treatment.started_at)}
                </Typography>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Droplet size={16} color="#00F2FE" className="mr-2" />
                  <Typography variant="caption" color="inkMuted">Flocculant Dosed</Typography>
                </div>
                <Typography variant="label" color="ink" className="font-mono text-sm">
                  {treatment.flocculant_dosed_ml} mL
                </Typography>
              </div>
              
              <div className="flex justify-between items-center pt-2 mt-1 border-t border-surface-border/50">
                <div className="flex items-center">
                  <Layers size={14} color="#94A3B8" className="mr-2" />
                  <Typography variant="caption" color="inkMuted" className="text-xs">Waypoint ID</Typography>
                </div>
                <Typography variant="caption" color="inkSubtle" className="font-mono text-[10px] truncate max-w-[120px]" title={treatment.waypoint_id}>
                  {treatment.waypoint_id}
                </Typography>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
