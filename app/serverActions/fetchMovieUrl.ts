"use server"

import axios from "axios"
import { headers } from '../utils'

export default async function fetchMovieUrl({supervideoUrl}: {supervideoUrl: string}) {

    const fetchSupervideoInfo = async (url: string): Promise<{ id: string, quality: string, hash: string }> => {
        const res = await axios.get(url, {
            headers
        })
        const html: string = res.data
        const regex = /download_video\('(.*?)',.*?'(.*?)',.*?'(.*?)'\)/
        const id = html.match(regex)?.[1]!
        const quality = html.match(regex)?.[2]!
        const hash = html.match(regex)?.[3]!
        return { id, quality, hash }
    }

    const fetchRawMovieUrl = async (downloadUrl: string) => {
        const res = await axios.get(downloadUrl, {
            headers
        })
        const html: string = res.data
        const regex = /[\"'](https.*?\.mp4)[\"']/
        const rawUrl = html.match(regex)?.[1]!
        return rawUrl
    }

    const buildDownloadUrl = (id: string, quality: string, hash: string): string => {
        return `https://supervideo.cc/dlf?op=download_orig&id=${id}&mode=${quality}&hash=${hash}`
    }

    try {
        const { id, quality, hash } = await fetchSupervideoInfo(supervideoUrl)
        const downloadUrl = buildDownloadUrl(id, quality, hash)
        const rawUrl = await fetchRawMovieUrl(downloadUrl)
        return rawUrl
    } catch (error) {
        console.error(error)
        return null
    }
}