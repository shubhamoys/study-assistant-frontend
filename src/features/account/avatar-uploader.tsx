"use client";

import { useRef, useState } from "react";
import { Camera } from "@phosphor-icons/react";
import { getAccessToken } from "@/lib/auth-token";
import { API_ORIGIN } from "@/lib/graphql-endpoint";
import { resolveAvatarUrl } from "./avatar-url";
import styles from "./avatar-uploader.module.scss";

interface AvatarUploaderProps {
  avatarUrl: string | null;
  displayName: string | null;
  email: string;
  onUploaded: (avatarUrl: string) => void;
}

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2 * 1024 * 1024;

export function AvatarUploader({
  avatarUrl,
  displayName,
  email,
  onUploaded,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file next time
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      setError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 2MB or smaller.");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const token = getAccessToken();
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_ORIGIN}/api/users/me/avatar`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!res.ok) {
        setError("Upload failed. Please try again.");
        return;
      }

      const data: { avatarUrl: string } = await res.json();
      onUploaded(data.avatarUrl);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const resolvedUrl = resolveAvatarUrl(avatarUrl);
  const initial = (displayName ?? email).charAt(0).toUpperCase();

  return (
    <div className={styles.wrap}>
      <div className={styles.avatar}>
        {resolvedUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable dev-origin URL; not worth Next/Image's remotePatterns config for a single small avatar.
          <img src={resolvedUrl} alt="" className={styles.avatarImage} />
        ) : (
          <span className={styles.avatarInitial}>{initial}</span>
        )}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.changeButton}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Camera size={16} weight="bold" />
          {uploading ? "Uploading…" : "Change photo"}
        </button>
        <span className={styles.hint}>JPEG, PNG, or WebP. Max 2MB.</span>
        {error && <span className={styles.error}>{error}</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.hiddenInput}
        onChange={(event) => void handleFileChange(event)}
      />
    </div>
  );
}
