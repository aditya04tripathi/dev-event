import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		return NextResponse.json(
			{
				success: false,
				message: "User profile endpoint not implemented yet",
			},
			{ status: 501 },
		);
	} catch (error) {
		console.error("[GET /api/user/profile] Error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch user profile",
			},
			{ status: 500 },
		);
	}
}
