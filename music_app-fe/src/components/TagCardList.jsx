import React from "react";
import TagCard from "./TagCard";

function TagCardList({ allTags, activeTags, onToggleTag }) {
  console.log("TagCardList props:", { allTags, activeTags, onToggleTag });
  console.log("[tagCardList] activeTags:", activeTags);
  return (
    <div className="tag-card-list">
      {allTags.map((tag) => (
        <TagCard
          key={tag.id}
          name={tag.tag_name}
          active={activeTags.some((activeTag) => activeTag.tag_id === tag.id)}
          onClick={() => onToggleTag(tag.id)}
        />
      ))}
    </div>
  );
}

export default TagCardList;
