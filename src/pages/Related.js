import React from 'react';
import Card from './Card';

const Related = ({blogs, id}) => {
  return (
    <div>
        <div className="blog-heading text-start pt-3 py-2 mb-4">Related Recipes</div>
        <div className="col-md-12 text-left justify-content-center">
            <div className='row gx-5'>
                {blogs.length === 1 && (
                    <h5 className='text-center'>There aren't any recipes related to this one.</h5>
                )}
                {blogs?.filter((blogs) => blogs.id !== id).map((item) => (
                    <Card {...item} />
                ))}
            </div>
        </div>
    </div>
  )
}

export default Related;