import React from "react";
import CategoryCard from "./CategoryCard";

function CategoryCardList({ categories }) {
  return (
    <div className="category-card-list">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

export default CategoryCardList;
