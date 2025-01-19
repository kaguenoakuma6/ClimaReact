import axios from "axios";
import { z } from "zod";
//import {object, string, number, InferOutput, parse} from "valibot"
import { SearchType } from "../types";
import { useMemo, useState } from "react";

// type guard or assertion
// function isWeatherResponse(weather: unknown): weather is Weather
// {
//     return (
//         Boolean(weather) &&
//         typeof weather === 'object' &&
//         typeof (weather as Weather).name === 'string' &&
//         typeof (weather as Weather).main.temp === 'number' &&
//         typeof (weather as Weather).main.temp_max === 'number' &&
//         typeof (weather as Weather).main.temp_min === 'number' 
        
//     )
// }

const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
});

export type Weather = z.infer<typeof Weather>;

// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number()
//     })
// });
// type Weather = InferOutput<typeof WeatherSchema>;

const initialState = {
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0
    }
};

export default function useWheather() 
{
    const [weather, setWeather] = useState<Weather>(initialState);

    const API_KEY = import.meta.env.VITE_API_KEY;

    const [loading, setLoading] = useState(false);

    const [notFound, setNotFound] = useState(false);

    const fetchWheather= async (search: SearchType) => {

        setWeather(initialState);
        setNotFound(false);
        setLoading(true);

        
        try 
        {

            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${API_KEY}`;

            const {data} = await axios(geoUrl);

            // validar si se encontro la cuidad
            if(!data[0])
            {
                setNotFound(true);
                return;
            }

            const lat = data[0].lat;
            const lon = data[0].lon;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
            
            

            // Casteo de resultado
            // const {data: weather} = await axios<Weather>(weatherUrl);


            const {data: weather} = await axios(weatherUrl);

            // type guard's
            // const result = isWeatherResponse(weather);
            // if(result)
            // {
            //     console.log(weather.name);
            // }
            // else
            // {
            //     console.log('Error al procesar la respuesta');
            // }

            // Zod
            const result = Weather.safeParse(weather);
            if(result.success)
            {
                setWeather(result.data);
            }
            else
            {
                console.log('No se pudo procesar la respuesta...');
            }

            // Valibot
            // const result = parse(WeatherSchema, weather);
            // if(result)
            // {
            //     console.log(result);
            // }

            console.log(result);
            
        } 
        catch (error) 
        {
            console.log(error);
        }
        finally
        {
            setLoading(false);
        }

    }

    const hasWeatherData = useMemo( () => weather.name ,[weather])

    return {
        weather,
        loading,
        notFound,
        fetchWheather,
        hasWeatherData
    }
}