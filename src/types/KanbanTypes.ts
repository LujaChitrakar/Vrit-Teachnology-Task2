export interface Card {
  id: string;
  title: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface KanbanData {
  [key: string]: {
    id: string;
    title: string;
    cards: { id: string; title: string }[];
  };
}
