import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Spinner from '../spinner/Spiner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
import MarvelService from '../../services/MarvelService';


const CharList = (props) => {
    
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest(); 
    }, [])

   const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onStateCharList)
            .catch(onError)

        marvelService.getTotalHero()
        .then(disableLoadMore);
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

   const disableLoadMore = (total) => {
        if(total <= offset){
            setCharEnded(charEnded => !charEnded);
        }
    }

   const onStateCharList = (newCharList) => {
        setCharList(charList => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemRefs = useRef([]);

    const setSelected = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItem(arr){
        const items = arr.map((item, i) => {

            const newIcons = item.thumbnail.match(/image_not_available/g);
            let newPropStyle = {objectFit: 'cover'};
            if(newIcons){
                newPropStyle = {objectFit: 'contain'};
            }

            return (
                <li className="char__item" 
                    key={item.id}
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() =>{  
                            props.onCharSelected(item.id);
                            setSelected(i)
                        }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            setSelected(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={newPropStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const item = renderItem(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? item : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                className="button button__main button__long"
                disabled={charEnded || newItemLoading}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;