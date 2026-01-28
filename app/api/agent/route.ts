import { plan } from "@/agent/planner";
import { execute } from "@/agent/executor";

export async function POST(req: Request) {
  try {
    console.log("api/agent POST - request received");
    const { message } = await req.json();
    console.log("api/agent - message:", typeof message === "string" ? message.slice(0, 1000) : message);

    if (!message || !message.trim()) {
      console.log("api/agent - empty message");
      return Response.json({ error: "Wiadomość nie może być pusta" }, { status: 400 });
    }

    const intent = await plan(message);
    console.log("api/agent - intent:", intent);

    const result = await execute(intent);
    console.log("api/agent - result:", typeof result === "string" ? result.slice(0, 2000) : result);

    return Response.json({ result });
  } catch (error) {
    console.error("api/agent - error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Nieznany błąd serwera" },
      { status: 500 }
    );
  }
}