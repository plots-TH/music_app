import React from "react";
import { Link } from "react-router-dom";

function CategoryCard({ category, addToPlaylistId, addToPlaylistTitle }) {
  return (
    <Link
      to={`/category/${category.id}`}
      state={{ name: category.name, addToPlaylistId, addToPlaylistTitle }}
      className="category-card"
    >
      <span>{category.name}</span>
      {/* For Deezer genres, use category.picture */}
      <img src={category.picture} alt={category.name} />
    </Link>
  );
}

export default CategoryCard;
