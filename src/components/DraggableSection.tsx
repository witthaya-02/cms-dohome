import React, { useState, createContext, useContext } from 'react';

interface DragContextType {
  draggedItem: {
    listId: string;
    listKey: string;
    item: any;
    index: number;
    isSourceList?: boolean;
  } | null;

  setDraggedItem: (
    item: {
      listId: string;
      listKey: string;
      item: any;
      index: number;
      isSourceList?: boolean;
    } | null
  ) => void;
  // eslint-disable-next-line no-unused-vars
  removeItem: (listKey: string, index: number) => void;
  // eslint-disable-next-line no-unused-vars
  addItem: (listKey: string, item: any, index: number) => void;

  registerList: (
    listKey: string,
    listId: string,
    items: any[],
    setItems: (items: any[]) => void
  ) => void;
  // eslint-disable-next-line no-unused-vars
  lists: Map<string, { id: string; items: any[]; setItems: (items: any[]) => void }>;
}

const DragContext = createContext<DragContextType | null>(null);

function DragProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<{
    listId: string;
    listKey: string;
    item: any;
    index: number;
    isSourceList?: boolean;
  } | null>(null);
  const [lists] = useState(
    new Map<string, { id: string; items: any[]; setItems: (items: any[]) => void }>()
  );

  const registerList = (
    listKey: string,
    listId: string,
    items: any[],
    setItems: (items: any[]) => void
  ) => {
    lists.set(listKey, { id: listId, items, setItems });
  };

  const removeItem = (listKey: string, index: number) => {
    const list = lists.get(listKey);
    if (list) {
      const newItems = [...list.items];
      newItems.splice(index, 1);
      list.setItems(newItems);
    }
  };

  const addItem = (listKey: string, item: any, index: number) => {
    const list = lists.get(listKey);
    if (list) {
      const newItems = [...list.items];
      newItems.splice(index, 0, item);
      list.setItems(newItems);
    }
  };

  return (
    <DragContext.Provider
      value={{ draggedItem, setDraggedItem, removeItem, addItem, registerList, lists }}
    >
      {children}
    </DragContext.Provider>
  );
}

interface DraggableListProps<T> {
  id: string;
  className?: string;
  data: T[];
  // eslint-disable-next-line no-unused-vars
  itemSection: (data: T, index: number) => React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  onDataChange?: (newData: T[]) => void;
  isSourceList?: boolean;
  isReceiveList?: boolean;
  locked?: boolean;
  // eslint-disable-next-line no-unused-vars
  extractValue?: (item: any) => T;
  hoverAnimation?: boolean;
  // eslint-disable-next-line no-unused-vars
  endDrop?: (item: T, index: number) => void;
}

