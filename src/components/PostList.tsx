import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

// Define the Post interface (should match your Supabase table)
export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?:string;
  like_count?:number;
  comment_count?:number;

}

// Fetch posts from Supabase (ordered by newest first)
const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts")
    

  console.log("Supabase response:", { data, error }); // ✅ Log fetched posts

  if (error) throw new Error(error.message);
  return data as Post[];
};


// Component to render list of posts
export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("PostList rendering data:", data); // ✅ Log before rendering

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post) => {
        console.log("Rendering post:", post); // ✅ Log each post
        return <PostItem key={post.id} post={post} />;
      })}
    </div>
  );
};
