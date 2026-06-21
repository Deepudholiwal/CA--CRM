import React from "react";

export function Table({ children, className = "", ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border/40">
      <table className={`w-full text-sm text-left border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`bg-muted/40 text-muted-foreground font-medium border-b border-border/40 ${className}`} {...props}>{children}</thead>;
}

export function TableBody({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`divide-y divide-border/30 bg-card ${className}`} {...props}>{children}</tbody>;
}

export function TableRow({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`hover:bg-muted/30 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-muted-foreground select-none ${className}`} {...props}>{children}</th>;
}

export function TableCell({ children, className = "", ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-6 py-4 whitespace-nowrap text-foreground/90 font-normal leading-snug align-middle ${className}`} {...props}>{children}</td>;
}
