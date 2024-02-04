import React from 'react';
import { Link } from 'react-router-dom';
import { excerpt } from '../utility';

const Card = ({title, description, imgUrl, id}) => {
  return (
    <div>
        <div>
            <div className="related-content card text-decoration-none overflow-hidden h-100">
                <img 
                    className="related-img card-img-top"
                    src={imgUrl}
                    alt={title}
                />
                <div className="related-body card-body p-4">
                    <h5 className="title text-start py-2">{title}</h5>
                    <p className="short-description text-start">{excerpt(description, 10)}</p>
                    <div className="flex justify-content-between">
                        <Link to={`/detail/${id}`} style={{textDecoration: "none"}}>
                            <span className="text-primary">Read More</span>
                        </Link>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card