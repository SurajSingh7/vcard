// app/convergence-form/page.jsx
import { Suspense } from "react";
import ConvergenceForm from "../../../components/ConvergenceForm";

// You can also force dynamic rendering if needed:
// export const dynamic = "force-dynamic";

export default function ConvergenceFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConvergenceForm />
    </Suspense>
  );
}
