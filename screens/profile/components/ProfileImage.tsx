import { useState } from "react";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProfileImage = () => {
  const [user, userLoading] = useAuthState(auth);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
  };

  return (
    <Card className="flex h-full flex-col justify-start shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent mt-5">
      <CardHeader>
        <CardTitle>Change Profile</CardTitle>
        <CardDescription>Change your profile picture from here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center mt-5">
          {userLoading ? (
            <div className="w-[102px] h-[102px] bg-gray-200 dark:bg-gray-800 rounded-full flex justify-center items-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <div className="w-[102px] h-[102px] bg-gray-200 dark:bg-gray-800 rounded-full flex justify-center items-center overflow-hidden">
              <Image
                src={selectedImage || user?.photoURL || "/profile.jpg"}
                alt="profile"
                width={120}
                height={120}
                className="mx-auto"
                priority
              />
            </div>
          )}

          <div className="flex justify-center gap-3 py-6">
            <input
              type="file"
              id="profile-upload"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="default" asChild>
              <label htmlFor="profile-upload" className="cursor-pointer">
                Change
              </label>
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset
            </Button>
          </div>
          <p className="text-sm text-darklink">Allowed JPG, GIF, or PNG.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImage;
