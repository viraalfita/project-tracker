import { FileText, Link as LinkIcon, Paperclip } from "lucide-react";

export function EpicDocsTab() {
  return (
    <div className="space-y-4">
      {/* Doc page nav sidebar + content */}
      <div className="flex gap-4">
        {/* Page list */}
        <div className="w-48 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-2">
            Pages
          </p>
          <div className="space-y-0.5">
            {[
              { label: "Overview", active: true },
              { label: "Technical Spec", active: false },
              { label: "Design Notes", active: false },
              { label: "Decision Log", active: false },
            ].map(({ label, active }) => (
              <button
                key={label}
                className={`w-full text-left flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Doc content */}
        <div className="flex-1 rounded-lg border border-border bg-white p-6 min-h-[400px]">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-foreground mb-1">Overview</h2>
            <p className="text-xs text-muted-foreground mb-6">Last edited by Alice Johnson · Feb 10, 2026</p>

            <div className="prose prose-sm max-w-none text-foreground space-y-4">
              <p>
                The Authentication Overhaul initiative covers the full redesign of the login, registration,
                and password-reset flows. This epic aligns with the new design system and lays the foundation
                for SSO support in a future release.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Goals</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Match updated Figma spec (Alpha / Auth v2)</li>
                  <li>Pass WCAG AA contrast ratios on all interactive elements</li>
                  <li>Support Google OAuth as an optional sign-in method</li>
                  <li>Enforce password strength via zxcvbn (score ≥ 2)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Out of Scope (this epic)</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>SSO / SAML integration</li>
                  <li>Magic link auth</li>
                  <li>Admin user provisioning flow</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Key Links</h3>
                <div className="space-y-2">
                  {[
                    { label: "Figma — Auth v2 spec", url: "#" },
                    { label: "zxcvbn npm package", url: "#" },
                    { label: "WCAG 2.1 AA checklist", url: "#" },
                  ].map(({ label }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <LinkIcon className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="text-indigo-600 hover:underline cursor-pointer">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Attachments</h3>
                <div className="space-y-1">
                  {["auth-v2-spec.pdf", "password-policy-draft.docx"].map((file) => (
                    <div key={file} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Paperclip className="h-3.5 w-3.5 shrink-0" />
                      <span className="hover:text-foreground cursor-pointer">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
