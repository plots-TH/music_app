import React from "react";
import CategoryCard from "./CategoryCard";

function CategoryCardList({ categories, addToPlaylistId, addToPlaylistTitle }) {
  return (
    <div className="category-card-list">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          addToPlaylistId={addToPlaylistId}
          addToPlaylistTitle={addToPlaylistTitle}
        />
      ))}
    </div>
  );
}

export default CategoryCardList;
