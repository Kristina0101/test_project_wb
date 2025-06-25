const SortingComponent = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const [sortBy, setSortBy] = React.useState(urlParams.get('sort_by') || '');
    const [sortOrder, setSortOrder] = React.useState(urlParams.get('sort_order') || 'asc');

    const page = urlParams.get('page') || 1;
    const priceMin = urlParams.get('price_min');
    const priceMax = urlParams.get('price_max');
    const ratingMin = urlParams.get('rating_min');

    const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortBy === field) {
            newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }

        setSortBy(field);
        setSortOrder(newSortOrder);

        let newUrl = `?page=${page}`;
        if (priceMin) newUrl += `&price_min=${priceMin}`;
        if (priceMax) newUrl += `&price_max=${priceMax}`;
        if (ratingMin) newUrl += `&rating_min=${ratingMin}`;
        newUrl += `&sort_by=${field}&sort_order=${newSortOrder}`;

        window.location.href = newUrl;
    };

    const renderSortIndicator = (field) => {
        if (sortBy !== field) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="sorting-container">
            <h4>Сортировка:</h4>
            <button 
                onClick={() => handleSort('name')}
                className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
            >
                По названию {renderSortIndicator('name')}
            </button>
            <button 
                onClick={() => handleSort('price')}
                className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
            >
                По цене {renderSortIndicator('price')}
            </button>
            <button 
                onClick={() => handleSort('rating')}
                className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
            >
                По рейтингу {renderSortIndicator('rating')}
            </button>
            <button 
                onClick={() => handleSort('reviews_count')}
                className={`sort-btn ${sortBy === 'reviews_count' ? 'active' : ''}`}
            >
                По количеству отзывов {renderSortIndicator('reviews_count')}
            </button>
        </div>
    );
};


const sortingContainer = document.getElementById('sorting-container');
if (sortingContainer) {
    ReactDOM.render(<SortingComponent />, sortingContainer);
}
const event = new Event('filterChanged');
window.dispatchEvent(event);