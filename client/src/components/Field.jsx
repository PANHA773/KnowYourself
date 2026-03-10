import React from "react";

export default function Field({ label, children, hint }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-semibold text-slate-100/90">{label}</div>
      {children}
      {hint ? <div className="mt-1 text-xs text-slate-300/70">{hint}</div> : null}
    </label>
  );
}
