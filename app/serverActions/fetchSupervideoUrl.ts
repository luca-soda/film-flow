"use server"

import axios from "axios"
import { headers } from "../utils"

export default async function fetchSupervideoUrl({ttid}: {ttid: string}) {

    const fetchSupervideoId = async (ttid: string) => {
        const baseUrl = Buffer.from('aHR0cHM6Ly9tb3N0cmFndWFyZGEuc3RyZWFtL3NldC1tb3ZpZS1h', 'base64').toString('utf-8')
        const res = await axios.get(`${baseUrl}/${ttid}`, {
            headers
        })
        const regex = /supervideo\.cc\/e\/(.*?)['\"]/
        const url = res.data.match(regex)?.[1]
        return url
    }

    const buildSupervideoUrl = (id: string) => {
        return `https://supervideo.cc/${id}`
    }

    try {
        const id = await fetchSupervideoId(ttid)
        if (id == null) {
            throw Error('id == null')
        }
        const url = buildSupervideoUrl(id)
        return url
    } catch (error) {
        console.error(error)
        return null
    }
}