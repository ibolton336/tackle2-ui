import { useQuery } from "@tanstack/react-query";

import { getDeploymentByID } from "@app/api/rest";
import { AxiosError } from "axios";

export const deploymentsQueryKey = "facts";

export const useFetchDeploymentByID = (id: number | string | undefined) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [deploymentsQueryKey, id],
    queryFn: () => getDeploymentByID(id),
    enabled: !!id,
    onError: (error: AxiosError) => console.log("error, ", error),
    // select: (deployments): Fact[] =>
    //   Object.keys(deployments).map((fact) => ({ name: fact, data: facts[fact] })),
  });

  return {
    deployment: data || null,
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};
