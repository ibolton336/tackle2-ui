import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { JobFunction } from "@app/api/models";
import {
  createJobFunction,
  deleteJobFunction,
  getJobFunctions,
  updateJobFunction,
} from "@app/api/rest";

const JobFunctionsQueryKey = "jobfunctions";

export const useFetchJobFunctions = (
  refetchInterval: number | false = false
) => {
  const { data, isPending, error, refetch, isFetching } = useQuery({
    queryKey: [JobFunctionsQueryKey],
    queryFn: getJobFunctions,
    refetchInterval,
  });
  return {
    jobFunctions: data || [],
    isLoading: isPending,
    isFetching,
    fetchError: error,
    refetch,
  };
};

export const useCreateJobFunctionMutation = (
  onSuccess: (data: JobFunction) => void,
  onError: (err: AxiosError) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJobFunction,
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: [JobFunctionsQueryKey] });
    },
    onError,
  });
};

export const useUpdateJobFunctionMutation = (
  onSuccess: () => void,
  onError: (err: AxiosError) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJobFunction,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: [JobFunctionsQueryKey] });
    },
    onError: onError,
  });
};

export const useDeleteJobFunctionMutation = (
  onSuccess: (id: number) => void,
  onError: (err: AxiosError) => void
) => {
  const queryClient = useQueryClient();

  const { isPending, mutate, error } = useMutation({
    mutationFn: deleteJobFunction,
    onSuccess: (_, id) => {
      onSuccess(id);
    },
    onError: (err: AxiosError) => {
      onError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [JobFunctionsQueryKey] });
    },
  });
  return {
    mutate,
    isLoading: isPending,
    isPending,
    error,
  };
};
