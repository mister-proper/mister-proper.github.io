import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=ce87658cb3f5268cd7eb8627ceb38eeb';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getTotalHero = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.total;
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getComicsAll = async (offset = _baseOffset) => {
        const res = await request(`https://gateway.marvel.com:443/v1/public/comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComicsById = async (id) => {
        const res = await request(`https://gateway.marvel.com:443/v1/public/comics/${id}?apikey=ce87658cb3f5268cd7eb8627ceb38eeb
        `);
        return res.data.results.map(_transformComics);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (char) => {
        return {
            id: char.id,
            description: char.description || 'There is no description',
            name: char.title,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            price: char.prices[0].price || 'not available',
            pageCount: char.pageCount,
            language: char.textObjects.language || 'en-us'
        }
    }
    return {loading, error, getAllCharacters, getTotalHero, getCharacter, getComicsAll, getComicsById, clearError};
}

export default useMarvelService;