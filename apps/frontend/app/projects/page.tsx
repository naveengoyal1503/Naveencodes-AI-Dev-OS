import { AppShell } from "../../components/shell/app-shell";
import { ProjectManager } from "../../components/projects/project-manager";

export default function ProjectsPage() {
  return (
    <AppShell>
      <ProjectManager />
    </AppShell>
  );
}
