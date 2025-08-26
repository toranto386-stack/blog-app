import { useState, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useUser } from "@supabase/auth-helpers-react";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string;
}

const DEFAULT_AVATAR_URL = "https://ui-avatars.com/api/?name=Anonymous";

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Could not get public URL of uploaded image.");
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...post,
      image_url: publicUrlData.publicUrl,
    });

  if (error) throw new Error(error.message);
  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const user = useUser();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) =>
      createPost(data.post, data.imageFile),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    const avatar = user?.user_metadata?.user_avatar_url || DEFAULT_AVATAR_URL;

    mutate({
      post: {
        title,
        content,
        avatar_url: avatar,
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          onChange={(event) => setTitle(event.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          required
          rows={5}
          onChange={(event) => setContent(event.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="w-full text-gray-200"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && (
        <p className="text-red-500 mt-2">
          Error: {(error as Error)?.message}
        </p>
      )}
    </form>
  );
};
