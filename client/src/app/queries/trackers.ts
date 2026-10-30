import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { DEFAULT_REFETCH_INTERVAL } from "@app/Constants";
import { New, Tracker } from "@app/api/models";
import {
  createTracker,
  deleteTracker,
  getTrackerProjectIssuetypes,
  getTrackerProjects,
  getTrackers,
  updateTracker,
} from "@app/api/rest";

import { TicketsQueryKey } from "./tickets";

export const TrackersQueryKey = "trackers";
const TrackerProjectsQueryKey = "trackerProjects";
const TrackerProjectIssuetypesQueryKey = "trackerProjectIssuetypes";

export const useFetchTrackers = (
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const queryClient = useQueryClient();
  const { data, _isPending, isFetching, isSuccess, error, refetch } = useQuery({
    queryKey: [TrackersQueryKey],
    queryFn: getTrackers,
    refetchInterval,
  });

  // Implement onSuccess behavior with useEffect
  useEffect(() => {
    if (isSuccess && !isFetching) {
      queryClient.invalidateQueries({ queryKey: [TicketsQueryKey] });
    }
  }, [isSuccess, isFetching, queryClient]);

  return {
    trackers: data || [],
    isFetching,
    fetchError: error,
    refetch,
  };
};

export const useCreateTrackerMutation = (
  onSuccess: (tracker: Tracker) => void,
  onError: (err: AxiosError) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (obj: New<Tracker>) => createTracker(obj),
    onSuccess: (tracker) => {
      onSuccess(tracker);
      queryClient.invalidateQueries({ queryKey: [TrackersQueryKey] });
    },
    onError: onError,
  });
};

export const useUpdateTrackerMutation = (
  onSuccess: (tracker: Tracker) => void,
  onError: (err: AxiosError) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTracker,
    onSuccess: (_, tracker) => {
      onSuccess(tracker);
      queryClient.invalidateQueries({ queryKey: [TrackersQueryKey] });
    },
    onError: onError,
  });
};

export const useDeleteTrackerMutation = (
  onSuccess: (trackerName: string) => void,
  onError: (err: AxiosError) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tracker }: { tracker: Tracker }) =>
      deleteTracker(tracker.id),
    onSuccess: (_, vars) => {
      onSuccess(vars.tracker.name);
      queryClient.invalidateQueries({ queryKey: [TrackersQueryKey] });
    },
    onError: onError,
  });
};

const useFetchTrackerProjects = (
  trackerId?: number,
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const queryClient = useQueryClient();
  const { data, _isPending, isFetching, isSuccess, error, refetch } = useQuery({
    queryKey: [TrackerProjectsQueryKey, { id: trackerId }],
    queryFn: () => getTrackerProjects(trackerId!),
    enabled: !!trackerId,
    refetchInterval,
  });

  // Implement onSuccess behavior with useEffect
  useEffect(() => {
    if (isSuccess && !isFetching) {
      queryClient.invalidateQueries({ queryKey: [TicketsQueryKey] });
    }
  }, [isSuccess, isFetching, queryClient]);

  return {
    projects: data || [],
    isFetching,
    fetchError: error,
    refetch,
  };
};

const useFetchTrackerProjectIssuetypes = (
  trackerId?: number,
  projectId?: string,
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const queryClient = useQueryClient();
  const { data, _isPending, isFetching, isSuccess, error, refetch } = useQuery({
    queryKey: [
      TrackerProjectIssuetypesQueryKey,
      { id: trackerId, projectId: projectId },
    ],
    queryFn: () => getTrackerProjectIssuetypes(trackerId!, projectId!),
    enabled: !!trackerId && !!projectId,
    refetchInterval,
  });

  // Implement onSuccess behavior with useEffect
  useEffect(() => {
    if (isSuccess && !isFetching) {
      queryClient.invalidateQueries({ queryKey: [TicketsQueryKey] });
    }
  }, [isSuccess, isFetching, queryClient]);

  return {
    issuetypes: data || [],
    isFetching,
    fetchError: error,
    refetch,
  };
};

export const getTrackersByKind = (trackers: Tracker[], kind: string) =>
  trackers.filter((tracker) => tracker.kind === kind && tracker.connected);

export const useTrackerProjectsByTracker = (
  trackerName: string,
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const { trackers } = useFetchTrackers(refetchInterval);
  const tracker = trackers.find((tracker) => tracker.name === trackerName);

  const { projects } = useFetchTrackerProjects(tracker?.id, refetchInterval);
  return projects;
};

export const useTrackerTypesByProjectName = (
  trackerName: string,
  projectName: string,
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const { trackers } = useFetchTrackers(refetchInterval);
  const tracker = trackers.find((tracker) => tracker.name === trackerName);

  const { projects } = useFetchTrackerProjects(tracker?.id, refetchInterval);
  const project = projects.find((project) => project.name === projectName);

  const { issuetypes } = useFetchTrackerProjectIssuetypes(
    tracker?.id,
    project?.id,
    refetchInterval
  );
  return issuetypes;
};

export const useTrackerTypesByProjectId = (
  trackerName?: string,
  projectId?: string,
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const { trackers } = useFetchTrackers(refetchInterval);
  const tracker = trackers.find((tracker) => tracker.name === trackerName);

  const { projects } = useFetchTrackerProjects(tracker?.id, refetchInterval);
  const project = projects.find((project) => project.id === projectId);

  const { issuetypes } = useFetchTrackerProjectIssuetypes(
    tracker?.id,
    project?.id,
    refetchInterval
  );
  return issuetypes;
};
