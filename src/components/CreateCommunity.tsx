import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";

interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {
  const {
    data: userData,
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error("User not authenticated.");
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from("communities")
    .insert({ ...community, user_id: userId }) // <- assuming table has user_id
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Community Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded text-white"
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Creating..." : "Create Community"}
      </button>
      {isError && (
        <p className="text-red-500 mt-2">
          Error: {(error as Error)?.message}
        </p>
      )}
    </form>
  );
};
