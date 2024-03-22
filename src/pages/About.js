import React, { useEffect } from 'react';

const About = ({setActive}) => {
  useEffect(() => {
    setActive("about");
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container-fluid mb-4">
      <div className="container">
      <div className="col-12">
      <div className="blog-heading text-center py-2 mb-4">About RecipeRolodex</div>
      <p>Welcome to RecipeRolodex, the ultimate recipe sharing platform where home cooks and professional chefs alike can discover, share, and discuss recipes. With RecipeRolodex, you can easily browse thousands of recipes covering every type of cuisine, course, ingredient, and dietary need imaginable. Upload and share your own cherished family recipes or find inspiration from our extensive collection of member contributions. Every recipe on RecipeRolodex includes a complete list of ingredients, step-by-step instructions, serving sizes, and photos showcasing the finished dish. Members can like their favorite recipes, leave reviews, and interact with other users by commenting and asking questions on recipe pages. Useful features like advanced search filters make RecipeRolodex an indispensable resource for home cooks. Whether you're an amateur wanting to expand your repertoire or a seasoned chef looking to try new techniques, RecipeRolodex has everything you need to cook with creativity and confidence. Join our food-obsessed community today!</p>
      </div>
      </div>
    </div>
  )
}

export default About