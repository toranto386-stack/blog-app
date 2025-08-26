// src/pages/PostPage.tsx

import { useParams } from "react-router-dom";
import { PostDetail } from "../components/PostDetail";

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  // Check if id is a number
  const postId = Number(id);
  if (isNaN(postId)) return <div className="text-white p-4">Invalid Post ID</div>;

  return (
    <div className="pt-10">
      <PostDetail postId={Number(postId)} />
    </div>
  );
};
