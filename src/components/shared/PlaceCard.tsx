import { MapPinIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Place } from '../../data/mockData'
import { Card } from '../ui/Card'
interface PlaceCardProps {
    place: Place
}
export const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    const navigate = useNavigate()
    return (
        <Card hoverable className="cursor-pointer flex flex-col h-full" onClick={() => navigate(`/place/${place.id}`)}>
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-text mb-1">{place.name}</h3>
                <div className="flex items-center text-text-muted text-sm mb-3">
                    <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                    <span className="truncate">{place.location}</span>
                </div>
                <p className="text-sm text-text-muted line-clamp-2 mb-4 flex-grow">{place.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {place.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="text-xs font-medium text-primary bg-primary-light/20 px-2 py-1 rounded-md"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    )
}
