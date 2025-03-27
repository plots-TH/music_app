import React from "react";
import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.id}`}
      state={{ name: category.name }}
      className="category-card"
    >
      <h2>{category.name}</h2>
      <img src={category.icons[0].url} alt={category.name} />
    </Link>
  );
}

export default CategoryCard;
