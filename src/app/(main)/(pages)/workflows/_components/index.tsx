import { onGetWorkflows } from "../_actions/workflow-connections";
import Workflow from "./workflow";

type Props = {};

export default async function Workflows({}: Props) {
  const workflows = await onGetWorkflows();

  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex flex-col m-2">
        {workflows?.length ? (
          workflows.map((flow) => <Workflow key={flow.id} {...flow} />)
        ) : (
          <div className="absolute flex h-[80vh] w-full items-center justify-center my-auto text-muted-foreground">
            No workflows found...
          </div>
        )}
      </section>
    </div>
  );
}
