import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { capturePayment } from "@/actions/payment";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const tier = searchParams.get("tier");

  if (!token || !tier) {
    redirect("/payment/error?error=Missing payment information");
  }

  // Capture the payment
  const result = await capturePayment(
    token,
    tier as "MONTHLY" | "YEARLY" | "ONE_OFF"
  );

  if (result.error || !result.success) {
    redirect(
      `/payment/error?error=${encodeURIComponent(
        result.error || "Payment failed"
      )}`
    );
  }

  // Revalidate paths after successful payment (outside of render)
  revalidatePath("/dashboard");
  revalidatePath("/pricing");

  // Redirect to dashboard with success message
  redirect("/dashboard?payment=success");
}
