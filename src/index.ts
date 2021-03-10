import {MutableRefObject, useEffect, useRef, useState} from 'react';

export function useReference<T extends object>(ref: T): T {
  const holder = useLatestRef(ref);
  const [proxy] = useState(function createProxyObject() {
    // Proxy.ownKeys has an invariant that ensures it only returns
    // the exact same properties as the proxied object had.
    // To avoid holding on to the initial "ref" object, we create
    // a new object with all the same keys but without any value.
    const probe = Object.keys(ref).reduce((x, key) => {
      ((x as unknown) as any)[key] = 0;
      return x;
    }, {} as T);
    return new Proxy(probe, {
      get(target, p) {
        return ((holder.current as unknown) as any)[p];
      },
      has(target, p) {
        return p in holder.current;
      },
      ownKeys() {
        return Reflect.ownKeys(holder.current);
      }
    });
  });
  return proxy;
}

export function useLatestRef<T>(ref: T): MutableRefObject<T> {
  const holder = useRef(ref);
  useEffect(function updateReference() {
    holder.current = ref;
  }, [ref]);
  return holder;
}
