import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Spinner from '../spinner/Spiner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';


const CharList = (props) => {
    
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(301);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters, getTotalHero} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true); 
    }, [])

   const onRequest = (offset, initial) => {
       initial ? setNewItemLoading(false) : setNewItemLoading (true);
        getAllCharacters(offset)
            .then(onStateCharList);

        getTotalHero()
            .then(disableLoadMore);
    }

   const disableLoadMore = (total) => {
        if(total <= offset){
            setCharEnded(charEnded => !charEnded);
        }
    }

   const onStateCharList = (newCharList) => {
        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
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
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {item}
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