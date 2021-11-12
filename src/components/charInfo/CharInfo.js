import { useState, useEffect } from 'react';

import Spinner from '../spinner/Spiner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import MarvelService from '../../services/MarvelService';
import './charInfo.scss';

const CharInfo = (props) => {
    
    const [charHero, setCharHero] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const marvelService = new MarvelService();
    
    useEffect(() => {
        updateCharInfo();
    }, [props.charId])

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const onStateHero = (charHeros) => {
        setCharHero(charHeros);
        setLoading(false);
    }

    const updateCharInfo = () => {
        const {charId} = props;

        if(!charId){
            return;
        }

        marvelService.getCharacter(charId)
            .then(onStateHero)
            .catch(onError)
    }

    const skeleton = charHero || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !charHero) ? <View charHero={charHero}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
    
}

const View = ({charHero}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = charHero;

    let notComics = null;
    if(comics.length === 0){
        notComics = 'Not Comics';
    }


    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            <div/>
            <div className="char__descr">
               {description}
            </div>
            <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {notComics}
                    {   
                        comics.map((item, i) => {
                            if(i >= 10) {
                                return false;
                            }
                            return (
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                        })       
                    }
                        
                </ul>
            </div>
        </>
    )
}

export default CharInfo;