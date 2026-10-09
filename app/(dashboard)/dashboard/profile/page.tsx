"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  Fingerprint,
  LogOut,
  CircleCheck,
  Zap,
  Pencil,
  X,
  LoaderCircle,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/app/(auth)/_features/auth.provider";
import { useUploadProfileImage } from "../../_features/profile/profile.hook";

type ProfileUser = {
  id?: string;
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
  role?: string | null;
  createdAt?: string | null;
  isVerified?: boolean;
  emailVerified?: boolean;
  profileImage?: string | null;
  profilePicture?: string | null;
  avatar?: string | null;
  image?: string | null;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function formatRole(role?: string | null) {
  if (!role) return "User";

  return role
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function getInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return email?.[0]?.toUpperCase() ?? "U";
}

function formatDate(date?: string | null) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const profile = user as ProfileUser | null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadProfileImage();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedPicture, setUploadedPicture] = useState<string | null>(null);
  const [removePicture, setRemovePicture] = useState(false);

  const currentName = profile?.name?.trim() || profile?.fullName?.trim() || "";

  const currentEmail = profile?.email ?? "";

  const currentPicture =
    uploadedPicture ??
    profile?.profileImage ??
    profile?.profilePicture ??
    profile?.avatar ??
    profile?.image ??
    null;

  const displayedPicture = previewUrl
    ? previewUrl
    : removePicture
      ? null
      : currentPicture;

  const role = formatRole(profile?.role);

  const verified =
    profile?.isVerified === true || profile?.emailVerified === true;

  useEffect(() => {
    setEmail(currentEmail);
    setName(currentName);
  }, [currentName, currentEmail]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function resetPictureSelection() {
    setPictureFile(null);
    setPreviewUrl(null);
    setRemovePicture(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function beginEditing() {
    setName(currentName);
    setEmail(currentEmail);
    resetPictureSelection();
    setEditing(true);
  }

  function cancelEditing() {
    setName(currentName);
    setEmail(currentEmail);
    resetPictureSelection();
    setEditing(false);
  }

  function handlePictureChange(file?: File) {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Choose a JPG, PNG, or WebP image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("The image must be smaller than 5 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPictureFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemovePicture(false);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const nameChanged = trimmedName !== currentName;
    const emailChanged = trimmedEmail !== currentEmail;

    if (!pictureFile && (nameChanged || emailChanged)) {
      toast.error(
        "Name and email updates need a profile-update API. Your changes have not been saved.",
      );
      return;
    }

    if (!pictureFile) {
      toast.info("There are no changes to save.");
      return;
    }

    try {
      const response = await uploadMutation.mutateAsync(pictureFile);

      const result = response.data;

      const newImage =
        result?.profileImage ??
        result?.profilePicture ??
        result?.avatar ??
        result?.image ??
        result?.user?.profileImage ??
        result?.user?.profilePicture ??
        result?.user?.avatar ??
        result?.user?.image ??
        null;

      if (newImage) {
        setUploadedPicture(newImage);
      }

      resetPictureSelection();
      setEditing(false);

      if (nameChanged || emailChanged) {
        toast.success(
          "Profile picture updated. Name and email changes were not saved.",
        );
      } else {
        toast.success("Profile picture updated successfully.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload your profile picture.",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-36 animate-pulse rounded-xl bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <UserRound className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Profile unavailable</h2>
            <p className="text-sm text-muted-foreground">
              Please sign in again to view your account.
            </p>
            <Button>
              <a href="/login">Go to login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and profile picture.
          </p>
        </div>

        {!editing && (
          <Button onClick={beginEditing}>
            <Pencil className="mr-2 size-4" />
            Edit profile
          </Button>
        )}
      </div>

      {/* Profile summary */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-primary" />

        <CardContent className="p-5 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative size-24 shrink-0">
              {displayedPicture ? (
                <img
                  src={displayedPicture}
                  alt="Profile picture"
                  className="size-24 rounded-2xl border object-cover"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {getInitials(currentName, profile.email)}
                </div>
              )}

              {editing && (
                <button
                  type="button"
                  aria-label="Change profile picture"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -right-2 -bottom-2 flex size-9 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted"
                >
                  <Camera className="size-4" />
                </button>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="break-words text-xl font-semibold md:text-2xl">
                {currentName || profile.email || "Your account"}
              </h2>

              <p className="break-all text-sm text-muted-foreground">
                {profile.email || "No email provided"}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <ShieldCheck className="size-3.5" />
                  {role}
                </span>

                {verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <CircleCheck className="size-3.5" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={() => void logout()}
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit profile */}
      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>Edit personal information</CardTitle>
            <CardDescription>
              Choose a profile picture and edit your account details.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-3">
                <Label>Profile picture</Label>

                <div className="flex flex-col gap-4 rounded-xl border border-dashed p-4 sm:flex-row sm:items-center">
                  {displayedPicture ? (
                    <img
                      src={displayedPicture}
                      alt="Selected profile picture"
                      className="size-20 rounded-xl border object-cover"
                    />
                  ) : (
                    <div className="flex size-20 items-center justify-center rounded-xl bg-muted">
                      <UserRound className="size-8 text-muted-foreground" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      Upload a profile picture
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, or WebP. Maximum 5 MB.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImagePlus className="mr-2 size-4" />
                        Choose image
                      </Button>

                      {displayedPicture && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (previewUrl?.startsWith("blob:")) {
                              URL.revokeObjectURL(previewUrl);
                            }

                            setPreviewUrl(null);
                            setPictureFile(null);
                            setRemovePicture(true);

                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }

                            toast.info(
                              "Picture removal is only a preview. A backend removal endpoint is required to delete the saved picture.",
                            );
                          }}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) =>
                    handlePictureChange(event.target.files?.[0])
                  }
                />

                {pictureFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {pictureFile.name} (
                    {(pictureFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              <Separator />

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full name</Label>
                  <div className="relative">
                    <UserRound className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your full name"
                      className="pl-9"
                      maxLength={100}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="pl-9"
                      maxLength={254}
                      required
                    />
                  </div>
                  {email.trim() !== currentEmail && (
                    <p className="text-xs text-muted-foreground">
                      Email changes are not saved until a backend update
                      endpoint is connected.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={uploadMutation.isPending}
                >
                  <X className="mr-2 size-4" />
                  Cancel
                </Button>

                <Button type="submit" disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  ) : (
                    <CircleCheck className="mr-2 size-4" />
                  )}
                  {uploadMutation.isPending ? "Uploading..." : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Account information */}
      <Card>
        <CardHeader>
          <CardTitle>Account information</CardTitle>
          <CardDescription>
            Your account details and membership information.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <ShieldCheck className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account role</p>
              <p className="font-medium">{role}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <CalendarDays className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="font-medium">{formatDate(profile.createdAt)}</p>
            </div>
          </div>

          {profile.id && (
            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="rounded-lg bg-muted p-2.5">
                <Fingerprint className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="break-all font-mono text-sm">{profile.id}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System access */}
      <Card>
        <CardHeader>
          <CardTitle>System access</CardTitle>
          <CardDescription>
            Your access to the Load Shedding &amp; Power Management system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Zap className="size-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">{role} access</p>
              <p className="text-sm text-muted-foreground">
                Available pages and actions depend on your assigned role.
                Contact your system administrator if your access needs to
                change.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
