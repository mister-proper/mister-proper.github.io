import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spiner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(137);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getComicsAll} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true);
        getComicsAll(offset)
            .then(ViewFristComics);
    }


    const ViewFristComics = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setnewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    function renderComics (arr) {
        const item = arr.map((item, i)=> {
            return (
                <li className="comics__item"
                    key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price} $</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {item}
            </ul>
        )
    }
    const content = renderComics(comicsList);
    const spiner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    return (
        <div className="comics__list">
            {spiner}
            {errorMessage}
            {content}
            <button className="button button__main button__long"
                onClick={() => onRequest(offset)}
                disabled={newItemLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;