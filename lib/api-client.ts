function getApiBaseUrl(): string {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	if (process.env.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL;
	}
	return "http://localhost:3000";
}

export async function apiRequest<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const baseUrl = getApiBaseUrl();
	const url = `${baseUrl}${endpoint}`;

	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: "An error occurred",
		}));
		throw new Error(error.message || `HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export async function apiRequestFormData<T>(
	endpoint: string,
	formData: FormData,
): Promise<T> {
	const baseUrl = getApiBaseUrl();
	const url = `${baseUrl}${endpoint}`;

	const response = await fetch(url, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: "An error occurred",
		}));
		throw new Error(error.message || `HTTP error! status: ${response.status}`);
	}

	return response.json();
}
