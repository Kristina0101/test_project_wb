class LinearChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true
        };
        this.chartRef = React.createRef();
        this.chartInstance = null;
    }

    componentDidMount() {
        this.fetchData();
        window.addEventListener('filterChanged', this.fetchData);
    }

    componentWillUnmount() {
        window.removeEventListener('filterChanged', this.fetchData);
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
    }

    fetchData = () => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        
        this.setState({ loading: true });
        
        fetch(`/api/products/grafics_histogram/?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                const processedData = this.processData(data.results || data);
                this.setState({ data: processedData, loading: false }, this.renderChart);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.setState({ loading: false });
            });
    };

    processData = (products) => {
        return products.map(product => ({
            rating: product.rating,
            discount: ((product.price - product.sale_price) / product.price * 100).toFixed(2)
        })).sort((a, b) => a.rating - b.rating);
    };

    renderChart = () => {
        const { data } = this.state;
        const ctx = this.chartRef.current.getContext('2d');
        
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.rating),
                datasets: [{
                    label: 'Размер скидки (%)',
                    data: data.map(item => item.discount),
                    backgroundColor: '#aae6d9',
                    borderColor: '#426c63',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#426c63',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Рейтинг товара'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Размер скидки (%)'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Скидка: ${context.parsed.y}%`;
                            },
                            afterLabel: function(context) {
                                return `Рейтинг: ${context.label}`;
                            }
                        }
                    }
                }
            }
        });
    };

    render() {
        const { loading } = this.state;
        
        return (
            <div className="linear-chart-container" style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0', height: '400px', width: '400px' }}>
                <h3>Размер скидки vs Рейтинг товара</h3>
                {loading ? (
                    <div className="loading">Загрузка данных...</div>
                ) : (
                    <div style={{ position: 'relative', height: '350px' }}>
                        <canvas ref={this.chartRef}></canvas>
                    </div>
                )}
            </div>
        );
    }
}

ReactDOM.render(<LinearChart />, document.querySelector('.linear_graph'));