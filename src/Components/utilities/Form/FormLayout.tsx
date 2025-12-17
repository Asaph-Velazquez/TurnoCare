import React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  widthClass?: string; // e.g. 'max-w-2xl' or 'max-w-4xl'
};

export default function FormLayout({ title, children, onSubmit, widthClass = "max-w-2xl" }: Props) {
  return (
    <div className={`${widthClass} mx-auto bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl p-6 shadow-lg`}>
      {title && <h2 className="text-xl font-semibold text-auto-primary mb-4">{title}</h2>}
      <form onSubmit={onSubmit} className="space-y-4">{children}</form>
    </div>
  );
}