function DraggableList<T>({
  id,
  className = '',
  data,
  itemSection,
  onDataChange,
  isSourceList = false,
  extractValue,
  hoverAnimation = true,
  endDrop,
  isReceiveList,
  locked = false,
}: DraggableListProps<T>) {
  const [items, setItems] = useState<T[]>(data);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const listKey = React.useRef(`list_${Math.random()}`).current;
  const dragCtx = useContext(DragContext);

  // const [pastAbleSection, setPastAbleSection] = useState<boolean>(false);

  React.useEffect(() => {
    setItems(data);
  }, [data]);

  React.useEffect(() => {
    if (dragCtx) {
      dragCtx.registerList(listKey, id, items, (newItems: T[]) => {
        setItems(newItems);
        onDataChange?.(newItems);
      });
    }
  }, [items, id, listKey, dragCtx, onDataChange]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!dragCtx) return;
    dragCtx.setDraggedItem({
      listId: id,
      listKey: listKey,
      item: items[index],
      index: index,
      isSourceList: isSourceList,
    });
    e.dataTransfer.effectAllowed = isSourceList ? 'copy' : 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (!dragCtx || !dragCtx.draggedItem) return;

    // Source list cannot accept drops
    if (isSourceList) return;

    // Only allow drag if same listId
    if (dragCtx.draggedItem.listId !== id) {
      return;
    }

    setDragOverIndex(index);

    if (dragCtx.draggedItem.listKey === listKey && !dragCtx.draggedItem.isSourceList) {
      // Same list - reorder
      if (dragCtx.draggedItem.index === index) return;

      const newItems = [...items];
      const [draggedItem] = newItems.splice(dragCtx.draggedItem.index, 1);
      newItems.splice(index, 0, draggedItem);

      setItems(newItems);
      onDataChange?.(newItems);
      endDrop?.(draggedItem, index);

      dragCtx.draggedItem.index = index;
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!dragCtx || !dragCtx.draggedItem) return;

    // Source list cannot accept drops
    if (isSourceList) return;

    // Only allow drop if same listId
    if (dragCtx.draggedItem.listId !== id) {
      return;
    }

    if (dragCtx.draggedItem.listKey !== listKey) {
      // Different list but same id - transfer item
      let itemToAdd = dragCtx.draggedItem.item;

      // If coming from source list and extractValue provided, extract the value
      if (dragCtx.draggedItem.isSourceList && extractValue) {
        itemToAdd = extractValue(dragCtx.draggedItem.item);
      }

      const newItems = [...items];
      newItems.splice(index, 0, itemToAdd);

      setItems(newItems);
      onDataChange?.(newItems);
      endDrop?.(itemToAdd, index);

      // Only remove from source if not a source list
      if (!dragCtx.draggedItem.isSourceList) {
        const sourceListKey = dragCtx.draggedItem.listKey;
        const sourceIndex = dragCtx.draggedItem.index;
        dragCtx.removeItem(sourceListKey, sourceIndex);
      }
    }

    dragCtx.setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
    if (dragCtx) {
      dragCtx.setDraggedItem(null);
    }
  };

  const canAcceptDrag = !isSourceList && dragCtx?.draggedItem?.listId === id;
  const isDraggingFromSource = dragCtx?.draggedItem?.isSourceList;

  return (
    <div
      className={className}
      onDragOver={(e) => {
        if (canAcceptDrag && items.length === 0) {
          e.preventDefault();
          setDragOverIndex(0);
        }
      }}
      onDrop={(e) => {
        if (canAcceptDrag && items.length === 0 && dragCtx?.draggedItem) {
          e.preventDefault();

          let itemToAdd = dragCtx.draggedItem.item;

          // If coming from source list and extractValue provided, extract the value
          if (dragCtx.draggedItem.isSourceList && extractValue) {
            itemToAdd = extractValue(dragCtx.draggedItem.item);
          }

          setItems([itemToAdd]);
          onDataChange?.([itemToAdd]);

          // Only remove from source if not a source list
          if (!dragCtx.draggedItem.isSourceList) {
            const sourceListKey = dragCtx.draggedItem.listKey;
            const sourceIndex = dragCtx.draggedItem.index;
            dragCtx.removeItem(sourceListKey, sourceIndex);
          }

          dragCtx.setDraggedItem(null);
          setDragOverIndex(null);
        }
      }}
      onDragLeave={() => setDragOverIndex(null)}
    >
      {items.map((item, index) => (
        <div key={index}>
          {isReceiveList && locked ? (
            <div>
              {isDraggingFromSource && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverIndex(index);
                  }}
                  onDrop={(e) => {
                    e.stopPropagation();
                    handleDrop(e, index);
                  }}
                  className={`
                    p-8 border-2 h-full bg-[#FAE5DB] rounded-lg flex items-center justify-center text-center transition-colors my-[10px]
                    ${
                      dragOverIndex === index && canAcceptDrag
                        ? 'border-[#ee5d1f] text-[#ee5d1f] border-solid'
                        : 'border-[#F26529] text-[#F26529] border-dashed'
                    }
                  `}
                >
                  วาง Widget ตรงนี้
                </div>
              )}

              <div className="h-full">{itemSection(item, index)}</div>
            </div>
          ) : (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
            h-full
            ${hoverAnimation && 'transition-all duration-200 hover:scale-[1.02]'}
            ${
              dragOverIndex === index
                ? 'opacity-50 scale-95 rounded-[10px] bg-blue-100'
                : 'hover:bg-gray-50'
            }
            ${dragCtx?.draggedItem?.listKey === listKey && dragCtx?.draggedItem?.index === index && !isSourceList ? 'opacity-50' : ''}
          `}
            >
              {itemSection(item, index)}
            </div>
          )}
        </div>
      ))}

      {isReceiveList && isDraggingFromSource && items.length > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverIndex(items.length);
          }}
          onDrop={(e) => {
            e.stopPropagation();
            handleDrop(e, items.length);
          }}
          className={`
            p-8 border-2 h-full bg-[#FAE5DB] rounded-lg flex items-center justify-center text-center transition-colors my-[10px]
            ${
              dragOverIndex === items.length && canAcceptDrag
                ? 'border-[#ee5d1f] text-[#ee5d1f] border-solid'
                : 'border-[#F26529] text-[#F26529] border-dashed'
            }
          `}
        >
          วาง Widget ตรงนี้
        </div>
      )}

      {items.length === 0 && !isSourceList && (
        <div
          onDrop={(e) => handleDrop(e, 0)}
          className={`
          p-8 border-2 h-full bg-[#FAE5DB] rounded-lg flex items-center justify-center text-center transition-colors
          ${dragOverIndex === 0 && canAcceptDrag ? 'border-[#ee5d1f] text-[#ee5d1f] border-solid' : 'border-[#F26529] text-[#F26529] border-dashed'}
        `}
        >
          วาง Widget
        </div>
      )}
    </div>
  );
}

export { DraggableList, DragProvider };
