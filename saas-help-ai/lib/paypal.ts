async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const isSandbox = process.env.PAYPAL_MODE === "sandbox";

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const baseUrl = isSandbox
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function createPayPalOrder(
  amount: number,
  currency: string = "USD",
  returnUrl: string,
  cancelUrl: string
): Promise<{ orderId: string; approvalUrl: string }> {
  const accessToken = await getPayPalAccessToken();
  const isSandbox = process.env.PAYPAL_MODE === "sandbox";
  const baseUrl = isSandbox
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

  // Step 1: Create order without payment_source (multi-step flow)
  const createOrderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!createOrderResponse.ok) {
    let errorData: unknown;
    try {
      errorData = await createOrderResponse.json();
    } catch {
      const errorText = await createOrderResponse.text();
      errorData = { message: errorText };
    }
    console.error("PayPal create order error:", errorData);
    throw new Error(
      `PayPal order creation failed: ${JSON.stringify(errorData)}`
    );
  }

  const orderData = await createOrderResponse.json();
  const orderId = orderData.id;

  // Step 2: Confirm payment source to get approval URL
  const confirmResponse = await fetch(
    `${baseUrl}/v2/checkout/orders/${orderId}/confirm-payment-source`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              brand_name: "Startup Validator",
              locale: "en-US",
              landing_page: "LOGIN",
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
              return_url: returnUrl,
              cancel_url: cancelUrl,
            },
          },
        },
      }),
    }
  );

  if (!confirmResponse.ok) {
    let errorData: unknown;
    try {
      errorData = await confirmResponse.json();
    } catch {
      const errorText = await confirmResponse.text();
      errorData = { message: errorText };
    }
    console.error("PayPal confirm payment source error:", errorData);
    throw new Error(
      `PayPal payment source confirmation failed: ${JSON.stringify(errorData)}`
    );
  }

  const confirmData = await confirmResponse.json();

  // Find the approval URL in the links array
  const approveLink = confirmData.links?.find(
    (link: { rel: string; href: string }) =>
      link.rel === "payer-action" || link.rel === "approve"
  );

  if (!approveLink) {
    // Try getting from the order details if not in links
    const orderDetails = await getPayPalOrder(orderId);
    const orderApproveLink = orderDetails.links?.find(
      (link: { rel: string; href: string }) =>
        link.rel === "payer-action" || link.rel === "approve"
    );
    if (orderApproveLink) {
      return {
        orderId,
        approvalUrl: orderApproveLink.href,
      };
    }
    throw new Error("PayPal approval URL not found");
  }

  return {
    orderId,
    approvalUrl: approveLink.href,
  };
}

export async function capturePayPalOrder(
  orderId: string
): Promise<{ success: boolean; transactionId?: string }> {
  const accessToken = await getPayPalAccessToken();
  const isSandbox = process.env.PAYPAL_MODE === "sandbox";
  const baseUrl = isSandbox
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

  const response = await fetch(
    `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      const errorText = await response.text();
      errorData = { message: errorText };
    }
    console.error("PayPal capture error:", errorData);
    throw new Error(`PayPal capture failed: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];

  return {
    success: data.status === "COMPLETED",
    transactionId: capture?.id,
  };
}

export async function getPayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const isSandbox = process.env.PAYPAL_MODE === "sandbox";
  const baseUrl = isSandbox
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal order");
  }

  return response.json();
}
