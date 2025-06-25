class RatingFilter extends React.Component {
    constructor(props) {
        super(props);
        const container = document.getElementById('rating-filter');
        this.minLimit = Number(container.dataset.minRating);
        this.maxLimit = Number(container.dataset.maxRating);

        const urlParams = new URLSearchParams(window.location.search);
        const currentMin = urlParams.get('rating_min');

        const initialMin = currentMin ? Number(currentMin) : this.minLimit;

        this.state = {
            minRating: initialMin,
        };
    }

    handleMinChange = (e) => {
        const value = Number(e.target.value);
        this.setState({ minRating: value });
    };
    
    handleMouseUp = () => {
        this.applyFilter(this.state.minRating);
    };

    applyFilter = (min) => {
        const url = new URL(window.location.href);
        if (min > this.minLimit) {
            url.searchParams.set('rating_min', min);
        } else {
            url.searchParams.delete('rating_min');
        }
        url.searchParams.set('page', 1);
        window.location.href = url.toString();
    };

    render() {
        const { minRating } = this.state;
        const { minLimit, maxLimit } = this;

        return (
            <div className="rating-filter-container">
                <h3>Фильтр по рейтингу</h3>
                <div className="rating-slider">
                    <input
                        type="range"
                        min={minLimit}
                        max={maxLimit}
                        step="0.1"
                        value={minRating}
                        onChange={this.handleMinChange}
                        onMouseUp={this.handleMouseUp}
                    />
                </div>
                <div className="rating-values">
                    <span>{minLimit}</span>
                    <span>{maxLimit}</span>
                </div>
                <div className="current-rating">
                    От {minRating.toFixed(1)}
                </div>
            </div>
        );
    }
}
ReactDOM.render(<RatingFilter />, document.getElementById('rating-filter'));