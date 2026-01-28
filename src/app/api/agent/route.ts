import { plan } from "@/agent/planner"
import { execute } from "@/agent/executor"

export async function POST(req: Request) {
  const { message } = await req.json()
  const intent = plan(message)
  const result = await execute(intent)
  return Response.json({ result })
}
