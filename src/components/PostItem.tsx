import { Link } from "react-router-dom";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group">
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-2xl text-white flex flex-col overflow-hidden transition-colors duration-300 group-hover:bg-gray-800 shadow-md hover:shadow-xl">

          {/* Header */}
          <div className="flex items-center gap-3 p-4">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-600"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div className="text-lg font-semibold truncate">{post.title}</div>
          </div>

          {/* Image */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}

          {/* Like / Comment Section */}
          <div className="flex justify-between px-4 py-3 mt-auto text-sm text-gray-400 border-t border-gray-700">
            <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
              ♥ <span>{post.like_count ?? 0}</span>
            </span>
            <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              💬 <span>{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
