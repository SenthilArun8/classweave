'use client';

import { useState } from 'react';
import { FaBirthdayCake } from 'react-icons/fa';
import Link from 'next/link';

// component used for each student card

const Student = ({ student: person }) => { // "I expect a prop called student to be passed to this component."

    const [showFullDescription, setShowFullDescription] = useState(false);

    
    const capitalizeWords = (str) => {
        if (!str) return '';
        return str
            .split(' ')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ');
    };

    const capitalizeSentence = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };  

    if (!person) {
        return null;
    }

    // Create a description from personality and developmental stage
    const description = `${person.personality || ''}`.trim();
    const displayDescription = !showFullDescription && description.length > 90 
        ? description.substring(0, 90) + '...'
        : description;

    return (
        <div className='bg-white rounded-xl shadow-md relative'>
            <div className='p-4'>
                <div className='mb-6'>
                    <div className='pt-2'></div>
                    {/* <div className='text-gray-600 my-2'>{capitalizeWords(person.gender)}</div> */}
                    <h3 className='text-xl font-bold'>{capitalizeWords(person.name)}</h3>
                </div>

                {description && (
                    <div className='mb-5 text-emerald-900'>{displayDescription}</div>
                )}

                {description && description.length > 90 && (
                    <button
                        onClick={() => setShowFullDescription((prevState) => !prevState)}
                        className='text-emerald-700 mb-5 hover:text-emerald-800 font-semibold'
                    >
                        {showFullDescription ? 'Show Less' : 'Show More'}
                    </button>
                )}

                {/* Replace the single goals line with this goals section */}
                {person.goals && person.goals.length > 0 && (
                    <div className='mb-4'>
                        <h3 className='text-emerald-700 mb-2'>Goals:</h3>
                        <ul className='list-disc pl-5'>
                            {Array.isArray(person.goals) ? (
                                person.goals.map((goal, index) => (
                                    <li key={index} className='text-emerald-900 mb-1'>
                                        {capitalizeSentence(goal)}
                                    </li>
                                ))
                            ) : (
                                <li className='text-emerald-900'>{capitalizeSentence(person.goals)}</li>
                            )}
                        </ul>
                    </div>
                )}

                {person.developmental_stage && (
                    <h3 className='text-emerald-700 mb-2'>
                        Developmental Stage: <span className='text-emerald-900'>{capitalizeSentence(person.developmental_stage)}</span>
                    </h3>
                )}

                <div className='border border-[#d2b48c] mb-5'></div>

                <div className='flex flex-col lg:flex-row justify-between mb-4'>
                    {person.age_months && (
                        <div className='text-orange-700 mb-3'>
                            <FaBirthdayCake className='inline text-lg mb-1 mr-1' />
                            {person.age_months} months
                        </div>
                    )}
                    <Link
                        href={`/students/${person._id}`}
                        className='h-[36px] bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-center text-sm font-semibold transition'
                    >
                        Read More
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Student;
