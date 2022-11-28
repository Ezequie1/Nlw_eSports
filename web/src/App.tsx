import { useState, useEffect } from 'react'
import { CreateAdBunner } from './components/CreateAdBunner'
import { GameBunner } from './components/GameBunner'
import './styles/main.css'
import logoImage from '/logo.svg'
import * as Dialog from '@radix-ui/react-dialog'
import { CreateAdModal } from './components/CreateAdModal'

interface Game {
  id: string
  title: string
  bannerUrl: string
  _count: {
    ads: number
  }
}

function App() {
  const [games , setGames] = useState<Game[]>([])

  useEffect(() =>
   { fetch('http://localhost:8080/games')
   .then(response => response.json())
   .then(data => {
    setGames(data)
   })
  }, [])
  return(
  <div className="max-w-[1344px] mx-auto flex flex-col items-center m-20">
    <img src={logoImage} alt="" />
    <h1 className='text-6xl text-white font-black mt-28'>
      Seu <span className='text-transparent bg-nlwGradient bg-clip-text'>duo</span> está aqui.
    </h1>

    <div className='grid grid-cols-6 gap-6 mt-16'>

      {games.map(game =>{
        return(
          <GameBunner
           key={game.id}
           bannerUrl={game.bannerUrl}
           title= { game.title } 
           adsCount={ game._count.ads}/>
        )
      })}
    </div>
    <Dialog.Root>
      <CreateAdBunner/>
      <CreateAdModal/>
    </Dialog.Root>   
  </div>
  ) 
}
   
export default App
