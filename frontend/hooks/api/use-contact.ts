import { useMutation } from "@tanstack/react-query";
import { submitContactAction } from "@/lib/actions/contact";

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      reason: string;
      subject: string;
      message: string;
    }) => submitContactAction(data),
  });
};
