'use client'
import { useEffect, useState } from 'react'
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'

declare global {
    interface Window {
        kakao: any
    }
}

interface KakaoMapProps {
    name: string
}

interface PlaceType {
    place_name: string
    address_name: string
    road_address_name: string
    phone: string
    x: string
    y: string
}

export default function KakaoMap({ name }: KakaoMapProps) {
    const [map, setMap] = useState<kakao.maps.Map | null>(null)
    const [places, setPlaces] = useState<PlaceType[]>([])
    const [selected, setSelected] = useState<PlaceType | null>(null)

    const [loading, error] = useKakaoLoader({
        appkey: import.meta.env.VITE_KAKAO_API_KEY,
        libraries: ['services'],
    })

    useEffect(() => {
        if (!map || loading || !name) return

        const ps = new window.kakao.maps.services.Places()

        const callback = (data: PlaceType[], status: kakao.maps.services.Status) => {
            if (status !== window.kakao.maps.services.Status.OK) return

            const bounds = new window.kakao.maps.LatLngBounds()
            const sliced = data.slice(0, 5)

            setPlaces(sliced)

            sliced.forEach((place) => {
                bounds.extend(new window.kakao.maps.LatLng(Number(place.y), Number(place.x)))
            })

            map.setBounds(bounds)
        }

        ps.keywordSearch(name, callback)
    }, [map, name, loading])

    if (loading) return <div>로딩중...</div>
    if (error) return <div>에러 발생</div>

    return (
        <div className="relative w-full h-[350px] overflow-hidden transition-transform duration-500 hover:scale-110">
            <Map center={{ lat: 37.566826, lng: 126.9786567 }} className="w-full h-full" level={3} onCreate={setMap}>
                {places.map((place, i) => (
                    <MapMarker
                        key={`${place.place_name}-${place.x}-${place.y}`}
                        position={{
                            lat: Number(place.y),
                            lng: Number(place.x),
                        }}
                        onClick={() => {
                            setSelected(place)
                            map?.panTo(new window.kakao.maps.LatLng(Number(place.y), Number(place.x)))
                        }}
                    >
                        {selected?.x === place.x && selected?.y === place.y && (
                            <div className="p-[5px] text-black">{place.place_name}</div>
                        )}
                    </MapMarker>
                ))}
                <div
                    id="menu_wrap"
                    className="absolute top-[10px] left-[10px] w-[150px] max-h-[40%] overflow-y-auto bg-white/90 rounded-[10px] p-[10px] z-[2]"
                >
                    <hr />

                    <ul id="placesList">
                        {places.map((place, i) => (
                            <li
                                key={i}
                                className="border-b border-gray-300 p-[5px] cursor-pointer text-[10px]"
                                onClick={() => {
                                    setSelected(place)
                                    map?.panTo(new window.kakao.maps.LatLng(Number(place.y), Number(place.x)))
                                }}
                            >
                                <span className={`markerbg marker_${i + 1}`} />

                                <div className="info">
                                    <div className="font-bold">
                                        {i + 1}. {place.place_name}
                                    </div>

                                    {place.road_address_name ? (
                                        <>
                                            <span>{place.road_address_name}</span>
                                            <span className="text-gray-400">{place.address_name}</span>
                                        </>
                                    ) : (
                                        <span>{place.address_name}</span>
                                    )}

                                    <span className="text-green-500">{place.phone}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Map>
        </div>
    )
}
