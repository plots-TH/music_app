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
      {/* For Deezer genres, use category.picture */}
      <img src={category.picture} alt={category.name} />
    </Link>
  );
}

export default CategoryCard;
