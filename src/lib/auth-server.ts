import { adminAuth, adminDb } from "./firebase-admin";
import { cookies } from "next/headers";

/**
 * Validates the session cookie and verifies admin privileges in Firestore.
 * Throws errors on failure to halt execution immediately.
 */
export async function requireAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  
  if (!sessionToken) throw new Error("UNAUTHORIZED: No session provided.");

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionToken, true);
    const adminDoc = await adminDb.collection("admins").doc(decodedToken.uid).get();
    
    if (!adminDoc.exists) throw new Error("FORBIDDEN: Requires Administrator privileges.");
    return decodedToken.uid;
  } catch (error) {
    console.error("[AUTH_ERROR]", error);
    throw new Error("UNAUTHORIZED: Invalid or expired session.");
  }
}
