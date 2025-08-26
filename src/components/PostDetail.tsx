// src/components/PostDetail.tsx

import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";


interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  console.log("Fetched post:", { data, error });

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data as Post | null;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post | null, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) return <div className="text-white p-4">Loading post...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;
  if (!data) return <div className="text-gray-400 p-4">Post not found.</div>;

  return (
    <div className="flex justify-center pt-10 px-4">
      <div className="w-full max-w-3xl bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white overflow-hidden shadow-lg">
        
        {/* Title */}
        <div className="p-4">
          <h2 className="text-[24px] font-bold mb-2">{data.title}</h2>
        </div>

        {/* Image */}
        {data.image_url && (
          <img
            src={data.image_url}
            alt={data.title}
            className="w-full h-[300px] object-cover"
          />
        )}

        {/* Content & Meta */}
        <div className="p-4 space-y-3 text-[15px] text-gray-300">
          <p>{data.content}</p>
          <p className="text-sm text-gray-500">
            Posted on: {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <LikeButton postId={postId}/>
      <CommentSection postId={postId}/>
    </div>
  );
};
