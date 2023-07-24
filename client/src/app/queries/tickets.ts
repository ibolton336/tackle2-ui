import { useMutation, useQuery } from "@tanstack/react-query";
import { createTickets, deleteTicket, getTickets } from "@app/api/rest";
import { AxiosError } from "axios";
import { New, Ref, Ticket } from "@app/api/models";

export const TicketsQueryKey = "tickets";

export const useCreateTicketsMutation = (
  onSuccess: () => void,
  onError: (err: AxiosError) => void
) => {
  return useMutation({
    mutationFn: ({
      payload,
      applications,
    }: {
      payload: New<Ticket>;
      applications: Ref[];
    }) => createTickets(payload, applications),
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useFetchTickets = () => {
  const { isLoading, error, refetch, data } = useQuery({
    queryKey: [TicketsQueryKey],
    queryFn: getTickets,
    refetchInterval: 5000,
    onError: (error) => console.error(error),
  });
  return {
    tickets: data || [],
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useDeleteTicketMutation = () => {
  const { isLoading, error, mutateAsync } = useMutation({
    mutationFn: ({ ticket }: { ticket: Ticket }) => deleteTicket(ticket.id),
    onError: (err: AxiosError) => {
      console.error(err);
    },
  });
  return {
    mutateAsync,
    isLoading,
    error,
  };
};
