import { bootstrapWorkspace } from "../server/db";

const result = await bootstrapWorkspace();
console.log(JSON.stringify(result));
