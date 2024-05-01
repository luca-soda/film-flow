"use client";

import { Roboto_Slab } from 'next/font/google'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
  Dialog, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useMemo, useState } from 'react'
import fetchSupervideoUrl from './serverActions/fetchSupervideoUrl'
import fetchMovieUrl from './serverActions/fetchMovieUrl';

const robotoSlab = Roboto_Slab({ subsets: ['latin'] })

export default function Home() {

  const [imdb, setImdb] = useState<string>()
  const [ttid, setTtid] = useState<string>()
  const [rawUrl, setRawUrl] = useState<string>()

  const getId = (imdb: string) => {
    const id = imdb.match(/tt\d+/g)?.[0]
    if (!id) {
      alert('La funzione di ricerca supporta solo link IMDB.\n\nDai uno sguardo alla guida rapida per maggiori informazioni')
      return 
    }
    return id
  }

  useEffect(() => {
    (async () => {
      if (ttid == null) {
        return
      }
      const supervideoUrl = await fetchSupervideoUrl({ ttid })
      if (supervideoUrl == null) {
        alert('IMDB non disponibile')
        return
      }
      const rawUrl = await fetchMovieUrl({ supervideoUrl: supervideoUrl })
      if (rawUrl == null) {
        alert('Supervideo non disponibile')
        return
      }
      setRawUrl(rawUrl)
    })();
  }, [ttid])

  return (
    <>
      <main className="flex h-screen flex-col items-center gap-20 justify-center text-white" style={{ backgroundColor: 'rgb(15, 17, 35)' }}>
        <h1 className={`text-7xl ${robotoSlab.className}`}>Film Flow</h1>
        {
          rawUrl != null &&
          <video src={rawUrl} autoPlay controls className="h-4/6" />
        }
        {
          rawUrl == null &&
          <>
            <img src="/logo.png" className="h-2/6" />
            <div className='flex flex-row w-6/12 gap-6 justify-center'>
              <Input className='w-5/6 text-black' placeholder='Imdb Link' value={imdb} onChange={(e) => setImdb(e.target.value)} />
              <img src='imdb.png' className='w-1/12' onClick={() => window.open('https://www.imdb.com/')}/>
              <Button className='w-1/6' type='submit' onClick={() => { setTtid(getId(imdb ?? '')) }}>Cerca</Button>
            </div>
            <Dialog>
              <DialogTrigger>Guida rapida</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Guida rapida</DialogTitle>
                  <DialogDescription>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>1. Accedi a IMDB</AccordionTrigger>
                        <AccordionContent>
                          Puoi accedere cliccando il logo sotto o tramite il tuo browser
                          <a href='https://www.imdb.com/' target="_blank" ><img src='imdb.png' className='w-2/12 mx-auto mt-5'  /></a>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>2. Cerca un film</AccordionTrigger>
                        <AccordionContent>
                          Cerca un film su IMDB. Per maggiore qualità, cerca film non troppo recenti né troppo datati
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>3. Copia il link</AccordionTrigger>
                        <AccordionContent>
                          Entra nella pagina della descrizion del film e copia in link in alto. Inizia con <span className='italic'>https://www.imdb.com/title/</span>
                          <img src='copy-link.png' className='w-8/12 mx-auto mt-5' />
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>4. Inizia a guardare il film!</AccordionTrigger>
                        <AccordionContent>
                          Incolla il link nella barra di ricerca di questa pagina e clicca su cerca
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        }
      </main>
    </>
  );
}
