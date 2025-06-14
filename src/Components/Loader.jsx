import React from 'react';

const Loader = ({ isPage = false }) => {
    return (
        <div className={isPage
            ? " absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 loading"
            : "flex justify-center loading items-center py-4"}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}

export default Loader;
