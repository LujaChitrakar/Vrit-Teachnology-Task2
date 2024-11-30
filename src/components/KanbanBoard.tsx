import { useState, useEffect } from "react";
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

const KanbanBoard = () => {
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

  useEffect(() => {
    localStorage.setItem("kanbanBoard", JSON.stringify(columns));
  }, [columns]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    columnId: string,
    index: number
  ) => {
    if (event.key === "ArrowUp" && index > 0) {
      // Move task up within the same column
      const newColumns = { ...columns };
      const column = newColumns[columnId];
      const tasks = [...column.cards];
      const [removed] = tasks.splice(index, 1);
      tasks.splice(index - 1, 0, removed);
      newColumns[columnId] = { ...column, cards: tasks };
      setColumns(newColumns);
    }

    if (
      event.key === "ArrowDown" &&
      index < columns[columnId].cards.length - 1
    ) {
      // Move task down within the same column
      const newColumns = { ...columns };
      const column = newColumns[columnId];
      const tasks = [...column.cards];
      const [removed] = tasks.splice(index, 1);
      tasks.splice(index + 1, 0, removed);
      newColumns[columnId] = { ...column, cards: tasks };
      setColumns(newColumns);
    }
  };

  const updateColumns = (newColumns: typeof columns) => {
    setUndoStack((prev) => [...prev, columns]); // Save current state for undo
    setColumns(newColumns); // Update columns
    setRedoStack([]); // Clear redo stack on new change
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
    const newColumns = { ...columns }; // Create a copy of the current state
    delete newColumns[columnId]; // Remove the column
    updateColumns(newColumns); // Pass the updated object
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const updatedColumns = { ...columns };
    updatedColumns[columnId].cards = updatedColumns[columnId].cards.filter(
      (card) => card.id !== taskId
    );
    updateColumns(updatedColumns);
  };

  const undo = () => {
    if (undoStack.length === 0) return; // Nothing to undo

    const lastState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, columns]); // Save current state for redo
    setColumns(lastState); // Restore previous state
    setUndoStack((prev) => prev.slice(0, -1)); // Remove the last state
  };

  const redo = () => {
    if (redoStack.length === 0) return; // Nothing to redo

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
    setActiveColumnId(null); // Close the input field after adding task
  };

  const toggleTaskInput = (columnId: string) => {
    // Toggle task input visibility in the specific column
    setActiveColumnId((prevId) => (prevId === columnId ? null : columnId));
  };

  return (
    <div>
      <div className="flex space-x-2 pt-2 pr-6 justify-end">
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="bg-gray-300 flex items-center gap-1 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          <span>Undo</span>
          <FontAwesomeIcon icon={faArrowRotateLeft} />
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="bg-gray-300 flex items-center gap-1 text-black px-4 py-2 rounded-lg disabled:opacity-50"
        >
          <span>Redo</span>
          <FontAwesomeIcon icon={faArrowRotateRight} />
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 p-6">
          {Object.entries(columns).map(([id, column]) => (
            <Droppable key={id} droppableId={id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  tabIndex={0}
                  className="w-1/3 bg-gray-100 p-4 rounded-lg transition-transform duration-200 ease-in-out min-h-[200px]"
                >
                  <div className="flex justify-between mb-2 px-4">
                    <h2 className="font-semibold text-lg">{column.title}</h2>
                    <button
                      onClick={() => deleteColumn(id)}
                      className="text-red-500"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className="flex-1">
                    {column.cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 mb-2 rounded-lg shadow-md"
                          >
                            <div className="flex justify-between items-center">
                              <span>{card.title}</span>
                              <button
                                onClick={() => deleteTask(id, card.id)}
                                className="text-red-500"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                  <div className="flex mt-auto justify-center items-center flex-col">
                    {activeColumnId === id && (
                      <div className="mb-2">
                        <input
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddTask(id);
                          }}
                          className="w-full p-2 border rounded"
                          placeholder="Add a task..."
                        />
                      </div>
                    )}
                    <button
                      onClick={() => toggleTaskInput(id)}
                      className=" text-white w-[100px] rounded-md p-1 text-sm bg-blue-600"
                    >
                      {activeColumnId === id ? "Cancel" : "Add Task"}
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}{" "}
          <div
            className="gap-2 flex justify-center font-semibold items-center text-[16px] w-[300px] bg-gray-100 p-4 rounded-lg transition-transform duration-200 ease-in-out h-[60px] cursor-pointer"
            onClick={() => setIsAddingColumn(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> <span>Add a list</span>
          </div>
        </div>
        {isAddingColumn && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Enter column title"
                className="border p-2 w-full mb-4"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddColumn}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Add Column
                </button>
                <button
                  onClick={() => setIsAddingColumn(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
