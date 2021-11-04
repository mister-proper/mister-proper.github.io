import React from 'react';
import { Component } from 'react';
import Spinner from '../spinner/Spiner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
import MarvelService from '../../services/MarvelService';


class CharList extends Component {
    
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onStateCharList)
            .catch(this.onError)

        this.marvelService.getTotalHero()
        .then(this.disableLoadMore);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    disableLoadMore = (total) => {
        if(total <= this.state.offset){
            this.setState({
                charEnded: !this.state.charEnded
            })
        }
    }

    onStateCharList = (newCharList) => {
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
    itemRefs = [];
    setRef = (elem) => {
        this.itemRefs.push(elem);
    }

    setSelected = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItem(arr){
        const items = arr.map((item, i) => {

            const newIcons = item.thumbnail.match(/image_not_available/g);
            let newPropStyle = {objectFit: 'cover'};
            if(newIcons){
                newPropStyle = {objectFit: 'contain'};
            }

            return (
                <li className="char__item" 
                    key={item.id}
                    tabIndex='0'
                    ref={this.setRef}
                    onClick={() =>{  
                        this.props.onCharSelected(item.id);
                        this.setSelected(i)
                        }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.setSelected(i);
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

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const item = this.renderItem(charList);
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
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    } 
}

export default CharList;