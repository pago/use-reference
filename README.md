# useReference

## In a nutshell
`useReference` allows you to pack an object in a `ref` and access it transparently.
The returned object is stable but all of its properties will always have the latest value.
It is concurrent mode safe.

```js
import {useReference} from '@pago/use-reference';
const api = useReference({
    onSubmit,
    onError,
    onChange,
    getData
});
const [data, setData] = useState();

useEffect(function loadAdditionalData() {
    api.getData().then(setData);
},[api, url]);

useEffect(function onFormDataChange() {
    api.onChange({name, email});
}, [api, name, email]);
```

The effects will only trigger if `name` or `email` or `url` change.
But the callbacks invoked will always be the latest version that was
passed into the component.

## Motivation
When working with React Hooks and components that receive callbacks,
I often reach for a `useLatestRef` type hook that stores the callback
for me. Storing the callback in a `Ref` enables me to safely use it
within `useEffect`, `useMemo` and `useCallback`.

However, when working with multiple values like those it can become quite
cumbersome to read through all of their setup code. For example:

```js
import {useLatestRef} from "@pago/use-reference";

const onSubmitRef = useLatestRef(onSubmit);
const onErrorRef = useLatestRef(onError);
const onChangeRef = useLatestRef(onChange);
```

A decent alternative to that is to use package them all into a single object.
```js
const api = useLatestRef({
    onSubmit,
    onError,
    onChange
});
```

However, that still forces me to think about `refs` and to write `api.current.onSubmit`,
increasing the noise in my code.

That's why `useReference` exists. To streamline this pattern and to reduce the noise.

```js
import {useReference} from "@pago/use-reference";

const api = useReference({
    onSubmit,
    onError,
    onChange
});
```

Enables me to just do `api.onSubmit`.
