import { createClient } from "./client";

export const BUCKET_NAME = "requisition-attachments";

export interface UploadResult {
  path: string;
  name: string;
  url?: string;
  error?: string;
}

/**
 * Helper to upload attachment files (ET, TDR, proformas) to Supabase Storage or mock storage.
 */
export async function uploadAttachmentFile(file: File, folder: string = "general"): Promise<UploadResult> {
  try {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (error) {
      console.warn("Supabase Storage upload warning (fallback to local mock path):", error.message);
      // Fallback path for MVP development/offline mode
      return {
        path: `mock_storage/${folder}/${file.name}`,
        name: file.name,
      };
    }

    return {
      path: data.path,
      name: file.name,
    };
  } catch (err: any) {
    console.warn("Storage upload exception (fallback active):", err?.message);
    return {
      path: `mock_storage/${folder}/${file.name}`,
      name: file.name,
    };
  }
}
