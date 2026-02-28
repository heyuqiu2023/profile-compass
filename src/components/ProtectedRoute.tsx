/**
 * Auth guard — temporarily bypassed so the app can be explored without signing up.
 * To re-enable: uncomment the authentication logic below and remove the pass-through return.
 */

// TODO: re-enable when sign-up flow is ready
// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Pass-through: auth check disabled temporarily
  return <>{children}</>;
};

export default ProtectedRoute;
