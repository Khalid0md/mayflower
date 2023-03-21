export interface Post {
  node: {
    name: string;
    website: string;
    description: string;
    votesCount: number;
    createdAt: string;
    tagline: string;
    topics: {
      edges: {
        node: {
          name: string;
        };
      }[]; //?what is going on here?
    };
    thumbnail: {
      url: string;
    };
  };
}
