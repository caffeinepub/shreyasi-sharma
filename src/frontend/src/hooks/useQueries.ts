import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useInitialize() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["init"],
    queryFn: async () => {
      if (!actor) return null;
      await actor.initializePortfolios();
      return true;
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetBio() {
  const { actor, isFetching } = useActor();
  const { data: initialized } = useInitialize();
  return useQuery<string>({
    queryKey: ["bio"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getBio();
    },
    enabled: !!actor && !isFetching && !!initialized,
  });
}

export function useGetProjects() {
  const { actor, isFetching } = useActor();
  const { data: initialized } = useInitialize();
  return useQuery<Array<{ title: string; year: bigint; description: string }>>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjects();
    },
    enabled: !!actor && !isFetching && !!initialized,
  });
}

export function useGetAwards() {
  const { actor, isFetching } = useActor();
  const { data: initialized } = useInitialize();
  return useQuery<Array<{ title: string; year: bigint; won: boolean }>>({
    queryKey: ["awards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAwards();
    },
    enabled: !!actor && !isFetching && !!initialized,
  });
}

export function useSubmitContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitContactMessage(name, email, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}
