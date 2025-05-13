import React from "react";
import blockchain1 from "../assets/blockchain1.jpg";
import blockchain2 from "../assets/blockchain2.jpg";
import blockchain3 from "../assets/blockchain3.jpg";
import BlogCard from "./BlogCard";

export const BlogSection = () => {
  const blogs = [
    {
      title: "Интересная статья",
      description:
        "Описание интересной статьи",
      imgUrl: blockchain1,
    },
    {
      title: "Интересная статья",
      description:
        "Описание интересной статьи",
      imgUrl: blockchain2,
    },
    {
      title: "Интересная статья",
      description:
        "Описание интересной статьи",
      imgUrl: blockchain3,
    },
  ];
  return (
    <div className="blog-section-container">
      <div className="blog-section-header">
        <h1>
          Узнать больше о <span className="highlighted">AkimWallet</span>
        </h1>
        <button className="secondary">Подробнее</button>
      </div>
      <div className="blogs-container">
        {blogs.map((blog, index) => {
          return (
            <BlogCard
              key={index}
              title={blog.title}
              description={blog.description}
              imgUrl={blog.imgUrl}
            />
          );
        })}
      </div>
    </div>
  );
};