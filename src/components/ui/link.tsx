import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
};

/** Ponte de compatibilidade: aceita `href` e usa o roteador quando possível. */
export function Link({ href, prefetch, scroll, replace, ...props }: LinkProps) {
  const interno = href.startsWith("/") && !href.startsWith("//");

  if (!interno) {
    return <a href={href} {...props} />;
  }

  return <RouterLink to={href} replace={replace} {...props} />;
}

export default Link;

/** Equivalente ao usePathname do Next. */
export function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}
