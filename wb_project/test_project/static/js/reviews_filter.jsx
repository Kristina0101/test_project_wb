class ReviewsFilter extends React.Component {
    constructor(props) {
        super(props);
        const container = document.getElementById('reviews-filter');
        this.minLimit = Number(container.dataset.minReviews);
        this.maxLimit = Number(container.dataset.maxReviews);

        const urlParams = new URLSearchParams(window.location.search);
        const currentMin = urlParams.get('reviews_min');

        const initialMin = currentMin ? Number(currentMin) : 100;

        this.state = {
            minReviews: initialMin,
        };
    }

    handleMinChange = (e) => {
        const value = Number(e.target.value);
        this.setState({ minReviews: value });
    };
    
    handleMouseUp = () => {
        this.applyFilter(this.state.minReviews);
    };

    applyFilter = (min) => {
        const url = new URL(window.location.href);
        if (min > 0) {
            url.searchParams.set('reviews_min', min);
        } else {
            url.searchParams.delete('reviews_min');
        }
        url.searchParams.set('page', 1);
        
        const event = new Event('filterChanged');
        window.dispatchEvent(event);
        
        window.location.href = url.toString();
    };

    render() {
        const { minReviews } = this.state;
        const { minLimit, maxLimit } = this;

        return (
            <div className="reviews-filter-container">
                <h3>Фильтр по количеству отзывов</h3>
                <div className="reviews-slider">
                    <input
                        type="range"
                        min={minLimit}
                        max={maxLimit}
                        value={minReviews}
                        onChange={this.handleMinChange}
                        onMouseUp={this.handleMouseUp}
                    />
                </div>
                <div className="reviews-values">
                    <span>{minLimit}</span>
                    <span>{maxLimit}</span>
                </div>
                <div className="current-reviews">
                    От {minReviews}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<ReviewsFilter />, document.getElementById('reviews-filter'));