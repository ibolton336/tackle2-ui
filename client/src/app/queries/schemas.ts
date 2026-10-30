import { useQuery } from "@tanstack/react-query";

import {
  getPlatformCoordinatesSchema,
  getPlatformDiscoveryFilterSchema,
} from "@app/api/rest";

export const PLATFORM_COORDINATES_SCHEMA_QUERY_KEY =
  "platformCoordinatesSchema";
const PLATFORM_DISCOVERY_FILTER_SCHEMA_QUERY_KEY =
  "platformDiscoveryFilterSchema";

export const useFetchPlatformCoordinatesSchema = (platformKind?: string) => {
  const { data, _isPending, isSuccess, error } = useQuery({
    queryKey: [PLATFORM_COORDINATES_SCHEMA_QUERY_KEY, platformKind],
    queryFn: () =>
      platformKind === undefined
        ? Promise.resolve(undefined)
        : getPlatformCoordinatesSchema(platformKind),
    enabled: platformKind !== undefined,
  });

  return {
    coordinatesSchema: data,
    isLoading: isPending,
    isPending,
    isSuccess,
    fetchError: error,
  };
};

export const useFetchPlatformDiscoveryFilterSchema = (
  platformKind?: string
) => {
  const { data, _isPending, isSuccess, error } = useQuery({
    queryKey: [PLATFORM_DISCOVERY_FILTER_SCHEMA_QUERY_KEY, platformKind],
    queryFn: () =>
      platformKind === undefined
        ? Promise.resolve(undefined)
        : getPlatformDiscoveryFilterSchema(platformKind),
    enabled: platformKind !== undefined,
  });

  return {
    filtersSchema: data,
    isLoading: isPending,
    isPending,
    isSuccess,
    fetchError: error,
  };
};
