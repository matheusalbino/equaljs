import {
  createRef,
  createStore,
  updateTextContent,
  useSyncStore,
  onMount,
  type Ref,
} from '@equal/equaljs';

export function Clock(props: { title: string }, ref: Ref<JSX.Element>) {
  const { title } = props;

  const clockDisplay = createRef();

  const [clock, setClock] = createStore(new Date().toLocaleString());

  onMount(ref, () => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });

  useSyncStore((value) => {
    updateTextContent(clockDisplay, value);
  }, clock);

  return (
    <text as="h2" ref={ref}>
      {title}:{' '}
      <text as="span" ref={clockDisplay}>
        {clock.value}
      </text>
    </text>
  );
}
