import  express  from "express";
import  cors  from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHoursStringToMinutes } from "./utils/convert-hours";
import { convertMinutesStringToHours } from "./utils/convert-minutes";

const app = express()
app.use(cors())
app.use(express.json())
const prisma = new PrismaClient()

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
         include : { 
            _count : {
                select : {
                    ads: true
                }
            }
        }
    }
    )
    return response.status(200).json(games)
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId: any = request.params.id
    const ads: any = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlayng: true,
            hourStart: true,
            hourEnd: true
        },
        where: {
            gameId,
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    return response.status(201).json(ads.map( ad=> {
        return {
            ...ad, 
            weekDays:ad.weekDays.split(','),
            hourStart: convertMinutesStringToHours(ad.hourStart),
            hourEnd: convertMinutesStringToHours(ad.hourEnd)
        }
    }))
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id
    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
    return response.json({discord : ad.discord})
})

app.post('/games/:id/ads', async (request, response) => {

    const gameId = await request.params.id
    const body: any= request.body
    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlayng: body.yearsPlayng,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHoursStringToMinutes(body.hourStart),
            hourEnd: convertHoursStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })
    return response.status(201).json(ad)
})

app.listen(8080)