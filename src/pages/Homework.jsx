import React from 'react';
import { SearchBar, Sidebar } from '../components';
import CarouselApp from '../components/charts/Carousel';

function Homework() {
  return (
    <div className='flex container gap-10'>
      <Sidebar /> 
      <div className='w-full'>
        <SearchBar flex={"flex"} />
        <CarouselApp theme="Present Simple" video={100} homework={40} />
        <CarouselApp theme="Present Perfect" video={100} homework={100} />
        <CarouselApp theme="Past Simple" video={0} homework={0} /> {/* Pass all props */}
        <CarouselApp theme="To be" video={80} homework={0} /> {/* Pass all props */}
      </div>
    </div>
  );
}

export default Homework;
