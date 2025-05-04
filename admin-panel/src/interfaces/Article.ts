
type Block =
  | { type: "text"; data: string }
  | { type: "image"; data: string }
  | { type: "video"; data: string };
  export interface Article {
    _id: string;
    title: string;
    blocks: Block[];
    updatedAt: string;
  }