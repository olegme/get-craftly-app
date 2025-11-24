import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Board } from './Board/Board';
import { ConfirmationDialog } from './Board/ConfirmationDialog';
import { useBoard } from '../hooks/useBoard';

const MainBoard = ({ user }) => {
  const {
      columns,
      availableTags,
      dialogOpen,
      getColumnColor,
      addNewTag,
      moveCard,
      moveLane,
      updateCardTitle,
      updateCardTags,
      toggleCardPriority,
      toggleCardCompleted,
      updateColumnTitle,
      addLane,
      handleDeleteLane,
      confirmDelete,
      cancelDelete,
      addCard,
      updateCardDate,
    } = useBoard(user);

  return (
      <>
        <div className="min-h-screen bg-gray-50 p-6">
          <Board
            columns={columns}
            getColumnColor={getColumnColor}
            updateColumnTitle={updateColumnTitle}
            addLane={addLane}
            deleteLane={handleDeleteLane}
            moveCard={moveCard}
            moveLane={moveLane}
            updateCardTitle={updateCardTitle}
            updateCardTags={updateCardTags}
            availableTags={availableTags}
            addNewTag={addNewTag}
            toggleCardPriority={toggleCardPriority}
            toggleCardCompleted={toggleCardCompleted}
            updateCardDate={updateCardDate}
            addCard={addCard}
          />
        </div>
        <ConfirmationDialog
          isOpen={dialogOpen}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          message="This lane contains cards. Are you sure you want to delete it?"
        />
      </>
    );
};

const MainBoardWrapper = ({ user }) => (
  <DndProvider backend={HTML5Backend}>
    <MainBoard user={user} />
  </DndProvider>
);

export default MainBoardWrapper;
