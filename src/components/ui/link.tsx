import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes, type Ref } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
};

/** Ponte de compatibilidade: aceita `href` e usa o roteador quando possível. */
export const Link = forwardRef(function Link(
  { href, prefetch: _p, scroll: _s, replace, ...props }: LinkProps,
  ref: Ref<HTMLAnchorElement>,
) {
  const interno = href.startsWith("/") && !href.startsWith("//");

  if (!interno) {
    return <a ref={ref} href={href} {...props} />;
  }

  return <RouterLink ref={ref} to={href} replace={replace} {...props} />;
});


export default Link;

/** Equivalente ao usePathname do Next. */
export function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}
