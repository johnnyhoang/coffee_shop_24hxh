import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type Props = {
  id: string;
  items: ContextMenuItem[];
  onItemClicked: (item: ContextMenuItem) => void;
};

export type ContextMenuItem = {
  id: string;
  label: string;
};

const ContextMenu = (props: PropsWithChildren<Props>) => {
  const { items, children, id, onItemClicked } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const ref = useRef<HTMLUListElement>(null);

  const showMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVisible(true);
    setPosition({ x: 100, y: e.clientY - 230 });
  };

  const clickHandler = useCallback(
    (e: MouseEvent) => {
      if (isVisible) {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY > rect.top ||
            e.clientY < rect.bottom
          ) {
            setIsVisible(false);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isVisible],
  );

  useEffect(() => {
    if (isVisible) {
      document.dispatchEvent(
        new CustomEvent<string>('contextMenuOpened', {
          detail: id,
        }),
      );
    }
  }, [isVisible, id]);

  useEffect(() => {
    window.addEventListener('click', clickHandler);
    return () => {
      window.removeEventListener('click', clickHandler);
    };
  }, [clickHandler]);

  return (
    <>
      <div onContextMenu={showMenu}>{children}</div>
      {isVisible && (
        <ul
          ref={ref}
          style={{ left: position.x, top: position.y, zIndex: 1000 }}
          className="contextMenu"
        >
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setIsVisible(false);
                onItemClicked(item);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ContextMenu;
