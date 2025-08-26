// src/context/AuthContext.tsx (or wherever you placed it)

import type { User } from "@supabase/supabase-js";
import React, { useState, createContext, useContext,useEffect } from "react";
;
import { supabase } from "../supabase-client";

// 1. Define the type for the context
interface AuthContextType {
  user: User | null;
  signInWithGitHub: () => void;
  signOut: () => void;
}

// 2. Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect (() => {
    supabase.auth.getSession().then(({data :{session}})=>{
        setUser(session?.user?? null);
    });

    const {data: listener} =supabase.auth.onAuthStateChange((_,session)=>{
        setUser(session?.user??null);
    })
    return()=>{
        listener.subscription.unsubscribe();
    };


  },[]);

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGitHub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType =>{
    const context = useContext(AuthContext);
    if(context===undefined){
        throw new Error("useAuth must be used within the AuthProvider");
    }
    return context;
};