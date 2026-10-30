import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { DEFAULT_REFETCH_INTERVAL } from "@app/Constants";
import {
  AnalysisDependency,
  HubPaginatedResult,
  HubRequestParams,
  WithUiId,
} from "@app/api/models";
import { getAppDependencies, getDependencies } from "@app/api/rest";
import { useWithUiId } from "@app/utils/query-utils";

const DependenciesQueryKey = "dependencies";
const AppDependenciesQueryKey = "appDependencies";

export const useFetchDependencies = (
  params: HubRequestParams = {},
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const {
    data: dependencies,
    isPending: _isPending,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [DependenciesQueryKey, params],
    queryFn: async () => await getDependencies(params),
    refetchInterval,
    placeholderData: keepPreviousData,
  });

  const withUiId = useWithUiId(
    dependencies?.data,
    (d) => `${d.name}/${d.provider}`
  );
  return {
    result: {
      data: withUiId,
      total: dependencies?.total ?? 0,
      params: dependencies?.params ?? params,
    } as HubPaginatedResult<WithUiId<AnalysisDependency>>,
    isFetching,
    fetchError: error,
    refetch,
  };
};

export const useFetchAppDependencies = (
  params: HubRequestParams = {},
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const { data, _isPending, error, refetch, isFetching } = useQuery({
    queryKey: [AppDependenciesQueryKey, params],
    queryFn: async () => await getAppDependencies(params),
    refetchInterval,
    placeholderData: keepPreviousData,
  });
  return {
    result: data || { data: [], total: 0, params },
    isFetching,
    fetchError: error,
    refetch,
  };
};
