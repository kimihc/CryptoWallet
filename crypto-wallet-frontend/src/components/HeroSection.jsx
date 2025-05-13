import React from 'react'
import search from "../assets/icons/search.svg"
import { ReactComponent as TelegramIcon} from "../assets/icons/telegram.svg"
import { ReactComponent as TwitterIcon} from "../assets/icons/twitter.svg"
import { ReactComponent as YouTubeIcon} from "../assets/icons/youtube.svg"
import { ReactComponent as DiscordIcon} from "../assets/icons/discord.svg"
import hero from "../assets/hero.svg"

const HeroSection = () => {
  return (
    <div className='hero-section-container'>
        <div className='hero-info-wrapper'>
            <div className='hero-info-text'>
                <h1>
                    Это <span className='highlighted'>Крипто</span> Кошелек
                </h1>
                <p className='hero-info-description'>
                   Текста бахнуть
                </p>
                <div className='search-container'>
                    <div className='search-input-wrapper'>
                        <img className='search' src={search} alt='search'/>   
                        <input className='search-input' placeholder='Search tokens across 9 chains...'></input>
                    </div>
                    <button className='search-btn primary'>
                        <span className='start-swapping'>Сделать своа</span>
                    </button>

                </div>
            </div>
        </div>
        <div className='hero-image-container'>
            <div>
                <img className='hero-img' src={hero} alt='blockchain' />
            </div>
        </div>
    </div>
  )
}

export default HeroSection