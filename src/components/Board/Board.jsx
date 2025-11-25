import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Lane } from './Lane';
import { LaneDragWrapper } from './LaneDragWrapper';

export const Board = ({
  columns,
  getColumnColor,
  updateColumnTitle,
  addLane,
  deleteLane,
  moveCard,
  moveLane,
  updateCardTitle,
  updateCardTags,
  availableTags,
  addNewTag,
  toggleCardPriority,
  toggleCardCompleted,
  updateCardDate,
  addCard,
}) => {
  const scrollContainerRef = useRef(null);

  const scrollHorizontal = (direction) => {
    const node = scrollContainerRef.current;
    if (!node) return;
    const distance = 320;
    node.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto overflow-y-visible pb-10 w-full items-stretch pr-4"
      >
        {columns.map((column, idx) => (
          <LaneDragWrapper
            key={column.id}
            column={column}
            columnIndex={idx}
            onMoveLane={moveLane}
          >
            <Lane
              column={column}
              columnIndex={idx}
              getColumnColor={getColumnColor}
              updateColumnTitle={updateColumnTitle}
              addLane={addLane}
              deleteLane={deleteLane}
              moveCard={moveCard}
              updateCardTitle={updateCardTitle}
              updateCardTags={updateCardTags}
              availableTags={availableTags}
              addNewTag={addNewTag}
              toggleCardPriority={toggleCardPriority}
              toggleCardCompleted={toggleCardCompleted}
              updateCardDate={updateCardDate}
              addCard={addCard}
            />
          </LaneDragWrapper>
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-6 right-6 z-20">
        <div className="flex gap-2 bg-white/85 backdrop-blur-sm shadow-md rounded-full p-1 pointer-events-auto border border-gray-200">
          <button
            type="button"
            onClick={() => scrollHorizontal('left')}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollHorizontal('right')}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
