import React from "react";
import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.id}`}
      state={{ name: category.name }}
      className="category-card"
    >
      <span>{category.name}</span>
      <img src={category.icons[0].url} alt={category.name} />
    </Link>
  );
}

export default CategoryCard;
