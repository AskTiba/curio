import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserCategories, createCategory } from "@/actions/categories";

export const CATEGORIES_QUERY_KEY = ["categories"];

/**
 * Hook to fetch all user categories
 */
export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => getUserCategories(),
  });
}

/**
 * Hook to create a new category
 */
export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) => createCategory(name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}
