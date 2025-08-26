import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContex";

interface Props {
  postId: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data, error: fetchError } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .limit(1);

  if (fetchError) throw new Error(fetchError.message);

  const existingVote = data?.[0];

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Vote[];
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to vote.");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading) return <div className="text-gray-400 text-sm">Loading votes...</div>;
  if (error) return <div className="text-red-500 text-sm">Error: {error.message}</div>;

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={() => mutate(1)}
        className={`px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 ${
          userVote === 1
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-200 text-gray-800 hover:bg-green-100"
        }`}
        disabled={isPending}
      >
        👍 {likes}
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 ${
          userVote === -1
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-200 text-gray-800 hover:bg-red-100"
        }`}
        disabled={isPending}
      >
        👎 {dislikes}
      </button>
      {isError && <p className="text-red-500 text-xs ml-2">Failed to vote</p>}
    </div>
  );
};
