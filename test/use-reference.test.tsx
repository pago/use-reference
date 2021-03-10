import { renderHook } from '@testing-library/react-hooks';
import { useReference } from '../src';

test('it provides access to the initial value', () => {
  let onClick = jest.fn();
  const { result } = renderHook(({ value }) => useReference(value), {
    initialProps: { value: { onClick } },
  });

  result.current.onClick();
  expect(onClick).toHaveBeenCalled();
});

test('it provides access to the latest value', () => {
  let onClick = jest.fn();
  const { result, rerender } = renderHook(({ value }) => useReference(value), {
    initialProps: { value: { onClick } },
  });

  let newOnClick = jest.fn();
  rerender({
    value: { onClick: newOnClick },
  });

  result.current.onClick();
  expect(onClick).not.toHaveBeenCalled();
  expect(newOnClick).toHaveBeenCalled();
});

test('it provides access to all keys of the reference', () => {
  let onClick = jest.fn();
  const { result } = renderHook(({ value }) => useReference(value), {
    initialProps: { value: { onClick, name: 'hello', version: '1.0.0' } },
  });

  expect(Object.keys(result.current)).toEqual(['onClick', 'name', 'version']);
});
