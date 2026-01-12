import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		return NextResponse.json(
			{
				success: false,
				message: "User events endpoint not implemented yet",
			},
			{ status: 501 },
		);
	} catch (error) {
		console.error("[GET /api/user/events] Error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch user events",
			},
			{ status: 500 },
		);
	}
}
