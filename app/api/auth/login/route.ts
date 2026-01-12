import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ success: false, message: "Email and password are required" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: "Authentication not implemented yet",
			},
			{ status: 501 },
		);
	} catch (error) {
		console.error("[POST /api/auth/login] Error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to authenticate",
			},
			{ status: 500 },
		);
	}
}
