import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { KanbanData } from "../types/KanbanTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

interface KanbanBoardProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const storedColumns = localStorage.getItem("kanbanBoard");
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  const initialColumns = storedColumns
    ? JSON.parse(storedColumns)
    : {
        todo: {
          id: "todo",
          title: "To Do",
          cards: [
            { id: uuidv4(), title: "Task 1" },
            { id: uuidv4(), title: "Task 2" },
          ],
        },
        inProgress: {
          id: "inProgress",
          title: "In Progress",
          cards: [{ id: uuidv4(), title: "Task 3" }],
        },
        done: {
          id: "done",
          title: "Done",
          cards: [{ id: uuidv4(), title: "Task 4" }],
        },
      };

  const ensureUniqueIds = (columns: KanbanData) => {
    Object.keys(columns).forEach((columnId) => {
      columns[columnId].cards = columns[columnId].cards.map((card) => {
        return { ...card, id: uuidv4() }; // Regenerate card ID
      });
    });
    return columns;
  };

  const [columns, setColumns] = useState<KanbanData>(
    ensureUniqueIds(initialColumns)
  );
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");
  const [isAddingColumn, setIsAddingColumn] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("kanbanBoard", JSON.stringify(columns));
  }, [columns]);

  const updateColumns = (newColumns: typeof columns) => {
    setUndoStack((prev) => [...prev, columns]); // Save current state for undo
    setColumns(newColumns); // Update columns
    setRedoStack([]);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceCards = [...sourceColumn.cards];
    const destCards = [...destColumn.cards];

    if (source.droppableId !== destination.droppableId) {
      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);
    } else {
      const [movedCard] = sourceCards.splice(source.index, 1);
      sourceCards.splice(destination.index, 0, movedCard);
    }

    updateColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, cards: sourceCards },
      [destination.droppableId]: { ...destColumn, cards: destCards },
    });
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim() === "") return; // Prevent adding empty columns

    const newColumnId = uuidv4();
    const newColumn = {
      id: newColumnId,
      title: newColumnTitle,
      cards: [],
    };

    updateColumns({
      ...columns,
      [newColumnId]: newColumn,
    });
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = { ...columns };
    delete newColumns[columnId];
    updateColumns(newColumns);
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const updatedColumns = { ...columns };
    updatedColumns[columnId].cards = updatedColumns[columnId].cards.filter(
      (card) => card.id !== taskId
    );
    updateColumns(updatedColumns);
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, columns]); // Save current state for redo
    setColumns(lastState); // Restore previous state
    setUndoStack((prev) => prev.slice(0, -1)); // Remove the last state
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, columns]); // Save current state for undo
    setColumns(nextState); // Restore next state
    setRedoStack((prev) => prev.slice(0, -1)); // Remove the last state
  };

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim() === "") return; // Prevent adding empty tasks

    const newTask = {
      id: uuidv4(),
      title: newTaskTitle,
    };

    const updatedColumns = { ...columns };
    updatedColumns[columnId].cards.push(newTask);

    updateColumns(updatedColumns);
    setNewTaskTitle(""); // Clear task input
    setActiveColumnId(null);
  };

  const toggleTaskInput = (columnId: string) => {
    setActiveColumnId((prevId) => (prevId === columnId ? null : columnId));
  };

  const handleColumnFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColumn(e.target.value);
  };

  return (
    <div>
      {/* search and filter */}
      <div className="flex justify-between items-center mb-4 px-6 pt-5">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={selectedColumn}
          onChange={handleColumnFilter}
          className="ml-4 w-1/6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Columns</option>
          {Object.keys(columns).map((columnId) => (
            <option key={columnId} value={columnId}>
              {columns[columnId].title}
            </option>
          ))}
        </select>
      </div>

      {/* undo and re do */}
      <div className="flex space-x-2 pt-2 pr-6 justify-end">
        <div className="flex gap-5 py-2">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="bg-[#000000bd] flex items-center gap-1 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <span>Undo</span>
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="bg-[#000000bd] flex items-center gap-1 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <span>Redo</span>
            <FontAwesomeIcon icon={faArrowRotateRight} />
          </button>
        </div>
      </div>
      {/* kanban columns */}
      <div className="">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto p-4">
            {Object.keys(columns)
              .filter(
                (columnId) => !selectedColumn || columnId === selectedColumn
              )
              .map((columnId) => (
                <Droppable
                  droppableId={columnId}
                  key={columnId}
                  direction="vertical"
                >
                  {(provided) => (
                    <div
                      className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg transition-all duration-300"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="p-4">
                        {/* column header  */}
                        <div className="flex justify-between mb-2 px-2">
                          <h2 className="font-semibold text-lg">
                            {columns[columnId].title}
                          </h2>
                          <button
                            onClick={() => deleteColumn(columnId)}
                            className="text-red-500"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                        {/* column cards */}
                        <div>
                          {columns[columnId].cards
                            .filter((task) =>
                              task.title
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            )
                            .map((task, index) => (
                              <Draggable
                                draggableId={task.id}
                                index={index}
                                key={task.id}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-gray-200 mb-2 p-2 rounded-lg shadow-sm"
                                  >
                                    <div className="flex justify-between">
                                      <span>{task.title}</span>
                                      <button
                                        onClick={() =>
                                          deleteTask(columnId, task.id)
                                        }
                                        className="text-red-600"
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                        </div>
                        {/* add a new task */}
                        {activeColumnId === columnId && (
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              className="w-full px-2 py-2  border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              placeholder="Add a new task"
                            />
                            <button
                              onClick={() => handleAddTask(columnId)}
                              className="bg-blue-600 text-white h-[35px] text-[14px] w-[100px] rounded-lg"
                            >
                              Add Task
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => toggleTaskInput(columnId)}
                          className="mt-2 text-blue-500"
                        >
                          {activeColumnId === columnId ? "Cancel" : "Add Task"}
                        </button>
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            <div className="flex-shrink-0 w-80">
              {isAddingColumn ? (
                <div>
                  <input
                    type="text"
                    placeholder="New column title"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="mt-2 flex justify-between px-2">
                    <button
                      onClick={handleAddColumn}
                      className="bg-blue-600 text-white px-4 py-1 rounded-lg"
                    >
                      Add Column
                    </button>
                    <button
                      onClick={() => setIsAddingColumn(false)}
                      className="text-white bg-red-600 px-4 py-1 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="w-full bg-gray-300 text-black px-4 py-2 rounded-lg"
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Column
                </button>
              )}
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
