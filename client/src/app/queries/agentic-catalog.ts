import { useQuery } from "@tanstack/react-query";

import { DEFAULT_REFETCH_INTERVAL } from "@app/Constants";
import { getGateways } from "@app/api/rest";
import {
  AGENTIC_QUERY_RETRY,
  pollUnlessErrored,
} from "@app/queries/agentic-polling";

export const GATEWAYS_QUERY_KEY = "gateways";

// ---------------------------------------------------------- Gateways

export const useFetchGateways = (
  refetchInterval: number | false = DEFAULT_REFETCH_INTERVAL
) => {
  const { _isPending, error, data, refetch } = useQuery({
    queryKey: [GATEWAYS_QUERY_KEY],
    queryFn: getGateways,
    // Verification flips Ready on its own schedule — keep the page live.
    retry: AGENTIC_QUERY_RETRY,
    refetchInterval: (query) => pollUnlessErrored(query, refetchInterval),
  });
  return {
    gateways: data || [],
    isLoading: isPending,
    _isPending,
    fetchError: error,
    refetch,
  };
};
