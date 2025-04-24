import React from "react";
import { Link } from "react-router-dom";

function CategoryCard({ category, addToPlaylistId }) {
  return (
    <Link
      to={`/category/${category.id}`}
      state={{ name: category.name, addToPlaylistId }}
      className="category-card"
    >
      <span>{category.name}</span>
      {/* For Deezer genres, use category.picture */}
      <img src={category.picture} alt={category.name} />
    </Link>
  );
}

export default CategoryCard;
