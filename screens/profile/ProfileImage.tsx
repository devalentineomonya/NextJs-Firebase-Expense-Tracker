import { useState } from "react";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage } from "@/lib/firebase/config";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "react-firebase-hooks/storage";
import { ref, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const ProfileImage = () => {
  const [user, userLoading] = useAuthState(auth);
  const [uploadFile, uploading, ,error] = useUploadFile();
  const [localError, setLocalError] = useState("");

  const handleFileUpload = async (file: File) => {
    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);

      await uploadFile(storageRef, file, {
        contentType: file.type,
      });

      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });

      setLocalError("");
    } catch (err) {
      console.error("Upload failed:", err);
      if (err instanceof Error) {
        setLocalError(err.message || "Failed to upload image");
      } else {
        setLocalError("Failed to upload image");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        setLocalError("File size exceeds 800KB limit");
        return;
      }
      handleFileUpload(file);
    }
  };

  return (
    <Card className="flex h-full flex-col justify-start shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent mt-5">
      <CardHeader>
        <CardTitle>Change Profile</CardTitle>
        <CardDescription>Change your profile picture from here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center mt-5">
          {userLoading || uploading ? (
            <div className="w-[102px] h-[102px] bg-gray-200 dark:bg-gray-800 rounded-full flex justify-center items-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <Image
              src={user?.photoURL || "/profile.jpg"}
              alt="profile"
              width={120}
              height={120}
              className="rounded-full mx-auto"
              priority
            />
          )}

          <div className="flex justify-center gap-3 py-6">
            <input
              type="file"
              id="profile-upload"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="default" asChild disabled={uploading}>
              <label htmlFor="profile-upload" className="cursor-pointer">
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  "Upload"
                )}
              </label>
            </Button>
            <Button
              variant="destructive"
              disabled={uploading}
              // Add reset functionality here
            >
              Reset
            </Button>
          </div>

          {(error || localError) && (
            <p className="text-red-500 text-sm mt-2">{error?.message || localError}</p>
          )}
          <p className="text-sm text-darklink">
            Allowed JPG, GIF or PNG. Max size of 800K
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImage;
