import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

type MotionProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  children?: ReactNode;
};

function createMotionComponent<T extends ElementType>(tag: T, label: string) {
  const ComponentWithMotion = forwardRef<HTMLElement, MotionProps<T>>((props, ref) => {
    const { children, ...rest } = props as MotionProps<typeof tag>;
    const Component = tag as ElementType;
    return (
      <Component ref={ref as never} {...rest}>
        {children}
      </Component>
    );
  });
  ComponentWithMotion.displayName = label;
  return ComponentWithMotion;
}

export const motion = {
  div: createMotionComponent("div", "MotionDiv"),
  section: createMotionComponent("section", "MotionSection"),
  article: createMotionComponent("article", "MotionArticle"),
  header: createMotionComponent("header", "MotionHeader"),
  main: createMotionComponent("main", "MotionMain"),
  footer: createMotionComponent("footer", "MotionFooter"),
  button: createMotionComponent("button", "MotionButton"),
};

export function AnimatePresence({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export type Variants = Record<string, Record<string, unknown>>;
