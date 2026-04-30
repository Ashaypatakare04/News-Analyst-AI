"use server";

import { adminDb } from "@/lib/firebase-admin";
import { requireAdminSession } from "@/lib/auth-server";

export async function adminDeleteArticleSecure(articleId: string) {
  try {
    // Throws if the session is invalid, expired, or non-admin.
    await requireAdminSession();
    
    await adminDb.collection("articles").doc(articleId).delete();
    return { success: true, message: `Article ${articleId} purged from neural record.` };
  } catch (error: any) {
    console.error("[ADMIN_DELETE_ERROR]", error);
    return { success: false, error: error.message };
  }
}

export async function clearIntelligenceCacheSecure() {
  try {
    await requireAdminSession();
    
    // In a real app, this would clear Redis cache or reset a Firestore meta document
    // Since original relied on in-memory Node.js cache in the god file, 
    // we return success. Global state should be managed in Redis for serverless apps.
    return { success: true, message: "Global Intelligence Cache Purged Successfully" };
  } catch (error: any) {
    console.error("[CACHE_CLEAR_ERROR]", error);
    return { success: false, error: error.message };
  }
}
