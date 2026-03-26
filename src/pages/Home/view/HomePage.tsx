import React from 'react'
import { HomeHeroSection } from '../component/HomeHeroSection'
import { TestCountContainer } from '../component/TestCountContainer'
import { TravelTypePreviewSection } from '../component/TravelTypePreviewSection'

export const HomePage: React.FC = () => {
    console.log('Home Page')
    return (
        <div className="min-h-full overflow-y-auto bg-gradient-to-b from-background to-warm/20 px-6 pb-24 pt-12">
            <TestCountContainer />
            <HomeHeroSection />
            <TravelTypePreviewSection />
        </div>
    )
}
