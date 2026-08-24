import Link from "next/link";

export default function PageHeading({ eyebrow, title, description, backHref, backLabel }: { eyebrow: string; title: string; description: string; backHref?: string; backLabel?: string }) {
  return <header className="page-heading">
    {backHref && backLabel ? <Link className="ux4g-text-link-sm back-link" href={backHref}>← {backLabel}</Link> : null}
    <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p>
  </header>;
}
