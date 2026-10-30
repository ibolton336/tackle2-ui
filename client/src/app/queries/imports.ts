import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DEFAULT_REFETCH_INTERVAL } from "@app/Constants";
import {
  deleteApplicationImportSummary,
  getApplicationImportSummaryById,
  getApplicationImports,
  getApplicationsImportSummary,
} from "@app/api/rest";

const ImportSummariesQueryKey = "importsummaries";
const ImportsQueryKey = "imports";
const ImportQueryKey = "import";

export const useFetchImports = (
  importSummaryID: number,
  isValid: boolean | string,
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: [ImportsQueryKey, importSummaryID, isValid],
    queryFn: () => getApplicationImports(importSummaryID, isValid),
    refetchInterval,
  });
  return {
    imports: data || [],
    isFetching,
    fetchError: error,
    refetch,
  };
};

export const useFetchImportSummaries = (
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: [ImportSummariesQueryKey],
    queryFn: getApplicationsImportSummary,
    refetchInterval,
  });
  return {
    importSummaries: data || [],
    isFetching,
    fetchError: error,
    refetch,
  };
};

export const useFetchImportSummaryById = (id: number | string) => {
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: [ImportQueryKey, id],
    queryFn: () => getApplicationImportSummaryById(id),
  });

  return {
    importSummary: data,
    isFetching,
    fetchError: error,
    refetch,
  };
};

export const useDeleteImportSummaryMutation = (
  onSuccess: () => void,
  onError: (err: Error | null) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApplicationImportSummary,
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: [ImportSummariesQueryKey] });
    },
    onError: (err: Error) => {
      onError?.(err);
    },
  });
};
