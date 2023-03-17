import {
  useMutation,
  useQueries,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import { deleteAssessment, getAssessments } from "@app/api/rest";
import { AxiosError } from "axios";
import { Application, Assessment } from "@app/api/models";

export const assessmentsQueryKey = "assessments";

export const useFetchApplicationAssessments = (
  applications: Application[] = []
) => {
  const queryResults = useQueries({
    queries: applications.map((application) => ({
      queryKey: [assessmentsQueryKey, application.id],
      queryFn: async () => {
        const response = await getAssessments({
          applicationId: application.id,
        });
        const allAssessmentsForApp = response.data;
        return allAssessmentsForApp[0] || [];
      },
      onError: (error: any) => console.log("error, ", error),
    })),
  });
  const queryResultsByAppId: Record<number, UseQueryResult<Assessment>> = {};
  applications.forEach((application, i) => {
    if (application.id) queryResultsByAppId[application.id] = queryResults[i];
  });
  return {
    getApplicationAssessment: (id: number) => queryResultsByAppId[id].data,
    isLoadingApplicationAssessment: (id: number) =>
      queryResultsByAppId[id].isLoading,
    fetchErrorApplicationAssessment: (id: number) =>
      queryResultsByAppId[id].error as AxiosError | undefined,
  };
};

export const useDeleteAssessmentMutation = (
  onSuccess: (res: any, id: number) => void,
  onError: (err: AxiosError) => void
) => {
  const queryClient = useQueryClient();

  const { isLoading, mutate, error } = useMutation(deleteAssessment, {
    onSuccess: (res, id) => {
      onSuccess(res, id);
      queryClient.invalidateQueries([assessmentsQueryKey]);
    },
    onError: (err: AxiosError) => {
      onError(err);
      queryClient.invalidateQueries([assessmentsQueryKey]);
    },
  });
  return {
    mutate,
    isLoading,
    error,
  };
};
