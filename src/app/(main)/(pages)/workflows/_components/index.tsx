import Workflow from "./workflow";

type Props = {};

export default function Workflows({}: Props) {
  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex flex-col m-2">
        <Workflow
          description="Creating a test workflow."
          id="hgyt12738791y2hc8y26gc7552h"
          name="Automation Workflow"
          publish={false}
        />
      </section>
    </div>
  );
}
