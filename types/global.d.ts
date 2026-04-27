// React 19 removed the global JSX namespace. Re-declare it for
// packages like react-markdown v8 that still reference JSX directly.
import type React from "react";

declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type IntrinsicElements = React.JSX.IntrinsicElements;
    type ElementChildrenAttribute = React.JSX.ElementChildrenAttribute;
    type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>;
    type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
    type IntrinsicClassAttributes<T> = React.JSX.IntrinsicClassAttributes<T>;
    type ElementClass = React.JSX.ElementClass;
    type ElementAttributesProperty = React.JSX.ElementAttributesProperty;
  }
}
