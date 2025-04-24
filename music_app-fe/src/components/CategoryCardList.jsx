import React from "react";
import CategoryCard from "./CategoryCard";

function CategoryCardList({ categories, addToPlaylistId }) {
  return (
    <div className="category-card-list">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          addToPlaylistId={addToPlaylistId}
        />
      ))}
    </div>
  );
}

export default CategoryCardList;
