import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAll, type AppData } from "@/lib/pb-data";

export const DATA_KEY = ["peerbridge"];
export function useAppData() {
  return useQuery({ queryKey: DATA_KEY, queryFn: fetchAll });
}
export function useRun() {
  const qc = useQueryClient();
  return async (fn: () => PromiseLike<{ error: unknown }> | Promise<unknown>, ok?: string) => {
    try {
      const res = (await fn()) as { error?: { message?: string } } | undefined;
      if (res && typeof res === "object" && "error" in res && res.error) throw res.error;
      await qc.invalidateQueries({ queryKey: DATA_KEY });
      if (ok) toast.success(ok);
      return true;
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Something went wrong");
      return false;
    }
  };
}
export type { AppData };
