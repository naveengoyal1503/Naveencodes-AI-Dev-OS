import { AppShell } from "../../components/shell/app-shell";
import { DeploymentCenter } from "../../components/ops/deployment-center";
import { ProjectManager } from "../../components/projects/project-manager";

export default function ProjectsPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <ProjectManager />
        <DeploymentCenter />
      </div>
    </AppShell>
  );
}
