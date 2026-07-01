

export async function GET() {
  return Response.json({
    success: true,
    message: "AI Travel Receptionist API is running",
    timestamp: new Date().toISOString(),
  });
}
