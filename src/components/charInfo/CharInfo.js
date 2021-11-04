import { Component } from 'react';

import Spinner from '../spinner/Spiner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import MarvelService from '../../services/MarvelService';
import './charInfo.scss';

class CharInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            charHero: null,
            error: false,
            loading: false
        }
    }

    marvelService = new MarvelService();
    
    componentDidMount() {
        this.updateCharInfo();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId){
            this.updateCharInfo();
        }

    }


    updateCharInfo = () => {
        const {charId} = this.props;

        if(!charId){
            return;
        }

        this.marvelService.getCharacter(charId)
            .then(this.onStateHero)
            .catch(this.onError)
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onStateHero = (charHero) => {
        this.setState({
            charHero,
            loading: false
        })
    }


    render(){
        const {charHero, loading, error} = this.state;

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