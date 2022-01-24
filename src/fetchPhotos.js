import axios from "axios";
import Notiflix from "notiflix";

export async function fetchPhotos(data, page) {
    const BASE_URL = 'https://pixabay.com/api/';
    const key = '?key=25390634-4c32e13f52f3d8663f768ede1';
    const filters = `&q=${data}&image_type=photo&orientation=horizontal&safesearch=trueper_page=40&page=${page}`;

    return await axios.get(`${BASE_URL}${key}${filters}`)
        .then(r => r.data)
        .catch(error => {
            if (error.response.status === 400) {
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
            }
        })
        
}