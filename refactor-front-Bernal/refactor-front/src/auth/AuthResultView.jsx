import Button from "../components/Button";
import { LOGIN } from "../types/LOGIN";

export default function AuthResultView({mode, recoveryLink, loginLink, onRequestAnotherEmail,
}) {
  if (mode === "forgot") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          {LOGIN.forgot.result}
        </p>
        <div className="flex flex-col gap-2 pt-2">
          {recoveryLink}
          <Button
            variant="mutedText"
            type="button"
            onClick={onRequestAnotherEmail}
          >
            {LOGIN.forgot.requestAnother}
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "reset") {
    return <div className="pt-2 text-center">{loginLink}</div>;
  }

  return null;
}