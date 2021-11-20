import { useParams , Link} from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spiner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState([]);
    const {loading, error, getComicsById} = useMarvelService();

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest = () => {
        getComicsById(comicId)
            .then(getComic);
    }

    const getComic = (newComic) => {
        setComic(...newComic);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}


const View = ({comic}) => {
    const {name, thumbnail, description, pageCount, language, price} = comic;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt="x-men" className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr"><b>Pages:</b> {pageCount}</p>
                <p className="single-comic__descr"><b>language:</b> {language}</p>
                <div className="single-comic__price">{price}$</div>
            </div>
            <Link to='/comics' className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;