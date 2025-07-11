import React from "react";
import TagCard from "./TagCard";

function TagCardList({ allTags }) {
  return (
    <div className="tag-card-list">
      {allTags.map((tag) => (
        <TagCard key={tag.id} name={tag.tag_name} />
      ))}
    </div>
  );
}

export default TagCardList;
