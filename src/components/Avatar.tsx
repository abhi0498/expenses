"use client";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import Loader from "./Loader";
import toast from "react-hot-toast";

const Avatar = ({ url, uid }: { url: string; uid: string }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = React.createRef<HTMLInputElement>();

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `${uid}/${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }
    const { data } = await supabase
      .from("profile")
      .select("id")
      .eq("user_id", uid)
      .limit(1)
      .single();
    if (!data?.id) {
      await supabase
        .from("profile")
        .insert({ avatar_url: filePath, user_id: uid });
    } else {
      await supabase
        .from("profile")
        .update({ avatar_url: filePath, user_id: uid })
        .eq("id", data?.id);
    }

    downloadImage(filePath);
    return filePath;
  };

  async function downloadImage(path: string) {
    try {
      setUploading(true);
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    } finally {
      setUploading(false);
    }
  }
  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  return (
    <>
      {uploading && <Loader />}
      <input
        type="file"
        className="grow"
        onChange={(event) => {
          toast.promise(uploadAvatar(event) as any, {
            loading: "Uploading...",
            success: "Uploaded successfully",
            error: "Failed to upload",
          });
        }}
        disabled={uploading}
        style={{
          display: "none",
        }}
        ref={inputRef}
      />

      <FiUploadCloud
        className="w-10 h-10 text-2xl text-primary relative bg-white p-2 rounded-full cursor-pointer"
        style={{
          top: 115,
          left: 50,
          zIndex: 100,
        }}
        onClick={() => inputRef.current?.click()}
      />

      <Image
        alt="Profile Photo"
        className="w-24 mask mask-squircle mt-4"
        width={100}
        height={100}
        style={{
          width: "100px",
          height: "100px",
        }}
        src={
          avatarUrl ||
          "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
        }
      />
    </>
  );
};

export default Avatar;
