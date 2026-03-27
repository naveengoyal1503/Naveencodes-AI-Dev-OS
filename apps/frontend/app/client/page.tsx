import { ClientWorkspace } from "../../components/client/client-workspace";
import { AppShell } from "../../components/shell/app-shell";

export default function ClientPage() {
  return (
    <AppShell>
      <ClientWorkspace />
    </AppShell>
  );
}
